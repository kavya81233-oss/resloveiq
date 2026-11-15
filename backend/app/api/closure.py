from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Case, ClosureCheck, AgentLog, Incident
from app.schemas.schemas import ClosureResponseRequest, ClosureResponseResult
from app.agents.closure import process_closure_verification
from app.api.ws import ws_manager
import datetime

router = APIRouter(prefix="/closure", tags=["closure"])

@router.post("/{case_id}/response", response_model=ClosureResponseResult)
async def submit_closure_response(
    case_id: int,
    req: ClosureResponseRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    result = process_closure_verification(
        confirmed=req.confirmed,
        current_priority=case.priority_score,
        reopen_count=case.reopen_count
    )
    
    # Update case state
    case.state = result["new_state"]
    case.priority_score = result["new_priority"]
    case.escalated = result["escalated"]
    if result["reopened"]:
        case.reopen_count += 1
        case.breach_risk = min(case.breach_risk + 0.25, 1.0)
    case.updated_at = datetime.datetime.utcnow()
    
    # Save closure check record
    check = ClosureCheck(
        case_id=case.id,
        confirmed=req.confirmed,
        reopened=result["reopened"],
        photo_url=req.photo_url,
        rating=req.rating,
        citizen_feedback=req.feedback,
        responded_at=datetime.datetime.utcnow()
    )
    db.add(check)
    
    # Audit log
    agent_decision = "Case Closed (Citizen Verified)" if req.confirmed else "Case Reopened (+15 Priority Spike)"
    db.add(AgentLog(
        case_id=case.id,
        agent="ClosureAgent",
        decision=agent_decision,
        reasoning=result["message"],
        confidence=1.0
    ))
    db.commit()
    db.refresh(case)

    # Broadcast websocket event
    event_name = "case.closed" if req.confirmed else "case.reopened"
    payload = {
        "case_id": case.id,
        "incident_id": case.incident_id,
        "state": case.state,
        "reopened": result["reopened"],
        "priority_score": case.priority_score,
        "escalated": case.escalated
    }
    background_tasks.add_task(ws_manager.broadcast, event_name, payload)

    return ClosureResponseResult(
        case_id=case.id,
        state=case.state,
        reopened=result["reopened"],
        new_priority=result["new_priority"],
        message=result["message"]
    )

