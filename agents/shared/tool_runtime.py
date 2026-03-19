from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import re
import time
from collections.abc import Awaitable, Callable
from decimal import Decimal
from typing import Any, Mapping, TypedDict

import httpx
from pydantic import BaseModel, ValidationError

# [SOURCE] checklist de agent templates — M-001 item

logger = logging.getLogger("agents.tool_runtime")

_CACHE: dict[str, dict[str, Any]] = {}
_TOOL_REGISTRY: dict[str, Callable[..., Awaitable[Any]]] = {}

_SENSITIVE_KEYWORDS = {
    "password",
    "passwd",
    "secret",
    "token",
    "authorization",
    "api_key",
    "key",
    "cpf",
    "cnpj",
    "email",
    "phone",
    "credit_card",
}
_EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
_CPF_RE = re.compile(r"\b\d{3}\.\d{3}\.\d{3}-\d{2}\b")
_CARD_RE = re.compile(r"\b(?:\d[ -]*?){13,16}\b")


class ToolUnavailablePolicy(TypedDict):
    retry_attempts: int
    backoff_strategy: str
    base_delay_ms: int


class Http429Policy(TypedDict):
    wait_ms: int
    retry_attempts: int


class ExhaustedPolicy(TypedDict):
    notify_human: bool
    silence: bool
    loop: bool


class FallbackBehavior(TypedDict):
    tool_unavailable: ToolUnavailablePolicy
    http_429: Http429Policy
    exhausted: ExhaustedPolicy


CANONICAL_FALLBACK_BEHAVIOR: FallbackBehavior = {
    "tool_unavailable": {
        "retry_attempts": 3,
        "backoff_strategy": "exponential",
        "base_delay_ms": 500,
    },
    "http_429": {
        "wait_ms": 1_000,
        "retry_attempts": 1,
    },
    "exhausted": {
        "notify_human": True,
        "silence": False,
        "loop": False,
    },
}


class ToolExecutionError(RuntimeError):
    """Raised when tool execution fails."""


def _resolve_fallback_behavior(candidate: Mapping[str, Any] | None) -> FallbackBehavior:
    resolved: FallbackBehavior = json.loads(json.dumps(CANONICAL_FALLBACK_BEHAVIOR))
    if not candidate:
        return resolved

    for section in ("tool_unavailable", "http_429", "exhausted"):
        section_value = candidate.get(section)
        if not isinstance(section_value, Mapping):
            continue
        for key, value in section_value.items():
            if key not in resolved[section]:
                continue
            expected_type = type(resolved[section][key])  # type: ignore[index]
            if isinstance(value, expected_type):
                resolved[section][key] = value  # type: ignore[index]
    return resolved


def _is_tool_unavailable_error(exc: Exception) -> bool:
    if isinstance(exc, ToolExecutionError):
        message = str(exc).lower()
        return "not registered" in message or "unavailable" in message
    return False


def _is_http_429_error(exc: Exception) -> bool:
    return isinstance(exc, httpx.HTTPStatusError) and exc.response.status_code == 429


def _extract_retry_after_ms(exc: Exception) -> int | None:
    if not isinstance(exc, httpx.HTTPStatusError):
        return None

    retry_after = exc.response.headers.get("Retry-After")
    if not retry_after:
        return None

    try:
        return max(0, int(float(retry_after) * 1000))
    except ValueError:
        return None


def _notify_human(tool_name: str, error_message: str) -> None:
    logger.error(
        "Tool execution requires human notification",
        extra={
            "tool": tool_name,
            "error": error_message,
            "notification": "human_required",
        },
    )


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
            redacted[key] = (
                "[REDACTED]"
                if any(token in lowered for token in _SENSITIVE_KEYWORDS)
                else redact_sensitive_data(item)
            )
        return redacted
    if isinstance(value, list):
        return [redact_sensitive_data(item) for item in value]
    if isinstance(value, str):
        masked = _EMAIL_RE.sub("[REDACTED_EMAIL]", value)
        masked = _CPF_RE.sub("[REDACTED_CPF]", masked)
        return _CARD_RE.sub("[REDACTED_CARD]", masked)
    return value


