export interface ScriptedComplaint {
  id: string;
  chipLabel: string;
  category: string;
  location: string;
  text: string;
  language: string;
  kannadaText: string;
  translatedText: string;
  severity: number;
  safety: boolean;
  distress: number;
  vulnerable: boolean;
  team: string;
  suggestedFix: string;
}

export const SCRIPTED_COMPLAINTS: ScriptedComplaint[] = [
  {
    id: "kannada",
    chipLabel: "Kannada script",
    category: "water",
    location: "Jayanagar",
    text: "ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ",
    language: "kn",
    kannadaText: "ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ, ಶುದ್ಧ ನೀರು ರಸ್ತೆಯಲ್ಲಿ ವ್ಯರ್ಥವಾಗುತ್ತಿದೆ.",
    translatedText: "Cauvery water pipeline burst on our street, clean municipal drinking water flooding the road.",
    severity: 1.4,
    safety: false,
    distress: 2.5,
    vulnerable: false,
    team: "BWSSB Water Supply & Drainage",
    suggestedFix: "1. Isolate Jayanagar 4th Block sector valve.\n2. Dispatch emergency repair squad with 150mm ductile iron sleeve clamp.\n3. Estimated repair: 180 min.",
  },
  {
    id: "kanglish",
    chipLabel: "Kanglish",
    category: "water",
    location: "Jayanagar",
    text: "Namma street alli water pipe odeede, neeru waste aaguthide",
    language: "kanglish",
    kannadaText: "ನಮ್ಮ ರಸ್ತೆಯಲ್ಲಿ ಕಾವೇರಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದೆ, ನೀರು ವೇಸ್ಟ್ ಆಗುತ್ತಿದೆ.",
    translatedText: "Water pipe has burst on our street, clean water is continuously getting wasted.",
    severity: 1.4,
    safety: false,
    distress: 2.8,
    vulnerable: false,
    team: "BWSSB Water Supply & Drainage",
    suggestedFix: "1. Isolate sector supply valve.\n2. Deploy BWSSB excavation and pipe restoration team.\n3. Send restoration ETA update to affected citizens.",
  },
  {
    id: "english",
    chipLabel: "English",
    category: "water",
    location: "Jayanagar",
    text: "Water pipe burst near 4th Block, road is flooding",
    language: "en",
    kannadaText: "ಜಯನಗರ 4ನೇ ಬ್ಲಾಕ್ ಬಳಿ ನೀರಿನ ಪೈಪ್ ಒಡೆದಿದ್ದು ರಸ್ತೆ ಜಲಾವೃತವಾಗಿದೆ.",
    translatedText: "Water pipe burst near 4th Block, road is flooding severely hindering vehicular movement.",
    severity: 1.4,
    safety: false,
    distress: 2.0,
    vulnerable: false,
    team: "BWSSB Water Supply & Drainage",
    suggestedFix: "1. Traffic rerouting via 5th cross.\n2. BWSSB emergency team seal and clamp cracked flange.\n3. Post-fix hydrostatic pressure check.",
  },
  {
    id: "safety",
    chipLabel: "Safety",
    category: "water (safety)",
    location: "Koramangala",
    text: "Drinking water alli sewage mix aagide, makkalige tondare aagide",
    language: "kanglish",
    kannadaText: "ಕುಡಿಯುವ ನೀರಿನಲ್ಲಿ ಒಳಚರಂಡಿ ನೀರು ಮಿಶ್ರಣವಾಗಿದೆ, ಮಕ್ಕಳಿಗೆ ಅನಾರೋಗ್ಯದ ಭೀತಿ ಇದೆ.",
    translatedText: "Sewage water has contaminated the drinking water line, severe health risk to children.",
    severity: 1.9,
    safety: true,
    distress: 4.5,
    vulnerable: true,
    team: "BWSSB & BBMP Health Joint Taskforce",
    suggestedFix: "1. URGENT: Shut down municipal feeder line immediately.\n2. Issue boil-water advisory via SMS broadcast.\n3. Deploy tanker supply and excavate cross-contamination junction.",
  },
  {
    id: "power",
    chipLabel: "Power",
    category: "electricity",
    location: "Whitefield",
    text: "Current hogi 5 hours aaytu, yaaru phone ettalla",
    language: "kanglish",
    kannadaText: "ವಿದ್ಯುತ್ ವ್ಯತ್ಯಯವಾಗಿ 5 ಗಂಟೆಗಳಾಗಿವೆ, ಸಹಾಯವಾಣಿಯಲ್ಲಿ ಯಾರೂ ಫೋನ್ ಎತ್ತುತ್ತಿಲ್ಲ.",
    translatedText: "Power has been out for 5 hours without update, helpline calls are going unanswered.",
    severity: 1.2,
    safety: false,
    distress: 3.5,
    vulnerable: false,
    team: "BESCOM Electrical Operations",
    suggestedFix: "1. Investigate 11kV feeder breaker trip at Whitefield substation.\n2. Reroute load to secondary auxiliary transformer.\n3. Restore grid power within 90 minutes.",
  },
];

export interface IncidentArea {
  name: string;
  lat: number;
  lng: number;
  affected: number;
  category: string;
  status: string;
}

export const SEED_AREAS: Record<string, IncidentArea> = {
  Jayanagar: { name: "Jayanagar", lat: 12.9299, lng: 77.5826, affected: 14, category: "water", status: "OPEN" },
  Koramangala: { name: "Koramangala", lat: 12.9352, lng: 77.6245, affected: 19, category: "water", status: "OPEN" },
  Indiranagar: { name: "Indiranagar", lat: 12.9784, lng: 77.6408, affected: 9, category: "road", status: "OPEN" },
  Malleshwaram: { name: "Malleshwaram", lat: 13.0035, lng: 77.5647, affected: 12, category: "garbage", status: "OPEN" },
  Whitefield: { name: "Whitefield", lat: 12.9698, lng: 77.7500, affected: 28, category: "electricity", status: "OPEN" },
};

