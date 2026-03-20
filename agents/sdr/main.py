import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Header
from pydantic import ValidationError
from agents.sdr.agent import SDRAgent, SDRAgentState
from agents.sdr.schemas import SDRInput, SDROutput
from agents.shared.security import validate_internal_service_token
from agents.shared.db_pool import init_pool

# [SOURCE] checklist agent prompt templates — GAP-003


def _build_response_payload(result_payload: dict[str, object]) -> dict[str, object]:
    data_payload = result_payload.get("data")
    output_payload = result_payload.get("output")

    if not isinstance(data_payload, dict):
        data_payload = {}
    if not isinstance(output_payload, dict):
        output_payload = {}

    return {
        "agent_id": result_payload.get("agent_id", "sdr"),
        "task": result_payload.get("task", "run"),
        "status": result_payload.get("status"),
        "data": data_payload,
        "output": output_payload,
        "error": result_payload.get("error"),
    }


def _validate_response_payload(payload: dict[str, object]) -> SDROutput:
    try:
        return SDROutput.model_validate(payload)
    except ValidationError as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "error": "SDR output schema validation failed",
                "issues": exc.errors(),
            },
        ) from exc

@asynccontextmanager
async def lifespan(_: FastAPI):
    if os.getenv("DATABASE_URL"):
        await init_pool()
    yield

app = FastAPI(title="SDR Agent API", version="1.0", lifespan=lifespan)
agent = SDRAgent()

@app.get("/health")
async def health_check():
    return {"status": "ok", "agent": "SDR"}

@app.post("/run", response_model=SDROutput)
async def run_agent(input_data: SDRInput, x_service_token: str | None = Header(default=None)):
    try:
        validate_internal_service_token(x_service_token)
        initial_state: SDRAgentState = {
            "lead_id": input_data.lead_id,
            "deal_id": None,
            "customer_id": None,
            "context": input_data.context or {},
            "messages": [],
            "actions_taken": [],
            "output": {},
            "error": None,
            "cadence_plan": None,
            "email_sequence": None,
            "meeting_slots": None,
            "objection_analysis": None
        }

        result = await agent.run(initial_state)
        strict_payload = _build_response_payload(result.to_legacy_dict())
        return _validate_response_payload(strict_payload)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