def _estimate_cost_usd(input_payload: Any, output_payload: Any, elapsed_s: float) -> float:
    input_tokens = max(
        1, len(json.dumps(_normalize_for_json(input_payload), ensure_ascii=False)) // 4
    )
    output_tokens = max(
        1, len(json.dumps(_normalize_for_json(output_payload), ensure_ascii=False)) // 4
    )
    return round((input_tokens + output_tokens) * 0.0000005 + elapsed_s * 0.00001, 6)


def _cache_key(tool_name: str, payload: dict[str, Any]) -> str:
    raw = json.dumps(
        {"tool": tool_name, "payload": _normalize_for_json(payload)},
        sort_keys=True,
        ensure_ascii=False,
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def _build_error_response(
    *,
    tool_name: str,
    started_at: float,
    error_message: str,
    human_notified: bool,
) -> dict[str, Any]:
    elapsed = time.perf_counter() - started_at
    return {
        "ok": False,
        "data": None,
        "error": error_message,
        "meta": {
            "tool": tool_name,
            "cached": False,
            "duration_ms": int(elapsed * 1000),
            "cost_usd": 0.0,
            "human_notified": human_notified,
        },
    }


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
    started = time.perf_counter()
    safe_payload = redact_sensitive_data(payload)
    fallback = _resolve_fallback_behavior(fallback_behavior)

    if validation_model is not None:
        try:
            payload = validation_model(**payload).model_dump()
        except ValidationError as exc:
            return _build_error_response(
                tool_name=tool_name,
                started_at=started,
                error_message=f"Input validation failed: {exc.errors()}",
                human_notified=False,
            )

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
                },
            }

    tool_unavailable_retries = 0
    http_429_retries = 0

    while True:
        try:
            tool_handler = handler or get_tool(tool_name)
            result = await asyncio.wait_for(tool_handler(**payload), timeout=timeout_s)
            normalized_result = _normalize_for_json(result)

            if idempotent:
                _CACHE[_cache_key(tool_name, payload)] = normalized_result

            elapsed = time.perf_counter() - started
            logger.info(
                "Tool executed",
                extra={"tool": tool_name, "duration_ms": int(elapsed * 1000)},
            )
            return {
                "ok": True,
                "data": normalized_result,
                "error": None,
                "meta": {
                    "tool": tool_name,
                    "cached": False,
                    "duration_ms": int(elapsed * 1000),
                    "cost_usd": _estimate_cost_usd(payload, normalized_result, elapsed),
                },
            }
        except asyncio.TimeoutError:
            logger.warning("Tool timeout", extra={"tool": tool_name, "payload": safe_payload})
            if fallback["exhausted"]["notify_human"]:
                _notify_human(tool_name, f"Tool '{tool_name}' timed out after {timeout_s}s")
            return _build_error_response(
                tool_name=tool_name,
                started_at=started,
                error_message=f"Tool '{tool_name}' timed out after {timeout_s}s",
                human_notified=fallback["exhausted"]["notify_human"],
            )
        except Exception as exc:  # noqa: BLE001
            if _is_tool_unavailable_error(exc) and tool_unavailable_retries < fallback["tool_unavailable"]["retry_attempts"]:
                delay_ms = fallback["tool_unavailable"]["base_delay_ms"] * (2**tool_unavailable_retries)
                tool_unavailable_retries += 1
                logger.warning(
                    "Tool unavailable, retrying with backoff",
                    extra={
                        "tool": tool_name,
                        "attempt": tool_unavailable_retries,
                        "delay_ms": delay_ms,
                    },
                )
                await asyncio.sleep(delay_ms / 1000)
                continue

            if _is_http_429_error(exc) and http_429_retries < fallback["http_429"]["retry_attempts"]:
                retry_after_ms = _extract_retry_after_ms(exc)
                wait_ms = retry_after_ms if retry_after_ms is not None else fallback["http_429"]["wait_ms"]
                http_429_retries += 1
                logger.warning(
                    "HTTP 429 detected, waiting before retry",
                    extra={
                        "tool": tool_name,
                        "attempt": http_429_retries,
                        "wait_ms": wait_ms,
                    },
                )
                await asyncio.sleep(wait_ms / 1000)
                continue

            logger.exception(
                "Tool execution failure",
                extra={"tool": tool_name, "payload": safe_payload},
            )
            if fallback["exhausted"]["notify_human"]:
                _notify_human(tool_name, str(exc))

            return _build_error_response(
                tool_name=tool_name,
                started_at=started,
                error_message=str(exc),
                human_notified=fallback["exhausted"]["notify_human"],
            )
