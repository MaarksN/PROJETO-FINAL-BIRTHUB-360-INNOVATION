from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict

from fastapi import HTTPException


REQUIRED_CONTEXT_FIELDS = ("tenant_id", "request_id")
_MAX_BKB_ENTRIES = 20


def _normalize_bkb_entries(raw_value: Any) -> list[str]:
    if raw_value is None:
        return []

    if isinstance(raw_value, dict):
        if "entries" in raw_value:
            return _normalize_bkb_entries(raw_value.get("entries"))
        if "documents" in raw_value:
            return _normalize_bkb_entries(raw_value.get("documents"))
        return [str(raw_value)]

    if isinstance(raw_value, list):
        normalized: list[str] = []
        for item in raw_value:
            if isinstance(item, dict):
                if "content" in item:
                    normalized.append(str(item["content"]))
                elif "text" in item:
                    normalized.append(str(item["text"]))
                else:
                    normalized.append(str(item))
            else:
                normalized.append(str(item))
        return normalized

    return [str(raw_value)]


def _load_bkb_registry() -> Dict[str, Any]:
    inline_registry = os.getenv("BKB_TENANT_CONTEXT")
    if inline_registry:
        try:
            parsed = json.loads(inline_registry)
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    registry_path = os.getenv("BKB_TENANT_CONTEXT_FILE")
    if not registry_path:
        return {}

    try:
        content = Path(registry_path).read_text(encoding="utf-8")
        parsed = json.loads(content)
        if isinstance(parsed, dict):
            return parsed
    except (FileNotFoundError, OSError, json.JSONDecodeError):
        return {}

    return {}


# [SOURCE] M-003 - Injeção de contexto BKB em runtime
def inject_bkb_context(context: Dict[str, Any] | None) -> Dict[str, Any]:
    normalized_context = dict(context or {})
    tenant_id = str(normalized_context.get("tenant_id") or "").strip()

    payload_entries = _normalize_bkb_entries(
        normalized_context.get("knowledge_base")
        or normalized_context.get("bkb")
        or normalized_context.get("bkb_entries")
    )

    source = "payload"
    entries = payload_entries

    if not entries and tenant_id:
        registry = _load_bkb_registry()
        tenant_registry = registry.get(tenant_id) if isinstance(registry, dict) else None
        entries = _normalize_bkb_entries(tenant_registry)
        if entries:
            source = "tenant_registry"

    if not entries:
        source = "none"

    entries = entries[:_MAX_BKB_ENTRIES]

    normalized_context["bkb_context"] = {
        "entries": entries,
        "source": source,
        "tenant_id": tenant_id or None,
    }
    normalized_context["bkb_context_available"] = len(entries) > 0

    return normalized_context


def enforce_operational_context(context: Dict[str, Any] | None) -> Dict[str, Any]:
    normalized_context = inject_bkb_context(context)

    missing_fields = [field for field in REQUIRED_CONTEXT_FIELDS if not normalized_context.get(field)]
    if missing_fields:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Missing mandatory operational context fields.",
                "missing_fields": missing_fields,
                "required_fields": list(REQUIRED_CONTEXT_FIELDS),
            },
        )

    event_id = normalized_context.get("event_id")
    normalized_context["operational_contract"] = {
        "tenant_id": normalized_context["tenant_id"],
        "request_id": normalized_context["request_id"],
        "event_id": event_id,
        "idempotency_key": event_id or normalized_context["request_id"],
    }

    return normalized_context
