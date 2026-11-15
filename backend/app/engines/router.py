from typing import Dict, Any, List

TEAM_SKILLS = {
    "water": "BWSSB Water Supply & Drainage",
    "electricity": "BESCOM Electrical Operations",
    "road": "BBMP Road Infrastructure",
    "garbage": "BBMP Solid Waste Management",
    "health": "BBMP Public Health & Sanitation",
    "street_light": "BESCOM Street Lighting",
    "general": "Civic Operations Central"
}

def route_case(
    category: str,
    workload_ratio: float = 0.5,
    past_success_rate: float = 0.9,
    skill_matched: bool = True
) -> Dict[str, Any]:
    """
    Router engine:
    score = 0.5 * skill_match + 0.3 * (1 - workload_ratio) + 0.2 * past_success; below 0.4 goes to human queue.
    """
    skill_score = 1.0 if skill_matched else 0.0
    workload_score = max(0.0, 1.0 - min(workload_ratio, 1.0))
    success_score = min(max(past_success_rate, 0.0), 1.0)
    
    routing_score = (0.5 * skill_score) + (0.3 * workload_score) + (0.2 * success_score)
    routing_score = round(routing_score, 2)
    
    team = TEAM_SKILLS.get(category.lower(), "Civic Operations Central")
    requires_human_queue = routing_score < 0.40
    
    return {
        "assigned_team": team if not requires_human_queue else "Human Review Queue",
        "routing_score": routing_score,
        "requires_human_queue": requires_human_queue,
        "reason": f"Routed based on skill match ({skill_score}), capacity ({workload_score:.2f}), and reliability ({success_score:.2f})."
    }

