# [SOURCE] checklist agent templates — M-001
from __future__ import annotations

import httpx
import pytest

from agents.shared import tool_runtime
from agents.shared.tool_runtime import run_tool


@pytest.fixture(autouse=True)
def _reset_runtime_state() -> None:
    tool_runtime._TOOL_REGISTRY.clear()
    tool_runtime._CACHE.clear()


@pytest.mark.asyncio
async def test_run_tool_notifies_human_when_tool_unavailable(monkeypatch: pytest.MonkeyPatch) -> None:
    async def _notify_human(*, tool_name: str, payload: dict[str, object], reason: str) -> bool:
        assert tool_name == "missing-tool"
        assert reason == "tool_unavailable"
        return True

    monkeypatch.setattr(tool_runtime, "_notify_human", _notify_human)

    result = await run_tool(tool_name="missing-tool", payload={})

    assert result["ok"] is False
    assert "not registered" in result["error"]
    assert result["meta"]["human_notified"] is True
    assert result["meta"]["fallback_stage"] == "tool_unavailable"


@pytest.mark.asyncio
async def test_run_tool_retries_once_on_http_429(monkeypatch: pytest.MonkeyPatch) -> None:
    calls = {"count": 0}

    async def flaky_handler(**_payload: object) -> dict[str, object]:
        calls["count"] += 1
        if calls["count"] == 1:
            request = httpx.Request("POST", "https://api.example.com/tool")
            response = httpx.Response(429, request=request)
            raise httpx.HTTPStatusError("429 too many requests", request=request, response=response)
        return {"status": "ok"}

    async def _notify_human(*, tool_name: str, payload: dict[str, object], reason: str) -> bool:
        return True

    monkeypatch.setattr(tool_runtime, "_notify_human", _notify_human)

    result = await run_tool(
        tool_name="rate-limited-tool",
        handler=flaky_handler,
        payload={},
        fallback_behavior={"base_delay_ms": 1, "retry_attempts": 1, "rate_limit_extra_retry": 1},
    )

    assert calls["count"] == 2
    assert result["ok"] is True
    assert result["data"] == {"status": "ok"}
    assert result["meta"]["attempts"] == 2


@pytest.mark.asyncio
async def test_run_tool_escalates_after_retries_exhausted(monkeypatch: pytest.MonkeyPatch) -> None:
    calls = {"count": 0}

    async def always_fail_handler(**_payload: object) -> dict[str, object]:
        calls["count"] += 1
        raise RuntimeError("boom")

    async def _notify_human(*, tool_name: str, payload: dict[str, object], reason: str) -> bool:
        assert reason == "exhausted"
        return True

    monkeypatch.setattr(tool_runtime, "_notify_human", _notify_human)

    result = await run_tool(
        tool_name="always-fail",
        handler=always_fail_handler,
        payload={},
        fallback_behavior={"base_delay_ms": 1, "retry_attempts": 2},
    )

    assert calls["count"] == 2
    assert result["ok"] is False
    assert result["error"] == "boom"
    assert result["meta"]["attempts"] == 2
    assert result["meta"]["human_notified"] is True
    assert result["meta"]["fallback_stage"] == "exhausted"
