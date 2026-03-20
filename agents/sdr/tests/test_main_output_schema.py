# [SOURCE] checklist agent prompt templates — GAP-003
import pytest
from fastapi import HTTPException

from agents.sdr.main import _build_response_payload, _validate_response_payload


def test_sdr_run_output_accepts_contract_shape() -> None:
    raw_payload = {
        "agent_id": "sdr",
        "task": "run",
        "status": "success",
        "data": {
            "outreach_plan": {
                "icebreaker": "Personalized opener",
                "sequence": [{"day": 1, "channel": "email"}],
            }
        },
        "output": {
            "outreach_plan": {
                "icebreaker": "Personalized opener",
                "sequence": [{"day": 1, "channel": "email"}],
            }
        },
        "error": None,
        "context": {"ignored": True},
    }

    payload = _build_response_payload(raw_payload)
    parsed = _validate_response_payload(payload)

    assert parsed.agent_id == "sdr"
    assert parsed.status == "success"
    assert parsed.output.outreach_plan is not None


def test_sdr_run_output_rejects_unknown_nested_fields() -> None:
    malformed_payload = {
        "agent_id": "sdr",
        "task": "run",
        "status": "success",
        "data": {"unexpected": {"foo": "bar"}},
        "output": {},
        "error": None,
    }

    with pytest.raises(HTTPException) as exc_info:
        _validate_response_payload(malformed_payload)

    assert exc_info.value.status_code == 502
