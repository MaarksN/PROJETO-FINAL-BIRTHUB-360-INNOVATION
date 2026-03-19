import httpx
import pytest

from agents.shared.tool_runtime import run_tool

# [SOURCE] checklist de agent templates — M-001 item


@pytest.mark.asyncio
async def test_run_tool_retries_when_tool_unavailable(monkeypatch):
    notified = {"called": False}

    def _fake_notify(_tool_name: str, _error: str) -> None:
        notified["called"] = True

    monkeypatch.setattr("agents.shared.tool_runtime._notify_human", _fake_notify)

    result = await run_tool(
        tool_name="missing-tool",
        payload={},
        fallback_behavior={
            "tool_unavailable": {
                "retry_attempts": 3,
                "backoff_strategy": "exponential",
                "base_delay_ms": 1,
            },
            "http_429": {"wait_ms": 1, "retry_attempts": 1},
            "exhausted": {"notify_human": True, "silence": False, "loop": False},
        },
    )

    assert result["ok"] is False
    assert "not registered" in result["error"]
    assert result["meta"]["human_notified"] is True
    assert notified["called"] is True


@pytest.mark.asyncio
async def test_run_tool_retries_once_on_http_429():
    calls = {"count": 0}

    async def flaky_handler(**_payload):
        calls["count"] += 1
        if calls["count"] == 1:
            request = httpx.Request("POST", "https://api.example.com/tool")
            response = httpx.Response(429, request=request)
            raise httpx.HTTPStatusError(
                "429 too many requests",
                request=request,
                response=response,
            )
        return {"result": "ok"}

    result = await run_tool(
        tool_name="rate-limited-tool",
        handler=flaky_handler,
        payload={},
        fallback_behavior={
            "tool_unavailable": {
                "retry_attempts": 3,
                "backoff_strategy": "exponential",
                "base_delay_ms": 1,
            },
            "http_429": {"wait_ms": 1, "retry_attempts": 1},
            "exhausted": {"notify_human": True, "silence": False, "loop": False},
        },
    )

    assert calls["count"] == 2
    assert result["ok"] is True
    assert result["data"]["result"] == "ok"
