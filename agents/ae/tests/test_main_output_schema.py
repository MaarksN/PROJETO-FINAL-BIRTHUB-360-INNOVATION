# [SOURCE] checklist agent prompt templates — GAP-003
import pytest
from fastapi import HTTPException

from agents.ae.main import _build_response_payload, _validate_response_payload


def test_ae_run_output_accepts_contract_shape() -> None:
    raw_payload = {
        "agent_id": "ae",
        "task": "run",
        "status": "success",
        "data": {
            "materials": {
                "proposal": {"title": "Proposal"},
                "roi": {"payback_months": 10},
            }
        },
        "output": {
            "materials": {
                "proposal": {"title": "Proposal"},
                "roi": {"payback_months": 10},
            }
        },
        "error": None,
        "messages": [{"ignored": True}],
    }

    payload = _build_response_payload(raw_payload)
    parsed = _validate_response_payload(payload)

    assert parsed.agent_id == "ae"
    assert parsed.status == "success"
    assert parsed.data.materials is not None


def test_ae_run_output_rejects_unknown_nested_fields() -> None:
    malformed_payload = {
        "agent_id": "ae",
        "task": "run",
        "status": "success",
        "data": {"unexpected": {"foo": "bar"}},
        "output": {},
        "error": None,
    }

    with pytest.raises(HTTPException) as exc_info:
        _validate_response_payload(malformed_payload)

    assert exc_info.value.status_code == 502
