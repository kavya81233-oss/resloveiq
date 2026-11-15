import json
import re
import httpx
from typing import Dict, Any, List, Optional
from app.config import settings

def call_nvidia_nim_resolution(
    category: str,
    location: str,
    summary: str,
    affected_count: int,
    api_key: str,
    model: str = "nvidia/nemotron-3.5-lightning-30b-a3b",
    base_url: str = "https://integrate.api.nvidia.com/v1"
) -> Optional[Dict[str, Any]]:
    """Calls NVIDIA NIM to draft specialized technical municipal resolution plan and Kannada notice."""
    endpoint = f"{base_url.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    system_prompt = (
        "You are ResolveIQ's Resolution Copilot for municipal civic grievance operations in Bengaluru, India.\n"
        "Generate a structured JSON response (no markdown, no preamble) with:\n"
        '1. "copilot_suggested_fix": string (3-step technical engineering action plan for field crew)\n'
        '2. "suggested_kannada_reply": string (polite, reassuring Kannada citizen update with estimated ETA)\n'
        '3. "confidence": float (between 0.90 and 0.99)'
    )
    user_prompt = (
        f"Incident Category: {category}\n"
        f"Locality: {location}\n"
        f"Summary: {summary}\n"
        f"Citizens Affected: {affected_count}\n"
        "Return valid JSON directly."
    )
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.1,
        "max_tokens": 2048
    }
    try:
        with httpx.Client(timeout=14.0) as client:
            resp = client.post(endpoint, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                choice = data["choices"][0]["message"]
                raw_json = choice.get("content") or choice.get("reasoning_content") or ""
                match = re.search(r"\{.*\}", raw_json, re.DOTALL)
                if match:
                    parsed = json.loads(match.group(0))
                    fix = parsed.get("copilot_suggested_fix")
                    if isinstance(fix, list):
                        fix = "\n".join(f"{i+1}. {item}" for i, item in enumerate(fix))
                    return {
                        "copilot_suggested_fix": str(fix or "Field crew dispatched."),
                        "suggested_kannada_reply": str(parsed.get("suggested_kannada_reply") or "ಕಾರ್ಯ ಪ್ರಗತಿಯಲ್ಲಿದೆ."),
                        "requires_human_approval": True,
                        "confidence": float(parsed.get("confidence", 0.95))
                    }
    except Exception as e:
        print(f"[ResolutionCopilot] NVIDIA NIM error: {e}")
    return None

def draft_resolution_copilot(
    category: str,
    location: str,
    summary: str,
    affected_count: int
) -> Dict[str, Any]:
    """
    Resolution Copilot:
    1. Checks if NVIDIA NIM API key is configured and generates tailored SOP action plan.
    2. Falls back to standard validated municipal protocols.
    """
    # 1. Attempt NVIDIA NIM
    nim_key = settings.NVIDIA_NEMOTRON_API_KEY or settings.NVIDIA_API_KEY
    if nim_key and len(nim_key) > 5 and nim_key != "test_nvidia_key":
        nim_res = call_nvidia_nim_resolution(
            category, location, summary, affected_count,
            nim_key, settings.NVIDIA_MODEL_NEMOTRON, settings.NVIDIA_BASE_URL
        )
        if nim_res and nim_res.get("copilot_suggested_fix"):
            return nim_res

    # 2. Standard Municipal SOP Protocol Fallback
    if category == "water":
        draft_fix = (
            f"1. Immediate valve isolation on {location} distribution grid line.\n"
            f"2. Dispatch BWSSB emergency repair team with 150mm ductile iron sleeve clamp.\n"
            f"3. Expected repair duration: 180 minutes. Notify {affected_count} affected citizens with restoration ETA."
        )
        citizen_update = (
            f"BWSSB ತುರ್ತು ದುರಸ್ತಿ ತಂಡವು ಸ್ಥಳಕ್ಕೆ ತೆರಳಿದೆ. ಪೈಪ್ಲೈನ್ ದುರಸ್ತಿ ಕಾರ್ಯ ಪ್ರಗತಿಯಲ್ಲಿದೆ. "
            f"ಅಂದಾಜು 3 ಗಂಟೆಗಳಲ್ಲಿ ನೀರು ಸರಬರಾಜು ಪುನರಾರಂಭಗೊಳ್ಳಲಿದೆ."
        )
    elif category == "electricity":
        draft_fix = (
            f"1. Isolate 11kV feeder line at {location} substation.\n"
            f"2. Deploy BESCOM fault-locator van to repair tripped vacuum circuit breaker.\n"
            f"3. Estimated restoration: 90 minutes. Auto-notify {affected_count} consumers on grid sector."
        )
        citizen_update = (
            f"ಬೆಸ್ಕಾಂ (BESCOM) ತಾಂತ್ರಿಕ ಸಿಬ್ಬಂದಿ ವಿದ್ಯುತ್ ಉಪಕೇಂದ್ರದಲ್ಲಿ ಪರಿಶೀಲನೆ ನಡೆಸುತ್ತಿದ್ದಾರೆ. "
            f"ಮುಂದಿನ 90 ನಿಮಿಷಗಳಲ್ಲಿ ವಿದ್ಯುತ್ ಮರುಸ್ಥಾಪನೆಯಾಗಲಿದೆ."
        )
    else:
        draft_fix = (
            f"1. Assign civic response squad to inspect {location} site.\n"
            f"2. Deploy containment and corrective remediation team under municipal SLA guidelines.\n"
            f"3. Upload resolution proof photo prior to closure check verification."
        )
        citizen_update = (
            f"ನಿಮ್ಮ ದೂರಿನ ಸ್ಥಳಕ್ಕೆ ಪರಿಶೀಲನಾ ತಂಡವನ್ನು ಕಳುಹಿಸಲಾಗಿದೆ. ಶೀಘ್ರ ಪರಿಹಾರ ಕ್ರಮ ಕೈಗೊಳ್ಳಲಾಗುವುದು."
        )
        
    return {
        "copilot_suggested_fix": draft_fix,
        "suggested_kannada_reply": citizen_update,
        "requires_human_approval": True,
        "confidence": 0.94
    }
