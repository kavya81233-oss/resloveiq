from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.models import Complaint, Case
from app.agents.understand import analyze_complaint_text
from app.comms.templates import render_kannada_message
from app.agents.closure import process_closure_verification

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/telegram")
async def telegram_webhook(
    request: Request,
    x_telegram_bot_api_secret_token: str = Header(None),
    db: Session = Depends(get_db)
):
    # Secret verification check
    if settings.TELEGRAM_WEBHOOK_SECRET and x_telegram_bot_api_secret_token != settings.TELEGRAM_WEBHOOK_SECRET:
        raise HTTPException(status_code=403, detail="Invalid Telegram secret token header")

    data = await request.json()
    
    # Check for callback queries (inline buttons: Yes/No closure or transcript confirmation)
    if "callback_query" in data:
        cb = data["callback_query"]
        cb_data = cb.get("data", "")
        # format: "closure:{case_id}:{yes|no}"
        if cb_data.startswith("closure:"):
            parts = cb_data.split(":")
            if len(parts) == 3:
                case_id = int(parts[1])
                confirmed = parts[2] == "yes"
                case = db.query(Case).filter(Case.id == case_id).first()
                if case:
                    result = process_closure_verification(confirmed, case.priority_score, case.reopen_count)
                    case.state = result["new_state"]
                    case.priority_score = result["new_priority"]
                    case.escalated = result["escalated"]
                    db.commit()
                    return {"status": "ok", "action": "closure_handled", "result": result}
        return {"status": "ok", "action": "callback_processed"}

    # Handle standard message (text, voice, photo)
    message = data.get("message", {})
    text = message.get("text")
    user = message.get("from", {})
    user_id = str(user.get("id", "telegram_user"))
    
    if text:
        understand = analyze_complaint_text(text)
        reply = render_kannada_message("received", complaint_id=999)
        return {"status": "ok", "reply": reply, "parsed": understand.dict()}

    return {"status": "ok", "action": "unhandled_payload"}

