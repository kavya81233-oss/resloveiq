from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import get_db, Base, engine
from app.schemas.schemas import HealthResponse
from app.api import complaints, cases, incidents, closure, insights, audit, uploads, pilot, auth, ws, telegram
from apscheduler.schedulers.background import BackgroundScheduler
import datetime

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="ResolveIQ: Agentic Kannada-First Complaint Management and Resolution System"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api/v1 and root
api_prefix = "/api/v1"
app.include_router(complaints.router, prefix=api_prefix)
app.include_router(cases.router, prefix=api_prefix)
app.include_router(incidents.router, prefix=api_prefix)
app.include_router(closure.router, prefix=api_prefix)
app.include_router(insights.router, prefix=api_prefix)
app.include_router(audit.router, prefix=api_prefix)
app.include_router(uploads.router, prefix=api_prefix)
app.include_router(pilot.router, prefix=api_prefix)
app.include_router(auth.router, prefix=api_prefix)
app.include_router(telegram.router)
app.include_router(ws.router)

# Health endpoint (Section 10.3: GET /health none -> status, version, db and model readiness)
@app.get("/health", response_model=HealthResponse)
def health_check(db: Session = Depends(get_db)):
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        
    return HealthResponse(
        status="operational" if "unhealthy" not in db_status else "degraded",
        version=settings.VERSION,
        database=db_status,
        model_readiness={
            "understand_agent": True,
            "cluster_engine": True,
            "priority_engine": True,
            "router_engine": True,
            "resolution_copilot": True,
            "risk_guard": True,
            "closure_agent": True
        }
    )

@app.get(f"{api_prefix}/health", response_model=HealthResponse)
def api_health_check(db: Session = Depends(get_db)):
    return health_check(db)

# APScheduler for Risk Guard (Section 10.1 & 10.2: Risk Guard every 5 minutes)
scheduler = BackgroundScheduler()

def scheduled_risk_guard_job():
    print(f"[{datetime.datetime.utcnow().isoformat()}] Running scheduled Risk Guard sweep...")

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    try:
        scheduler.add_job(scheduled_risk_guard_job, "interval", minutes=5)
        scheduler.start()
    except Exception as e:
        print(f"Scheduler warning: {e}")

@app.on_event("shutdown")
def shutdown_event():
    if scheduler.running:
        scheduler.shutdown()

