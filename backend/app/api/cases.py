from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Case, AgentLog, Incident
from app.schemas.schemas import CaseResponse, ApproveFixRequest
from app.api.ws import ws_manager
import datetime

router = APIRouter(prefix="/cases", tags=["cases"])

@router.get("", response_model=List[CaseResponse])
def get_cases(
    state: Optional[str] = None,
    team: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Case)
    if state:
        query = query.filter(Case.state == state.upper())
    if team:
        query = query.filter(Case.assigned_team == team)
        
    offset = (page - 1) * limit
    cases = query.order_by(Case.priority_score.desc()).offset(offset).limit(limit).all()
    
    return [
        CaseResponse(
            id=c.id,
            complaint_id=c.complaint_id,
            incident_id=c.incident_id,
            assigned_team=c.assigned_team,
            state=c.state,
            priority_score=c.priority_score,
            priority_band=c.priority_band,
            priority_reason=c.priority_reason,
            breach_risk=c.breach_risk,
            escalated=c.escalated,
            reopen_count=c.reopen_count,
            copilot_suggested_fix=c.copilot_suggested_fix,
            final_fix=c.final_fix,
            created_at=c.created_at
        )
        for c in cases
    ]

@router.post("/{case_id}/approve-fix")
async def approve_fix(
    case_id: int,
    req: ApproveFixRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    case.final_fix = req.final_fix
    case.accepted_as_is = req.accepted_as_is
    case.state = "FIX_APPROVED"
    case.updated_at = datetime.datetime.utcnow()
    
    # Audit log
    db.add(AgentLog(
        case_id=case.id,
        agent="ResolutionCopilot",
        decision="Fix Plan Approved by Human Lead",
        reasoning=f"Approved plan: {req.final_fix[:100]}...",
        confidence=1.0
    ))
    db.commit()
    db.refresh(case)

    # Broadcast event
    background_tasks.add_task(
        ws_manager.broadcast,
        "fix.approved",
        {"case_id": case.id, "incident_id": case.incident_id, "state": case.state}
    )

    return {"id": case.id, "state": case.state, "message": "Fix approved successfully"}

@router.post("/{case_id}/mark-fixed")
async def mark_fixed(
    case_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    case.state = "PENDING_VERIFICATION"
    case.updated_at = datetime.datetime.utcnow()
    
    # Audit log
    db.add(AgentLog(
        case_id=case.id,
        agent="ClosureAgent",
        decision="Dispatched Verification Prompt to Citizen",
        reasoning="Field team completed task. Waiting for citizen confirmation.",
        confidence=1.0
    ))
    db.commit()
    db.refresh(case)

    background_tasks.add_task(
        ws_manager.broadcast,
        "closure.requested",
        {"case_id": case.id, "incident_id": case.incident_id, "state": case.state}
    )

    return {"id": case.id, "state": case.state, "message": "State changed to PENDING_VERIFICATION"}

