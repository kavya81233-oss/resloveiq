"""
ResolveIQ Kannada Message Templates
Core requirement: Understands Kannada script, Kanglish, English, Hindi and voice notes.
Provides prompt communications in pure, natural Kannada.
"""

KANNADA_TEMPLATES = {
    "received": (
        "ನಮಸ್ಕಾರ, ನಿಮ್ಮ ದೂರನ್ನು ResolveIQ ನಲ್ಲಿ ದಾಖಲಿಸಿಕೊಳ್ಳಲಾಗಿದೆ. "
        "ದೂರು ಸಂಖ್ಯೆ: #{complaint_id}. ನಮ್ಮ ವ್ಯವಸ್ಥೆಯು ಪರಿಶೀಲಿಸುತ್ತಿದೆ."
    ),
    "merged": (
        "ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ({area}) ಇದೇ ಸಮಸ್ಯೆಗೆ ಸಂಬಂಧಿಸಿದಂತೆ #{incident_id} ಘಟನೆಯೊಂದಿಗೆ ನಿಮ್ಮ ದೂರನ್ನು ಒಗ್ಗೂಡಿಸಲಾಗಿದೆ. "
        "ಒಟ್ಟು {affected_count} ನಾಗರಿಕರು ಈ ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿದ್ದಾರೆ. ಒಂದು ಪರಿಹಾರದಿಂದ ಎಲ್ಲರಿಗೂ ಶೀಘ್ರ ಪರಿಹಾರ ಸಿಗಲಿದೆ."
    ),
    "assigned": (
        "ನಿಮ್ಮ ದೂರು #{complaint_id} (ಘಟನೆ #{incident_id}) ಸಂಬಂಧಪಟ್ಟ {team} ವಿಭಾಗಕ್ಕೆ ನಿಯೋಜಿಸಲಾಗಿದೆ. "
        "ಆದ್ಯತಾ ಅಂಕ: {priority_score} ({priority_band})."
    ),
    "closure_check": (
        "ನಮಸ್ಕಾರ, {area} ನಲ್ಲಿ #{incident_id} ಘಟನೆಗೆ ಸಂಬಂಧಿಸಿದ ಕಾಮಗಾರಿ ಮುಕ್ತಾಯಗೊಂಡಿದೆ ಎಂದು ಸಿಬ್ಬಂದಿ ವರದಿ ಮಾಡಿದ್ದಾರೆ. "
        "ನಿಮ್ಮ ದೂರು ನಿಜವಾಗಿಯೂ ಪರಿಹಾರವಾಗಿದೆಯೇ?\nದಯವಿಟ್ಟು 'ಹೌದು (Yes)' ಅಥವಾ 'ಇಲ್ಲ (No)' ಎಂದು ತಿಳಿಸಿ."
    ),
    "reopened": (
        "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಸಮಸ್ಯೆ ಇನ್ನೂ ಬಗೆಹರಿದಿಲ್ಲದಿರುವುದರಿಂದ, "
        "ದೂರನ್ನು ತಕ್ಷಣ ಮರುತೆರೆಯಲಾಗಿದೆ (Reopened). ಆದ್ಯತೆಯನ್ನು +15 ಹೆಚ್ಚಿಸಿ ಮೇಲಧಿಕಾರಿಗಳಿಗೆ ತುರ್ತು ವರದಿ ಕಳುಹಿಸಲಾಗಿದೆ."
    ),
    "closed": (
        "ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ದೃಢೀಕರಣದೊಂದಿಗೆ ದೂರು #{complaint_id} ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಂಡಿದೆ (Closed). "
        "ನಮ್ಮ ಸೇವೆಗೆ ನಿಮ್ಮ ರೇಟಿಂಗ್ ನೀಡಿದ್ದಕ್ಕಾಗಿ ವಂದನೆಗಳು."
    ),
    "transcript_check": (
        "ಧ್ವನಿ ಸಂದೇಶವನ್ನು ಹೀಗೆ ಗ್ರಹಿಸಲಾಗಿದೆ:\n\"{transcript}\"\n\nಇದು ಸರಿಯಾಗಿದೆಯೇ? 'ಹೌದು' ಅಥವಾ 'ತಿದ್ದುಪಡಿ ಮಾಡಿ'."
    )
}

def render_kannada_message(template_name: str, **kwargs) -> str:
    template = KANNADA_TEMPLATES.get(template_name, "")
    try:
        return template.format(**kwargs)
    except KeyError:
        return template

