from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import re
import time
from collections.abc import Awaitable, Callable
from decimal import Decimal
from typing import Any, Mapping

from pydantic import BaseModel, ValidationError

logger = logging.getLogger("agents.tool_runtime")

_CACHE: dict[str, dict[str, Any]] = {}
_TOOL_REGISTRY: dict[str, Callable[..., Awaitable[Any]]] = {}
_CANONICAL_FALLBACK = {
    "retry_attempts": 3,
    "base_delay_ms": 250,
    "rate_limit_extra_retry": 1,
    "notify_human": True,
}

_SENSITIVE_KEYWORDS = {"password", "passwd", "secret", "token", "authorization", "api_key", "key", "cpf", "cnpj", "email", "phone", "credit_card"}
_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_CPF_RE = re.compile(r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b")
_CARD_RE = re.compile(r"\b(?:\d[ -]*?){13,16}\b")


class ToolExecutionError(RuntimeError):
    """Raised when tool execution fails."""



def register_tool(name: str, handler: Callable[..., Awaitable[Any]]) -> None:
    _TOOL_REGISTRY[name] = handler


def get_tool(name: str) -> Callable[..., Awaitable[Any]]:
    if name not in _TOOL_REGISTRY:
        raise ToolExecutionError(f"Tool '{name}' is not registered")
    return _TOOL_REGISTRY[name]


def _normalize_for_json(value: Any) -> Any:
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, bytes):
        return value.decode("utf-8", errors="replace")
    if isinstance(value, Mapping):
        return {str(k): _normalize_for_json(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [_normalize_for_json(v) for v in value]
    return str(value)


def redact_sensitive_data(value: Any) -> Any:
    value = _normalize_for_json(value)
    if isinstance(value, dict):
        redacted: dict[str, Any] = {}
        for key, item in value.items():
            lowered = key.lower()
            redacted[key] = "[REDACTED]" if any(token in lowered for token in _SENSITIVE_KEYWORDS) else redact_sensitive_data(item)
        return redacted
    if isinstance(value, list):
        return [redact_sensitive_data(item) for item in value]
    if isinstance(value, str):
        masked = _EMAIL_RE.sub("[REDACTED_EMAIL]", value)
        masked = _CPF_RE.sub("[REDACTED_CPF]", masked)
        return _CARD_RE.sub("[REDACTED_CARD]", masked)
    return value


def _estimate_cost_usd(input_payload: Any, output_payload: Any, elapsed_s: float) -> float:
    input_tokens = max(1, len(json.dumps(_normalize_for_json(input_payload), ensure_ascii=False)) // 4)
    output_tokens = max(1, len(json.dumps(_normalize_for_json(output_payload), ensure_ascii=False)) // 4)
    return round((input_tokens + output_tokens) * 0.0000005 + elapsed_s * 0.00001, 6)


def _cache_key(tool_name: str, payload: dict[str, Any]) -> str:
    raw = json.dumps({"tool": tool_name, "payload": _normalize_for_json(payload)}, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _resolve_fallback_behavior(fallback_behavior: Mapping[str, Any] | None) -> dict[str, Any]:
    merged = dict(_CANONICAL_FALLBACK)
    if fallback_behavior:
        for key, value in fallback_behavior.items():
            merged[key] = value

    retry_attempts = merged.get("retry_attempts", _CANONICAL_FALLBACK["retry_attempts"])
    base_delay_ms = merged.get("base_delay_ms", _CANONICAL_FALLBACK["base_delay_ms"])
    rate_limit_extra_retry = merged.get("rate_limit_extra_retry", _CANONICAL_FALLBACK["rate_limit_extra_retry"])

    return {
        "retry_attempts": max(1, int(retry_attempts)),
        "base_delay_ms": max(1, int(base_delay_ms)),
        "rate_limit_extra_retry": max(0, int(rate_limit_extra_retry)),
        "notify_human": bool(merged.get("notify_human", True)),
    }


def _is_http_429(error: Exception) -> bool:
    response = getattr(error, "response", None)
    status_code = getattr(response, "status_code", None)
    return status_code == 429


def _compute_backoff_seconds(attempt: int, base_delay_ms: int) -> float:
    return (base_delay_ms * (2 ** max(0, attempt - 1))) / 1000


async def _notify_human(*, tool_name: str, payload: dict[str, Any], reason: str) -> bool:
    logger.warning(
        "Tool escalation requested",
        extra={
            "tool": tool_name,
            "reason": reason,
            "payload": redact_sensitive_data(payload),
        },
    )
    return True


async def run_tool(
    *,
    tool_name: str,
    handler: Callable[..., Awaitable[Any]] | None = None,
    payload: dict[str, Any],
    validation_model: type[BaseModel] | None = None,
    timeout_s: float = 10.0,
    idempotent: bool = False,
    fallback_behavior: Mapping[str, Any] | None = None,
) -> dict[str, Any]:
    # [SOURCE] checklist agent templates — M-001
    started = time.perf_counter()
    safe_payload = redact_sensitive_data(payload)
    fallback = _resolve_fallback_behavior(fallback_behavior)

    try:
        if validation_model is not None:
            payload = validation_model(**payload).model_dump()
    except ValidationError as exc:
        elapsed = time.perf_counter() - started
        return {
            "ok": False,
            "data": None,
            "error": f"Input validation failed: {exc.errors()}",
            "meta": {
                "tool": tool_name,
                "cached": False,
                "duration_ms": int(elapsed * 1000),
                "cost_usd": 0.0,
                "attempts": 0,
                "human_notified": False,
                "fallback_stage": "validation_error",
            },
        }

    if idempotent:
        key = _cache_key(tool_name, payload)
        if key in _CACHE:
            return {
                "ok": True,
                "data": _CACHE[key],
                "error": None,
                "meta": {
                    "tool": tool_name,
                    "cached": True,
                    "duration_ms": 0,
                    "cost_usd": 0.0,
                    "attempts": 0,
                    "human_notified": False,
                    "fallback_stage": "cache_hit",
                },
            }

    try:
        tool_handler = handler or get_tool(tool_name)
    except ToolExecutionError as exc:
        elapsed = time.perf_counter() - started
        human_notified = (
            await _notify_human(tool_name=tool_name, payload=payload, reason="tool_unavailable")
            if fallback["notify_human"]
            else False
        )
        return {
            "ok": False,
            "data": None,
            "error": str(exc),
            "meta": {
                "tool": tool_name,
                "cached": False,
                "duration_ms": int(elapsed * 1000),
                "cost_usd": 0.0,
                "attempts": 0,
                "human_notified": human_notified,
                "fallback_stage": "tool_unavailable",
            },
        }

    rate_limit_retries_left = fallback["rate_limit_extra_retry"]
    last_error: Exception | None = None
    attempts = 0

    for attempt in range(1, fallback["retry_attempts"] + 1):
        attempts = attempt
        try:
            result = await asyncio.wait_for(tool_handler(**payload), timeout=timeout_s)
            normalized_result = _normalize_for_json(result)
            if idempotent:
                _CACHE[_cache_key(tool_name, payload)] = normalized_result

            elapsed = time.perf_counter() - started
            logger.info("Tool executed", extra={"tool": tool_name, "duration_ms": int(elapsed * 1000)})
            return {
                "ok": True,
                "data": normalized_result,
                "error": None,
                "meta": {
                    "tool": tool_name,
                    "cached": False,
                    "duration_ms": int(elapsed * 1000),
                    "cost_usd": _estimate_cost_usd(payload, normalized_result, elapsed),
                    "attempts": attempts,
                    "human_notified": False,
                    "fallback_stage": "none",
                },
            }
        except asyncio.TimeoutError as exc:
            last_error = exc
            logger.warning("Tool timeout", extra={"tool": tool_name, "payload": safe_payload})
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            if _is_http_429(exc) and rate_limit_retries_left > 0:
                rate_limit_retries_left -= 1
                wait_s = _compute_backoff_seconds(attempt, fallback["base_delay_ms"])
                await asyncio.sleep(wait_s)
                continue
            logger.exception("Tool execution failure", extra={"tool": tool_name, "payload": safe_payload})

        if attempt < fallback["retry_attempts"]:
            wait_s = _compute_backoff_seconds(attempt, fallback["base_delay_ms"])
            await asyncio.sleep(wait_s)

    elapsed = time.perf_counter() - started
    if last_error is None:
        last_error = RuntimeError("Unknown tool execution error")

    fallback_stage = "http_429_exhausted" if _is_http_429(last_error) else "exhausted"
    human_notified = (
        await _notify_human(tool_name=tool_name, payload=payload, reason=fallback_stage)
        if fallback["notify_human"]
        else False
    )

    return {
        "ok": False,
        "data": None,
        "error": str(last_error),
        "meta": {
            "tool": tool_name,
            "cached": False,
            "duration_ms": int(elapsed * 1000),
            "cost_usd": 0.0,
            "attempts": attempts,
            "human_notified": human_notified,
            "fallback_stage": fallback_stage,
        },
    }
