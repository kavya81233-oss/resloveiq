from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import AgentLog
from app.schemas.schemas import AuditLogItem

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/{case_id}", response_model=List[AuditLogItem])
def get_case_audit(case_id: int, db: Session = Depends(get_db)):
    logs = db.query(AgentLog).filter(AgentLog.case_id == case_id).order_by(AgentLog.created_at.asc()).all()
    if not logs:
        # Return empty list or 404
        return []
    return [
        AuditLogItem(
            id=log.id,
            case_id=log.case_id,
            agent=log.agent,
            decision=log.decision,
            reasoning=log.reasoning,
            confidence=log.confidence,
            created_at=log.created_at
        )
        for log in logs
    ]

