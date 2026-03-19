import pytest
from agents.sdr.tools import (
    _generate_icebreaker,
    auto_qualify_from_call,
    classify_objection,
    detect_optimal_send_time,
    generate_call_record,
    generate_icebreaker,
    run_prospecting_call,
    generate_email_sequence,
)


@pytest.mark.asyncio
async def test_generate_icebreaker():
    lead = {"name": "Alice", "company": "Wonderland Inc"}
    result = await generate_icebreaker(lead, "Acquisition News", "")
    assert result["ok"] is True
    assert "Alice" in result["data"]


@pytest.mark.asyncio
async def test_generate_icebreaker_with_news():
    lead = {"name": "Alice", "company": "Wonderland Inc"}
    # Testing the handler directly for precise string verification
    result = await _generate_icebreaker(lead, "Acquisition News", "")
    assert result == "Oi Alice, vi a notícia sobre Wonderland Inc: Acquisition News."


@pytest.mark.asyncio
async def test_generate_icebreaker_with_linkedin():
    lead = {"name": "Alice", "company": "Wonderland Inc"}
    long_post = "Awesome new product launch that will change the world forever"
    result = await _generate_icebreaker(lead, "", long_post)
    # Truncation at 30: "Awesome new product launch tha"
    assert result == "Oi Alice, curti seu post sobre Awesome new product launch tha."


@pytest.mark.asyncio
async def test_generate_icebreaker_fallback():
    lead = {"name": "Alice", "company": "Wonderland Inc"}
    result = await _generate_icebreaker(lead, "", "")
    assert result == "Oi Alice, notei que a Wonderland Inc está acelerando crescimento."


@pytest.mark.asyncio
async def test_generate_icebreaker_missing_lead_info():
    lead = {}
    result = await _generate_icebreaker(lead, "", "")
    assert result == "Oi Prospect, notei que a Company está acelerando crescimento."


@pytest.mark.asyncio
async def test_detect_optimal_send_time():
    lead = {"role": "CEO"}
    result = await detect_optimal_send_time(lead)
    assert result["ok"] is True
    assert "best_day" in result["data"]


@pytest.mark.asyncio
async def test_classify_objection_rejection():
    reply = "I am not interested at all."
    result = await classify_objection(reply)
    assert result["data"]["category"] == "real_rejection"
    assert result["data"]["next_action"] == "close_lead"


@pytest.mark.asyncio
async def test_call_qualification_and_record():
    lead = {"id": "l-1", "name": "Pat", "company": "Acme", "is_decision_maker": True}
    script = {"opening": "Olá Pat, tudo bem?"}
    call_data = await run_prospecting_call(lead, script, ["budget", "authority", "need", "timeline"])
    qualification = await auto_qualify_from_call(call_data)
    record = await generate_call_record(call_data, qualification, lead)

    assert qualification["score"] >= 75
    assert "SDR:" in record["transcript"]
    assert record["lead"]["id"] == "l-1"


@pytest.mark.asyncio
async def test_generate_email_sequence():
    lead = {"id": "lead-1", "name": "Eve", "company": "Acme Corp"}
    cadence_config = {"tone": "friendly", "value_prop_focus": "efficiency"}
    result = await generate_email_sequence(lead, cadence_config)

    assert result["ok"] is True
    assert isinstance(result["data"], list)
    assert len(result["data"]) == 3

    first_step = result["data"][0]
    assert first_step["step"] == 1
    assert first_step["day"] == 2
    assert "friendly" in first_step["subject"]
    assert "efficiency" in first_step["body"]
    assert first_step["channel"] == "email"
