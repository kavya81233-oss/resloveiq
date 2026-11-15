import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, Float, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base, is_sqlite

# Try importing pgvector if on PostgreSQL, else fallback to JSON
try:
    if not is_sqlite:
        from pgvector.sqlalchemy import Vector
        VectorType = Vector(384)
    else:
        VectorType = JSON
except Exception:
    VectorType = JSON

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(50), default="agent")  # citizen, agent, lead, admin
    team = Column(String(100), nullable=True)   # BWSSB, BESCOM, BBMP Road, etc.
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    cases = relationship("Case", back_populates="assignee")

class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    description = Column(String(255), nullable=True)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    area = Column(String(100), nullable=False, index=True)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    status = Column(String(50), default="OPEN", index=True)  # OPEN, IN_PROGRESS, RESOLVED, CLOSED
    affected_count = Column(Integer, default=1)
    root_cause_hypothesis = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    complaints = relationship("Complaint", back_populates="incident")
    cases = relationship("Case", back_populates="incident")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    channel = Column(String(50), default="web")  # telegram, web, voice
    user_ref = Column(String(100), nullable=True)
    phone_masked = Column(String(50), nullable=True)
    raw_text = Column(Text, nullable=True)
    audio_url = Column(String(500), nullable=True)
    photo_url = Column(String(500), nullable=True)
    
    # Understand Agent outputs
    language = Column(String(50), default="en")
    kannada_text = Column(Text, nullable=True)
    translated_text = Column(Text, nullable=True)
    category = Column(String(100), nullable=False, default="general")
    sub_category = Column(String(100), nullable=True)
    severity = Column(Float, default=1.0)
    safety_flag = Column(Boolean, default=False)
    sentiment_distress = Column(Float, default=0.0)
    vulnerable_mentioned = Column(Boolean, default=False)
    location_detected = Column(String(100), nullable=True)
    summary = Column(Text, nullable=True)
    confidence = Column(Float, default=0.95)
    
    # Vector embedding (384 dimensions)
    embedding = Column(VectorType, nullable=True)
    
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = relationship("Incident", back_populates="complaints")
    case = relationship("Case", back_populates="complaint", uselist=False)

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assigned_team = Column(String(100), nullable=False, default="General Operations")
    
    # State machine: IDLE, UNDERSTANDING, CLUSTERED, PRIORITIZED, ASSIGNED, FIX_APPROVED, PENDING_VERIFICATION, CLOSED, REOPENED
    state = Column(String(50), default="CLUSTERED", index=True)
    
    # Priority Engine
    priority_score = Column(Integer, default=50)
    priority_band = Column(String(50), default="Medium")  # Critical, High, Medium, Low
    priority_reason = Column(Text, nullable=True)
    
    # Risk Guard
    breach_risk = Column(Float, default=0.1)
    escalated = Column(Boolean, default=False)
    reopen_count = Column(Integer, default=0)
    first_response_at = Column(DateTime, nullable=True)
    sla_hours = Column(Float, default=24.0)
    
    # Resolution copilot
    copilot_suggested_fix = Column(Text, nullable=True)
    final_fix = Column(Text, nullable=True)
    accepted_as_is = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="case")
    incident = relationship("Incident", back_populates="cases")
    assignee = relationship("User", back_populates="cases")
    closure_checks = relationship("ClosureCheck", back_populates="case")
    agent_logs = relationship("AgentLog", back_populates="case")

class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    agent = Column(String(100), nullable=False)  # UnderstandAgent, ClusterEngine, PriorityEngine, Router, ResolutionCopilot, RiskGuard, ClosureAgent
    decision = Column(String(255), nullable=False)
    reasoning = Column(Text, nullable=True)
    confidence = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="agent_logs")

class ClosureCheck(Base):
    __tablename__ = "closure_checks"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    prompt_sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    confirmed = Column(Boolean, nullable=True)
    reopened = Column(Boolean, default=False)
    citizen_feedback = Column(Text, nullable=True)
    photo_url = Column(String(500), nullable=True)
    rating = Column(Integer, nullable=True)
    responded_at = Column(DateTime, nullable=True)

    case = relationship("Case", back_populates="closure_checks")

class CopilotFeedback(Base):
    __tablename__ = "copilot_feedback"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    original_suggestion = Column(Text, nullable=False)
    edited_text = Column(Text, nullable=False)
    agent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ASRCorrection(Base):
    __tablename__ = "asr_corrections"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    original_transcript = Column(Text, nullable=False)
    corrected_transcript = Column(Text, nullable=False)
    confirmed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PilotRequest(Base):
    __tablename__ = "pilot_requests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False)  # Government, Utility, Enterprise, Student team
    message = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SOPChunk(Base):
    __tablename__ = "sop_chunks"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    embedding = Column(VectorType, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

