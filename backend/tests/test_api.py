from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["version"] == "1.0.0"
    assert data["model_readiness"]["understand_agent"] is True

def test_pilot_request():
    response = client.post("/api/v1/pilot-requests", json={
        "name": "Dr. Anand Rao",
        "organization": "Bengaluru Municipal Corp",
        "email": "anand.rao@bbmp.gov.in",
        "role": "Government",
        "message": "Interested in deployment across 5 wards."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "RECEIVED"
    assert "id" in data

def test_complaint_lifecycle():
    # Submit complaint
    response = client.post("/api/v1/complaints", json={
        "text": "Namma street alli water pipe odeede, neeru waste aaguthide",
        "channel": "web",
        "user_ref": "citizen_999"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["complaint"]["category"] == "water"
    assert "case_id" in data
    assert data["priority_score"] >= 50
    case_id = data["case_id"]

    # Approve fix
    appr_resp = client.post(f"/api/v1/cases/{case_id}/approve-fix", json={
        "final_fix": "BWSSB crew dispatched with replacement ductile iron coupling.",
        "accepted_as_is": True
    })
    assert appr_resp.status_code == 200
    assert appr_resp.json()["state"] == "FIX_APPROVED"

    # Mark fixed (dispatches verification)
    fixed_resp = client.post(f"/api/v1/cases/{case_id}/mark-fixed")
    assert fixed_resp.status_code == 200
    assert fixed_resp.json()["state"] == "PENDING_VERIFICATION"

    # Citizen says NO (reopens case with priority boost)
    closure_resp = client.post(f"/api/v1/closure/{case_id}/response", json={
        "confirmed": False,
        "rating": 1,
        "feedback": "Water is still leaking on 4th cross."
    })
    assert closure_resp.status_code == 200
    c_data = closure_resp.json()
    assert c_data["reopened"] is True
    assert c_data["state"] == "REOPENED"
    assert c_data["new_priority"] > 60

def test_incidents_list():
    response = client.get("/api/v1/incidents")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert "affected_count" in data[0]

