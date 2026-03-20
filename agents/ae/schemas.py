from __future__ import annotations

# [SOURCE] checklist agent prompt templates — GAP-003
from typing import Literal, TypeAlias

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

JsonObject: TypeAlias = dict[str, object]

class UpdateDealStageInput(BaseModel):
    deal_id: str = Field(..., description="ID of the deal to update")
    new_stage: str = Field(..., description="New stage (e.g., 'Proposal', 'Negotiation', 'Closed Won')")
    notes: str = Field(..., description="Reason for the update")

class GenerateProposalInput(BaseModel):
    deal_id: str = Field(..., description="ID of the deal")
    amount: float = Field(..., description="Proposed amount")
    discount: float = Field(0, description="Discount percentage")
    template_id: str = Field("standard_saas", description="Template ID")

class ScheduleDemoInput(BaseModel):
    lead_id: str = Field(..., description="ID of the lead")
    proposed_times: list[str] = Field(..., description="List of proposed ISO timestamps")


class TranscribeAndSyncInput(BaseModel):
    recording_url: HttpUrl = Field(..., description="Public recording URL")
    deal_id: str = Field(..., min_length=1, description="Deal identifier")


class AEInput(BaseModel):
    deal_id: str | None = None
    context: JsonObject = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class AEMaterials(BaseModel):
    proposal: JsonObject = Field(default_factory=dict)
    roi: JsonObject = Field(default_factory=dict)

    model_config = ConfigDict(extra="forbid")


class AEOutputData(BaseModel):
    followup: JsonObject | None = None
    materials: AEMaterials | None = None
    discount_validation: JsonObject | None = None
    battlecard: JsonObject | None = None
    crm_sync: JsonObject | None = None

    model_config = ConfigDict(extra="forbid")


class AEOutput(BaseModel):
    agent_id: str
    task: str
    status: Literal["error", "pending", "success"]
    data: AEOutputData
    output: AEOutputData
    error: str | None = None

    model_config = ConfigDict(extra="forbid")
