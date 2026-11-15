from typing import Dict, Any

def calculate_breach_risk(
    elapsed_hours: float,
    sla_hours: float = 24.0,
    current_load: int = 15,
    team_capacity: int = 20,
    has_first_response: bool = True,
    reopen_count: int = 0
) -> Dict[str, Any]:
    """
    Risk Guard breach risk formula from Section 6:
    risk = 0.4*(elapsed/sla) + 0.3*(load/capacity) + 0.2*(noFirstResponse?1:0) + 0.1*min(reopen/2,1); escalate at 0.7.
    """
    sla_ratio = min(elapsed_hours / max(sla_hours, 1.0), 2.0)
    load_ratio = min(current_load / max(team_capacity, 1), 2.0)
    no_first_resp = 0.0 if has_first_response else 1.0
    reopen_factor = min(reopen_count / 2.0, 1.0)
    
    risk = (0.4 * sla_ratio) + (0.3 * load_ratio) + (0.2 * no_first_resp) + (0.1 * reopen_factor)
    risk = round(min(max(risk, 0.0), 1.0), 2)
    escalate = risk >= 0.70
    
    return {
        "risk": risk,
        "escalate": escalate,
        "factors": {
            "elapsed_ratio": sla_ratio,
            "load_ratio": load_ratio,
            "no_first_response": no_first_resp,
            "reopen_factor": reopen_factor
        }
    }

