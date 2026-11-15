from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Incident
from app.schemas.schemas import IncidentResponse

router = APIRouter(prefix="/incidents", tags=["incidents"])

@router.get("", response_model=List[IncidentResponse])
def get_incidents(
    area: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    if area:
        query = query.filter(Incident.area.ilike(f"%{area}%"))
    if status:
        query = query.filter(Incident.status == status.upper())
        
    offset = (page - 1) * limit
    incidents = query.order_by(Incident.affected_count.desc()).offset(offset).limit(limit).all()
    
    return [
        IncidentResponse(
            id=inc.id,
            title=inc.title,
            category=inc.category,
            area=inc.area,
            lat=inc.lat,
            lng=inc.lng,
            status=inc.status,
            affected_count=inc.affected_count,
            root_cause_hypothesis=inc.root_cause_hypothesis,
            created_at=inc.created_at,
            updated_at=inc.updated_at
        )
        for inc in incidents
    ]

