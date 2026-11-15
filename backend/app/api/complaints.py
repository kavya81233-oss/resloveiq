from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Complaint, Incident, Case, AgentLog, Area
from app.schemas.schemas import ComplaintCreate, ComplaintResponse, TranscriptConfirmRequest
from app.agents.understand import analyze_complaint_text
from app.agents.resolution import draft_resolution_copilot
from app.engines.priority import calculate_priority_score
from app.engines.cluster import evaluate_clustering
from app.engines.router import route_case
from app.engines.risk_guard import calculate_breach_risk
from app.api.ws import ws_manager
import datetime

router = APIRouter(prefix="/complaints", tags=["complaints"])

@router.post("", response_model=ComplaintResponse)
async def create_complaint(
    complaint_in: ComplaintCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    raw_text = complaint_in.text or "Voice note received"
    
    # 1. Understand Agent
    understand_res = analyze_complaint_text(raw_text)
    
    # Detect Area coordinates
    area_obj = db.query(Area).filter(Area.name.ilike(f"%{understand_res.location}%")).first()
    if not area_obj:
        area_obj = db.query(Area).first() # Fallback to first area
        
    lat = area_obj.lat if area_obj else 12.9299
    lng = area_obj.lng if area_obj else 77.5826
    area_name = area_obj.name if area_obj else "Jayanagar"

    # 2. Cluster Engine
    open_incidents = db.query(Incident).filter(Incident.status == "OPEN").all()
    candidate_incidents = [
        {"id": inc.id, "category": inc.category, "area": inc.area, "lat": inc.lat, "lng": inc.lng, "status": inc.status, "affected_count": inc.affected_count}
        for inc in open_incidents
    ]
    cluster_res = evaluate_clustering(
        category=understand_res.category,
        area=area_name,
        lat=lat,
        lng=lng,
        embedding=None,
        candidate_incidents=candidate_incidents
    )
    
    incident = None
    if cluster_res["action"] == "JOIN":
        incident = db.query(Incident).filter(Incident.id == cluster_res["incident_id"]).first()
        if incident:
            incident.affected_count += 1
            if cluster_res["root_cause_hypothesis"]:
                incident.root_cause_hypothesis = cluster_res["root_cause_hypothesis"]
            db.commit()
            db.refresh(incident)
    else:
        incident = Incident(
            title=f"{understand_res.category.capitalize()} Issue at {area_name}",
            category=understand_res.category,
            area=area_name,
            lat=lat,
            lng=lng,
            status="OPEN",
            affected_count=1,
            root_cause_hypothesis=cluster_res["root_cause_hypothesis"]
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        
    # 3. Create Complaint record
    complaint = Complaint(
        channel=complaint_in.channel,
        user_ref=complaint_in.user_ref or "citizen_98450_citizen",
        phone_masked="+91 98*** **321",
        raw_text=raw_text,
        audio_url=complaint_in.audio_url,
        photo_url=complaint_in.photo_url,
        language=understand_res.language,
        kannada_text=understand_res.kannada_text,
        translated_text=understand_res.translated_text,
        category=understand_res.category,
        sub_category=understand_res.sub_category,
        severity=understand_res.severity,
        safety_flag=understand_res.safety_flag,
        sentiment_distress=understand_res.sentiment_distress,
        vulnerable_mentioned=understand_res.vulnerable_mentioned,
        location_detected=area_name,
        summary=understand_res.summary,
        confidence=understand_res.confidence,
        incident_id=incident.id
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    # 4. Priority Engine
    p_res = calculate_priority_score(
        severity=understand_res.severity,
        safety=understand_res.safety_flag,
        affected=incident.affected_count,
        distress=understand_res.sentiment_distress,
        vulnerable=understand_res.vulnerable_mentioned,
        sla_risk=0.2
    )

    # 5. Router Engine
    router_res = route_case(category=understand_res.category)

    # 6. Resolution Copilot
    copilot_res = draft_resolution_copilot(
        category=understand_res.category,
        location=area_name,
        summary=understand_res.summary,
        affected_count=incident.affected_count
    )

    # 7. Risk Guard baseline
    risk_res = calculate_breach_risk(
        elapsed_hours=0.5,
        sla_hours=24.0,
        current_load=12,
        team_capacity=20,
        has_first_response=True,
        reopen_count=0
    )

    # Create Case
    case = Case(
        complaint_id=complaint.id,
        incident_id=incident.id,
        assigned_team=router_res["assigned_team"],
        state="CLUSTERED",
        priority_score=p_res["score"],
        priority_band=p_res["band"],
        priority_reason=p_res["reason"],
        breach_risk=risk_res["risk"],
        escalated=risk_res["escalate"],
        copilot_suggested_fix=copilot_res["copilot_suggested_fix"]
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    # Audit Trail Logs
    logs = [
        AgentLog(case_id=case.id, agent="UnderstandAgent", decision=f"Classified as {understand_res.category} ({understand_res.language})", reasoning=f"Severity: {understand_res.severity}, Safety: {understand_res.safety_flag}", confidence=understand_res.confidence),
        AgentLog(case_id=case.id, agent="ClusterEngine", decision=f"{cluster_res['action']} Incident #{incident.id}", reasoning=cluster_res["reason"], confidence=cluster_res["similarity"]),
        AgentLog(case_id=case.id, agent="PriorityEngine", decision=f"Computed Score {p_res['score']} ({p_res['band']})", reasoning=p_res["reason"], confidence=1.0),
        AgentLog(case_id=case.id, agent="RouterEngine", decision=f"Routed to {router_res['assigned_team']}", reasoning=router_res["reason"], confidence=router_res["routing_score"]),
        AgentLog(case_id=case.id, agent="ResolutionCopilot", decision="Synthesized Draft Action Plan", reasoning="Drafted standard municipal protocol pending supervisor sign-off", confidence=copilot_res["confidence"])
    ]
    for log in logs:
        db.add(log)
    db.commit()

    # Trigger WebSocket Broadcast in background
    payload = {
        "complaint_id": complaint.id,
        "incident_id": incident.id,
        "case_id": case.id,
        "category": complaint.category,
        "area": area_name,
        "affected_count": incident.affected_count,
        "priority_score": case.priority_score,
        "priority_band": case.priority_band,
        "state": case.state
    }
    background_tasks.add_task(ws_manager.broadcast, "complaint.received", payload)
    if cluster_res["action"] == "JOIN":
        background_tasks.add_task(ws_manager.broadcast, "incident.updated", payload)
    else:
        background_tasks.add_task(ws_manager.broadcast, "incident.created", payload)

    return ComplaintResponse(
        id=complaint.id,
        complaint={
            "id": complaint.id,
            "category": complaint.category,
            "raw_text": complaint.raw_text,
            "kannada_text": complaint.kannada_text,
            "translated_text": complaint.translated_text,
            "language": complaint.language,
            "location": area_name,
            "severity": complaint.severity,
            "safety_flag": complaint.safety_flag,
            "confidence": complaint.confidence
        },
        incident_id=incident.id,
        case_id=case.id,
        priority_score=p_res["score"],
        priority_band=p_res["band"],
        reason=p_res["reason"]
    )

@router.post("/{complaint_id}/confirm-transcript")
def confirm_transcript(
    complaint_id: int,
    confirm_in: TranscriptConfirmRequest,
    db: Session = Depends(get_db)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    if confirm_in.corrected_text:
        complaint.raw_text = confirm_in.corrected_text
        db.commit()
        db.refresh(complaint)
        
    return {
        "id": complaint.id,
        "confirmed": confirm_in.confirmed,
        "text": complaint.raw_text,
        "message": "Transcript confirmed by citizen."
    }

