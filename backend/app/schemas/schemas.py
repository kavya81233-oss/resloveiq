from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
    model_readiness: Dict[str, bool]

class PilotRequestCreate(BaseModel):
    name: str = Field(..., min_length=2)
    organization: str = Field(..., min_length=2)
    email: EmailStr
    role: str = Field(..., description="Government, Utility, Enterprise, Student team")
    message: Optional[str] = ""

class PilotRequestResponse(BaseModel):
    id: int
    status: str
    message: str

class ComplaintCreate(BaseModel):
    text: Optional[str] = None
    audio_url: Optional[str] = None
    photo_url: Optional[str] = None
    channel: str = "web"
    user_ref: Optional[str] = None

class TranscriptConfirmRequest(BaseModel):
    confirmed: bool
    corrected_text: Optional[str] = None

class UnderstandOutput(BaseModel):
    language: str
    kannada_text: str
    translated_text: str
    category: str
    sub_category: Optional[str] = None
    severity: float = Field(..., ge=0.0, le=2.0)
    safety_flag: bool = False
    sentiment_distress: float = Field(..., ge=0.0, le=5.0)
    vulnerable_mentioned: bool = False
    location: str
    summary: str
    confidence: float = Field(..., ge=0.0, le=1.0)

class ComplaintResponse(BaseModel):
    id: int
    complaint: Dict[str, Any]
    incident_id: Optional[int]
    case_id: Optional[int]
    priority_score: int
    priority_band: str
    reason: str

class IncidentResponse(BaseModel):
    id: int
    title: str
    category: str
    area: str
    lat: float
    lng: float
    status: str
    affected_count: int
    root_cause_hypothesis: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class CaseResponse(BaseModel):
    id: int
    complaint_id: int
    incident_id: Optional[int]
    assigned_team: str
    state: str
    priority_score: int
    priority_band: str
    priority_reason: Optional[str]
    breach_risk: float
    escalated: bool
    reopen_count: int
    copilot_suggested_fix: Optional[str]
    final_fix: Optional[str]
    created_at: datetime

class ApproveFixRequest(BaseModel):
    final_fix: str
    accepted_as_is: bool = True

class ClosureResponseRequest(BaseModel):
    confirmed: bool
    photo_url: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    feedback: Optional[str] = None

class ClosureResponseResult(BaseModel):
    case_id: int
    state: str
    reopened: bool
    new_priority: Optional[int] = None
    message: str

class AuditLogItem(BaseModel):
    id: int
    case_id: Optional[int]
    agent: str
    decision: str
    reasoning: Optional[str]
    confidence: float
    created_at: datetime

class InsightResponse(BaseModel):
    incident_id: int
    root_cause_summary: str
    trend: str
    affected_count: int
    category: str
    location: str
    recommendations: List[str]

class PresignedUploadRequest(BaseModel):
    filename: str
    content_type: str

class PresignedUploadResponse(BaseModel):
    upload_url: str
    file_key: str
    public_url: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    name: str
    team: Optional[str]

