import pytest
from app.engines.priority import calculate_priority_score
from app.engines.risk_guard import calculate_breach_risk
from app.engines.router import route_case
from app.engines.cluster import evaluate_clustering
from app.agents.understand import analyze_complaint_text
from app.agents.closure import process_closure_verification

def test_priority_score_calculation():
    # Test formula matching section 6:
    # 30 * severity + 25 (if safety) + 20 * min(affected/20, 1) + 10 * distress + 10 (if vulnerable) + 5 * slaRisk
    res = calculate_priority_score(
        severity=1.4,
        safety=False,
        affected=14,
        distress=2.5,
        vulnerable=False,
        sla_risk=0.2
    )
    # severity: 30 * 1.4 = 42
    # safety: 0
    # blastRadius: 20 * (14/20) = 14
    # distress: 10 * 2.5 = 25
    # vulnerable: 0
    # sla: 5 * 0.2 = 1.0
    # Total = 42 + 0 + 14 + 25 + 0 + 1 = 82
    assert res["score"] == 82
    assert res["band"] == "Critical"
    assert "14 users affected (+14)" in res["reason"]

def test_risk_guard_formula():
    # risk = 0.4*(elapsed/sla) + 0.3*(load/capacity) + 0.2*(noFirstResponse?1:0) + 0.1*min(reopen/2,1)
    res_normal = calculate_breach_risk(
        elapsed_hours=6.0,
        sla_hours=24.0,
        current_load=10,
        team_capacity=20,
        has_first_response=True,
        reopen_count=0
    )
    # 0.4*(6/24=0.25) + 0.3*(10/20=0.5) + 0.2*(0) + 0.1*(0) = 0.1 + 0.15 = 0.25
    assert res_normal["risk"] == 0.25
    assert res_normal["escalate"] is False

    res_escalated = calculate_breach_risk(
        elapsed_hours=20.0,
        sla_hours=24.0,
        current_load=25,
        team_capacity=20,
        has_first_response=False,
        reopen_count=2
    )
    # 0.4*(20/24=0.833) = 0.333
    # 0.3*(1.0) = 0.3
    # 0.2*(1.0) = 0.2
    # 0.1*(1.0) = 0.1
    # total > 0.70
    assert res_escalated["risk"] >= 0.70
    assert res_escalated["escalate"] is True

def test_closure_reopen_logic():
    # Yes -> closed
    closed_res = process_closure_verification(confirmed=True, current_priority=60)
    assert closed_res["new_state"] == "CLOSED"
    assert closed_res["reopened"] is False
    assert closed_res["new_priority"] == 60

    # No -> reopened with priority +15
    reopened_res = process_closure_verification(confirmed=False, current_priority=60)
    assert reopened_res["new_state"] == "REOPENED"
    assert reopened_res["reopened"] is True
    assert reopened_res["new_priority"] == 75
    assert reopened_res["escalated"] is True

def test_understand_scripted_complaints():
    # Kannada
    kn_res = analyze_complaint_text("ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ")
    assert kn_res.category == "water"
    assert kn_res.location in ["Jayanagar", "Bengaluru"]

    # Kanglish
    kanglish_res = analyze_complaint_text("Namma street alli water pipe odeede, neeru waste aaguthide")
    assert kanglish_res.category == "water"
    assert kanglish_res.location in ["Jayanagar", "Bengaluru"]

    # Safety Koramangala
    safety_res = analyze_complaint_text("Drinking water alli sewage mix aagide, makkalige tondare aagide")
    assert safety_res.category == "water"
    assert safety_res.safety_flag is True
    assert safety_res.location == "Koramangala"

    # Power Whitefield
    power_res = analyze_complaint_text("Current hogi 5 hours aaytu, yaaru phone ettalla")
    assert power_res.category == "electricity"
    assert power_res.location == "Whitefield"

