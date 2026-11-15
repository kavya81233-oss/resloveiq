from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import PilotRequest
from app.schemas.schemas import PilotRequestCreate, PilotRequestResponse

router = APIRouter(prefix="/pilot-requests", tags=["pilot-requests"])

@router.post("", response_model=PilotRequestResponse)
def create_pilot_request(req: PilotRequestCreate, db: Session = Depends(get_db)):
    pilot = PilotRequest(
        name=req.name,
        organization=req.organization,
        email=req.email,
        role=req.role,
        message=req.message or "",
        status="RECEIVED"
    )
    db.add(pilot)
    db.commit()
    db.refresh(pilot)
    
    return PilotRequestResponse(
        id=pilot.id,
        status="RECEIVED",
        message="Pilot request successfully registered. Our civic integration team will contact you within 24 hours."
    )

