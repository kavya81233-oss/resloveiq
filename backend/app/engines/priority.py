from typing import Dict, Any

def calculate_priority_score(
    severity: float,
    safety: bool,
    affected: int,
    distress: float,
    vulnerable: bool,
    sla_risk: float = 0.0
) -> Dict[str, Any]:
    """
    Priority Engine implementing the exact formula from Section 6:
    parts = {
      severity: 30 * severity,
      safety: 25 if safety else 0,
      blastRadius: 20 * min(affected / 20, 1.0),
      distress: 10 * distress,
      vulnerable: 10 if vulnerable else 0,
      sla: 5 * sla_risk,
    }
    """
    parts = {
        "severity": 30.0 * severity,
        "safety": 25.0 if safety else 0.0,
        "blastRadius": 20.0 * min(affected / 20.0, 1.0),
        "distress": 10.0 * distress,
        "vulnerable": 10.0 if vulnerable else 0.0,
        "sla": 5.0 * sla_risk,
    }
    
    score = round(sum(parts.values()))
    
    if score >= 75:
        band = "Critical"
    elif score >= 50:
        band = "High"
    elif score >= 25:
        band = "Medium"
    else:
        band = "Low"
        
    reason_items = []
    if parts["safety"] > 0:
        reason_items.append(f"safety risk (+{int(parts['safety'])})")
    reason_items.append(f"{affected} users affected (+{round(parts['blastRadius'])})")
    reason_items.append(f"severity (+{round(parts['severity'])})")
    if parts["distress"] > 3.0:
        reason_items.append(f"distressed tone (+{round(parts['distress'])})")
        
    reason = f"Priority {score}: " + ", ".join(reason_items) + "."
    
    return {
        "score": score,
        "band": band,
        "reason": reason,
        "parts": parts
    }

