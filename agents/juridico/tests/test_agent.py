import sys
import types

import pytest

from agents.juridico.agent import JuridicoAgent


@pytest.mark.asyncio
async def test_juridico_agent_runs_pipeline():
    agent = JuridicoAgent()
    result = await agent.run({"context": {"case_data": {"impact": 4, "probability": 3}}})

    output = result.data
    assert output["agent"] == "juridico"
    assert output["domain"] == "legal_ops"
    assert output["status"] == "completed"
    assert all(task["status"] == "completed" for task in output["tasks"])
    assert output["deliverables"]["risk"]["ok"] is True


def test_overall_status_all_ok():
    deliverables = {
        "task1": {"ok": True},
        "task2": {"ok": True},
    }
    status = JuridicoAgent._overall_status(deliverables)
    assert status == "completed"


def test_overall_status_some_ok():
    deliverables = {
        "task1": {"ok": True},
        "task2": {"ok": False},
    }
    status = JuridicoAgent._overall_status(deliverables)
    assert status == "partial"


def test_overall_status_none_ok():
    deliverables = {
        "task1": {"ok": False},
        "task2": {"ok": False},
    }
    status = JuridicoAgent._overall_status(deliverables)
    assert status == "failed"


def test_overall_status_empty():
    deliverables = {}
    status = JuridicoAgent._overall_status(deliverables)
    assert status == "completed"
