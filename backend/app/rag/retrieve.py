from typing import List, Dict, Any

def retrieve_similar_sops(category: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """Retrieves top matching SOP guidelines for a given civic domain."""
    sample_sops = [
        {"title": f"{category.capitalize()} Emergency Protocol", "content": "Immediately isolate upstream distribution valves and deploy priority field crew within 60 minutes."},
        {"title": "Hazardous Area Containment", "content": "Establish pedestrian barrier and post multilingual advisory signage on municipal channels."},
        {"title": "Quality Verification & Audit", "content": "Collect post-repair photo documentation and perform residual pressure test before initiating citizen verification prompt."}
    ]
    return sample_sops[:top_k]

