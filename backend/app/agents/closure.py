from typing import Dict, Any

def process_closure_verification(
    confirmed: bool,
    current_priority: int,
    reopen_count: int = 0
) -> Dict[str, Any]:
    """
    Closure Agent:
    Validates citizen response to closure verification prompt.
    If confirmed == True: case moves to CLOSED.
    If confirmed == False: case REOPENS, priority increases by +15, escalates 1 level, alerts Lead.
    """
    if confirmed:
        return {
            "new_state": "CLOSED",
            "reopened": False,
            "new_priority": current_priority,
            "escalated": False,
            "message": "Citizen confirmed fix. Case closed successfully with high satisfaction score."
        }
    else:
        new_priority = min(current_priority + 15, 100)
        return {
            "new_state": "REOPENED",
            "reopened": True,
            "new_priority": new_priority,
            "escalated": True,
            "reopen_count": reopen_count + 1,
            "message": "Citizen reported fix unsatisfied! Reopening case immediately with +15 priority boost and alert to Team Lead."
        }

