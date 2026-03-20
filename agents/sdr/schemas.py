from __future__ import annotations

# [SOURCE] checklist agent prompt templates — GAP-003
from typing import Literal, TypeAlias

from pydantic import BaseModel, ConfigDict, Field

JsonObject: TypeAlias = dict[str, object]

class EnrichLeadInput(BaseModel):
    email: str = Field(..., description="Email address of the lead to enrich")
    company_name: str = Field(..., description="Company name of the lead")

class CalculateBANTInput(BaseModel):
    budget: str = Field(..., description="Budget information")
    authority: str = Field(..., description="Decision maker authority level")
    need: str = Field(..., description="Pain points and needs")
    timeline: str = Field(..., description="Implementation timeline")

class AddToSequenceInput(BaseModel):
    lead_id: str = Field(..., description="ID of the lead to add to sequence")
    sequence_id: str = Field(..., description="ID of the email sequence")


class ScheduleMeetingInput(BaseModel):
    ae_calendar_id: str = Field(..., min_length=1)
    lead_timezone: str = Field(..., min_length=1)
    slots: int = Field(default=3, ge=1, le=10)


class SDRInput(BaseModel):
    lead_id: str | None = None
    context: JsonObject = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class SDROutputData(BaseModel):
    call: JsonObject | None = None
    outreach_plan: JsonObject | None = None
    classification: JsonObject | None = None
    meeting_slots: JsonObject | None = None
    crm_sync: JsonObject | None = None

    model_config = ConfigDict(extra="forbid")


class SDROutput(BaseModel):
    agent_id: str
    task: str
    status: Literal["error", "pending", "success"]
    data: SDROutputData
    output: SDROutputData
    error: str | None = None

    model_config = ConfigDict(extra="forbid")
