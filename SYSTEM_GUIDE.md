# ResolveIQ — Complete Stakeholder & System Architecture Guide

> **Problem Statement AA-02:** AI-Based Complaint Management and Resolution Assistant  
> **Tagline (English):** *Every complaint is a promise. We prove it was kept.*  
> **Tagline (Kannada):** *ನಿಮ್ಮ ದೂರು, ನಮ್ಮ ಜವಾಬ್ದಾರಿ*  
> **Live Production URL:** [https://frontend-nu-nine-5nkqp0j7m6.vercel.app](https://frontend-nu-nine-5nkqp0j7m6.vercel.app)  
> **GitHub Repository:** [https://github.com/Gopi45-gk/resolveiq](https://github.com/Gopi45-gk/resolveiq)

---

## 1. Why ResolveIQ Matters: The Real Problem We Solve

In traditional civic ticketing systems (like BBMP Sahaya, Zendesk, or Freshdesk), grievance handling suffers from 4 fundamental flaws:

```
TRADITIONAL SYSTEM (Broken):
[1 Broken Water Main] ──> 500 Disconnected Tickets ──> Support Drowning In Duplicates
                                                     ──> False "Closed" status without proof
                                                     ──> 500 Angry Citizens Left in the Dark

RESOLVEIQ (Incident-First):
[1 Broken Water Main] ──> Merged into 1 Incident   ──> 1 Optimized Field Dispatch
                                                     ──> Live Progress Updates to all 500 citizens
                                                     ──> Citizen verifies fix: Closes ONLY if Citizen says "YES"
```

1. **The Duplicate Flood:** When a water main bursts or a transformer explodes in a high-density area like Koramangala or Indiranagar, hundreds of citizens report the exact same issue. In legacy systems, each submission creates an independent ticket, cluttering queues, dispatching duplicate inspection vans, and causing massive administrative waste.
2. **The Language & Script Barrier:** Over 50 million citizens in Karnataka communicate in Kannada or **Kanglish** (colloquial Kannada phonetics typed in English alphabet, e.g., *"namma street alli neeru barthilla, dayavittu sari maadi"*). Western ticketing tools fail completely on Kanglish and Kannada voice recordings.
3. **False Closures:** Municipal field contractors routinely mark tickets as *"Resolved"* to avoid SLA penalties and beat departmental metrics without actually fixing the problem. The citizen is never asked for verification.
4. **Opaque Prioritization:** Citizens have no idea why one issue is fixed in 2 hours while another takes 3 weeks. There is zero transparency into municipal scheduling algorithms.

---

## 2. Who Are the Stakeholders? (Stakeholder Value Matrix)

ResolveIQ connects four critical user groups in civic governance:

| Stakeholder | Persona / Role | Core Pain Point | How ResolveIQ Empowers Them |
| :--- | :--- | :--- | :--- |
| **Citizens** | Residents, commuters, apartment associations, shopkeepers across Bengaluru | • Long, confusing bureaucratic forms.<br>• Ignored complaints.<br>• Premature or fraudulent ticket closures. | • Submit naturally via **Web, Telegram, Voice, or Photo** in Kannada, Kanglish, English, or Hindi.<br>• **Verified Closure Loop:** The government cannot close a case until the citizen taps *"Yes"*. Tapping *"No"* immediately reopens the case and escalates it to leadership. |
| **Field Crews** | Ground technicians, linemen (BESCOM), plumbers (BWSSB), road repair teams (BBMP) | • Drowning in 500 duplicate tickets for 1 incident.<br>• Ambiguous instructions from helpdesk call operators. | • Receive **1 unified Incident** with total affected citizen count.<br>• Receive **AI Resolution Copilot SOPs**: 3-step technical engineering plans (e.g. valve isolation coordinates, clamp dimensions, required tools). |
| **Ward Leads & Supervisors** | Assistant Executive Engineers (AEE), Ward Health Officers, Electrical Substation In-Charge | • Blind spots on impending SLA breaches.<br>• High-stress manual dispatching and lack of real-time telemetry. | • **Predictive Risk Guard**: Automated formula flags incidents with $\ge 70\%$ SLA breach risk before they break.<br>• **Human-in-the-Loop Governance**: AI drafts plans, but the supervisor reviews, edits, and taps *"Approve"* before field crews are dispatched. |
| **City Commissioners & Leadership** | BBMP Commissioners, Ministry of Urban Development, Public Utilities | • Black-box AI models that cannot be audited.<br>• Lack of cross-ward spatial visibility. | • **Explainable Impact Scoring**: Deterministic math visible to citizens and auditors.<br>• **Live GIS Outage Maps**: Real-time visualization of outage radii and incident clusters across all Bengaluru wards. |

---

## 3. How the System Works: End-to-End Agent Pipeline

ResolveIQ orchestrates seven specialized agents and engines to take a raw citizen message all the way to verified resolution:

```
[Citizen Intake] ──> (Kannada Script, Kanglish, English, Hindi, Voice, Photo)
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. UNDERSTAND AGENT                                         │
│ • NVIDIA Llama Guard 4 (12B): Immediate life-safety check   │
│ • NVIDIA Nemotron 3.5 (30B): Structured JSON extraction     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CLUSTER ENGINE                                           │
│ • Vector embeddings (multilingual-e5-small) + Spatial Radius│
│ • Collapses duplicates within 2 km into 1 Incident          │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. EXPLAINABLE PRIORITY ENGINE                              │
│ • Score = 30*sev + 25*safety + 20*affected + 10*distress... │
│ • Bands: Critical (≥75), High (≥50), Medium (≥25), Low (<25)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. DEPARTMENT ROUTER                                        │
│ • Weighted match: 0.5 skill + 0.3 workload + 0.2 SLA history│
│ • Dispatches to BWSSB, BESCOM, BBMP Road, or Health         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. RESOLUTION COPILOT (Human-in-the-Loop)                   │
│ • Generates 3-step engineering repair SOP                   │
│ • Generates polite Kannada progress notification            │
│ • Requires Supervisor [Approve] before ground dispatch      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. PREDICTIVE RISK GUARD (Runs Every 5 Minutes)             │
│ • Risk = 0.4(el/sla) + 0.3(load/cap) + 0.2(noResp) + 0.1(re)│
│ • Triggers automatic lead escalation when Risk ≥ 0.70       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. VERIFIED CLOSURE LOOP                                    │
│ • Pings Citizen: "Was your issue resolved?"                 │
│    ├── [YES] ──> Status: CLOSED + Citizen Star Rating       │
│    └── [NO]  ──> Status: REOPENED (+15 Priority Penalty     │
│                  + Automatic Alert to Executive Engineer)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Key Mathematical Formulas (Total Transparency)

### A. Explainable Priority Impact Score
$$\text{Priority Score} = 30 \times \text{severity} + (\text{safety} ? 25 : 0) + 20 \times \min\left(\frac{\text{affected}}{20}, 1\right) + 10 \times \text{distress} + (\text{vulnerable} ? 10 : 0) + 5 \times \text{slaRisk}$$

- **Severity (0.5 to 2.0):** Derived by Understand Agent from technical defect description.
- **Safety Risk (+25 pts):** Triggered when life hazards are detected by NVIDIA Llama Guard 4 (live wires, water contamination, deep open craters).
- **Blast Radius (+20 pts max):** Scales as more citizens join the same incident node.
- **Distress Tone (+10 to +45 pts):** Analyzes sentiment distress of citizens (e.g. panic, elderly residents trapped, health risk).
- **Vulnerable Area (+10 pts):** Added if incident is near schools, hospitals, or nursing homes.

### B. Predictive SLA Breach Risk (Risk Guard)
$$\text{Breach Risk} = 0.4 \times \left(\frac{\text{elapsed}}{\text{sla}}\right) + 0.3 \times \left(\frac{\text{load}}{\text{capacity}}\right) + 0.2 \times (\text{noFirstResponse}) + 0.1 \times \min\left(\frac{\text{reopen}}{2}, 1\right)$$

- When $\text{Risk} \ge 0.70$, the system automatically issues a yellow/red alert to ward supervisors and reallocates field priorities before the legal SLA is breached.

---

## 5. Live Web Application Tour (What to Experience)

Visit the production site at [https://frontend-nu-nine-5nkqp0j7m6.vercel.app](https://frontend-nu-nine-5nkqp0j7m6.vercel.app):

1. **Hero Particle Clustering:** 400 glowing particles representing raw citizen complaints gradually gravitate and coalesce into 5 glowing Incident nodes over 6 seconds.
2. **Interactive Live Demo:** A dual-column simulator:
   - **Left (Citizen Interface):** Experience submitting via quick-pick chips, typing custom Kanglish, listening to simulated voice notes, and testing the **"Yes" / "No"** closure verification loop.
   - **Right (Municipal Agent Console):** Watch live JSON parsing, the circular SVG priority gauge dynamically animate, team routing, copilot editing, and risk bar fill.
3. **Language Showcase:** Toggle between Kannada script (`ಕನ್ನಡ`), Kanglish (`neeru barthilla`), Voice waveform, and English to see how all four converge into the exact same structured civic output.
4. **Verified Closure Timeline:** An interactive timeline demonstrating the branching logic between a citizen clicking **"Yes"** (successful closure) versus **"No"** (instant reopening and priority escalation).
5. **Dashboard Preview:** Live Leaflet GIS map of Bengaluru with pins sized by citizen blast radius, Kanban dispatch boards, real-time telemetry, and closure funnel charts.
6. **Pilot Request CTA:** A validated inquiry form for civic departments to request pilot deployments with offline queueing support.
