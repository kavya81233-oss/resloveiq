from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Incident
from app.schemas.schemas import InsightResponse

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/{incident_id}", response_model=InsightResponse)
def get_incident_insight(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    summary = incident.root_cause_hypothesis or (
        f"Temporal and geospatial convergence in {incident.area} reveals concentrated infrastructure strain on {incident.category} feeder line."
    )
    
    trend = "ACCELERATING" if incident.affected_count >= 10 else "STABLE"
    
    recommendations = [
        f"Schedule preventive ultrasonic pipe thickness analysis across {incident.area} quadrant.",
        "Update predictive maintenance telemetry thresholds on municipal SCADA dashboard.",
        "Initiate localized resident SMS broadcast regarding scheduled reinforcement works."
    ]
    
    return InsightResponse(
        incident_id=incident.id,
        root_cause_summary=summary,
        trend=trend,
        affected_count=incident.affected_count,
        category=incident.category,
        location=incident.area,
        recommendations=recommendations
    )

