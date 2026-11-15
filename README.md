# ResolveIQ (Problem Statement AA-02)
### Kannada-First Agentic AI Complaint Management and Resolution System
**"Every complaint is a promise. We prove it was kept."**  
**"ನಿಮ್ಮ ದೂರು, ನಮ್ಮ ಜವಾಬ್ದಾರಿ"**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Production-black?logo=vercel)](https://frontend-nu-nine-5nkqp0j7m6.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/Gopi45-gk/resolveiq)
[![System Guide](https://img.shields.io/badge/Documentation-Stakeholder%20%26%20System%20Guide-blue)](SYSTEM_GUIDE.md)

---

## 🌟 Why ResolveIQ Matters & Who It Is For

> **For the full in-depth walkthrough, see [SYSTEM_GUIDE.md](SYSTEM_GUIDE.md).**

### 1. The Core Problem
When a water main pipe bursts in Bengaluru, **500 citizens submit 500 duplicate tickets**. Helpdesks drown, field vans are dispatched redundantly, and contractors mark tickets *"Closed"* prematurely. Western tools fail to understand Kannada script or **Kanglish** (*"neeru barthilla"*).

### 2. How ResolveIQ Fixes It
- **Cluster:** 500 duplicate complaints collapse into **1 Incident Pin**. 1 field repair automatically notifies all 500 citizens.
- **Explain:** Every priority score (1–100) displays an explainable mathematical breakdown visible to everyone.
- **Verify:** A case closes **ONLY** after the citizen confirms *"Yes"*. If they click *"No"*, the case instantly reopens with a `+15` priority spike and alerts leadership.
- **Multi-Script AI:** Powered by **NVIDIA NIM** (`meta/llama-guard-4-12b` and `nvidia/nemotron-3.5-lightning-30b-a3b`) to understand Kannada, Kanglish, English, Hindi, and voice notes.

### 3. Stakeholder Value Matrix
- **Citizens:** Submit complaints easily in their native dialect; guarantee accountability through the citizen verification loop.
- **Field Crews (BWSSB / BESCOM / BBMP):** Receive clean single incidents with 3-step technical engineering SOPs instead of 500 duplicate tickets.
- **Ward Leads & Supervisors:** Early predictive SLA breach alerts at $\ge 70\%$ risk via **Risk Guard**; human supervisor review before dispatch.
- **City Commissioners:** Real-time GIS ward outage radius map and transparent audit trail without black-box opacity.

---

## 1. Overview & Architecture

ResolveIQ is an agentic civic grievance orchestration system built for high-stakes municipal governance. It replaces chaotic individual ticketing queues with an incident-first, cross-script intelligence model:
- **Understand Agent:** Comprehends Kannada script, Kanglish (colloquial Kannada phonetics in Latin letters), English, Hindi, and voice notes.
- **Cluster Engine:** Unifies semantically duplicate complaints within a 2 km radius into a single Incident using vector embeddings. 1 fix informs 500 citizens.
- **Explainable Priority Engine:** Dynamically calculates an impact score (1–100) using a transparent mathematical formula visible to citizens and staff.
- **Department Router:** Autonomously routes cases using weighted skill matches, team capacity, and historical SLA reliability.
- **Resolution Copilot:** Synthesizes municipal SOPs into a field action plan; requires human supervisor sign-off before dispatch.
- **Risk Guard:** Real-time formulaic SLA monitor that preemptively detects breach probability and alerts leads at `>= 70%`.
- **Verified Closure Loop:** A case closes **only** after the citizen clicks "Yes". A "No" immediately reopens the case with a `+15` priority spike and triggers escalation.

```
 Citizens                         Staff
 Telegram | Web form | Voice      Dashboard (Next.js)
     |          |         |              |   ^
     v          v         v              v   | WebSocket
 +----------------------------------------------+
 |            FastAPI gateway (REST + WS)       |
 |  auth | rate limit | validation | audit log  |
 +----------------------------------------------+
     |             |               |
     v             v               v
 [LangGraph]   [Engines]       [Scheduler]
  Understand   Cluster         Risk Guard (5 min)
  Resolution   Priority       Closure timers (48h)
  Closure      Router
     |             |               |
     +------+------+---------------+
            v
  PostgreSQL + pgvector     R2 object storage
            |
   LLM (Claude / Gemini)  Whisper / Sarvam  e5 embeddings
```

---

## 2. Quickstart & Exact Run Commands

### Live Production Deployment (Vercel)

The ResolveIQ Next.js landing site and interactive simulation are deployed on Vercel:
- **Production URL:** [https://frontend-nu-nine-5nkqp0j7m6.vercel.app](https://frontend-nu-nine-5nkqp0j7m6.vercel.app)
- **Direct Domain:** [https://frontend-p6rkfmhue-gopikaru0090-5904s-projects.vercel.app](https://frontend-p6rkfmhue-gopikaru0090-5904s-projects.vercel.app)
- **Deployment Dashboard:** [Vercel Project Dashboard](https://vercel.com/gopikaru0090-5904s-projects/frontend/4WwkpnC3cDkEPWhhHU9UwMRwgfpM)

---

### Option A: Local Development (Offline Simulation & Live API)

#### 1. Backend (FastAPI + SQLite/Postgres + NVIDIA NIM)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --host 0.0.0.0 --port 8003
```
- API Health Check: `http://localhost:8003/health`
- Swagger Documentation: `http://localhost:8003/docs`

#### NVIDIA NIM Multi-Agent Configuration (`backend/.env`):
ResolveIQ utilizes a 3-tier dedicated NVIDIA NIM multi-agent configuration:
- `NVIDIA_GUARD_API_KEY`: Powered by `meta/llama-guard-4-12b` for civic hazard & life-safety validation.
- `NVIDIA_NEMOTRON_API_KEY`: Powered by `nvidia/nemotron-3.5-lightning-30b-a3b` for structured JSON extraction & Resolution Copilot SOP drafting.
- `NVIDIA_MULTILINGUAL_API_KEY`: Powered by `nvidia/nemotron-3.5-lightning-30b-a3b` for Kannada, Kanglish, Hindi, and English cross-lingual translation.
- `NVIDIA_BASE_URL`: `https://integrate.api.nvidia.com/v1`

#### 2. Frontend (Next.js 14 App Router + Tailwind + Three.js)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` (auto-redirects to `http://localhost:3000/en` or `/kn`).

---

### Option B: Docker Compose (Full Stack with PostgreSQL + pgvector)

```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- PostgreSQL 16 + pgvector: `localhost:5432`

---

## 3. Running Test Suites & Quality Verification

### Frontend (Vitest + Axe-Core A11y + Typecheck + Lint)
```bash
cd frontend

# Strict TypeScript check (0 errors)
npm run typecheck

# ESLint check (0 errors)
npm run lint

# Unit tests + Axe-Core WCAG 2.2 AA accessibility validation
npm run test

# Production optimized build
npm run build
```

### Backend (Pytest + Seed + 120-Complaint Benchmark Evaluation)
```bash
cd backend

# Run all API and engine unit tests
PYTHONPATH=. ./venv/bin/pytest tests/

# Run 120-complaint benchmark evaluation across Kannada, Kanglish, English, Hindi
PYTHONPATH=. ./venv/bin/python eval/run_eval.py
```

---

## 4. Built-in Page Sections (16 Sections)

1. **Sticky Navigation (`#main`):** Incident-pin logo, navigation anchors, language toggle (`EN` | `ಕನ್`), theme toggle, pilot CTA button, 2px brand gradient progress bar, and mobile animated drawer.
2. **Hero (`#hero`):** Word-by-word mask-slide reveal headline, sub-headline, buttons with magnetic hover, Three.js 400-particle clustering visual with automatic Canvas 2D fallback, orbiting glass chips, and scroll cue.
3. **Problem Strip (`#problem`):** GSAP ScrollTrigger pinned collapse from 500 tickets into 1 unified incident pin, followed by 5 problem cards.
4. **How It Works (`#pipeline`):** Horizontal scroll on desktop (vertical stack on mobile) across 7 pipeline stages.
5. **Interactive Live Demo (`#demo`):** Centerpiece 2-column interactive simulator. Left: Telegram-style citizen channel with 5 quick-pick chips, free-text matching, voice waveform, and Kannada verification prompt. Right: Real-time agent console with JSON parsing, priority gauge, team badge, copilot edit/approval, and risk bar.
6. **Innovation Grid (`#innovation`):** 8 cards with 3D tilt hover, spotlight glow, and staggered entry.
7. **Languages (`#languages`):** 4 tabs (Kannada script, Kanglish, Voice, English) proving cross-script convergence into identical structured output.
8. **Verified Closure Timeline (`#timeline`):** Vertical animated timeline with interactive fork: Yes (closed + star rating) vs No (reopened +15 priority spike + red pulse).
9. **Dashboard Preview (`#dashboard`):** 5 tabs (Leaflet GIS map with 5 Bengaluru pins sized by affected count, Kanban board, Risk telemetry, streaming audit feed every 2s, and closure funnel).
10. **Design Targets (`#targets`):** Strictly labelled "Design target" cards: Category accuracy >= 90%, Duplicate recall >= 85%, Safety recall 100%, First response < 10s.
11. **Comparison Table (`#compare`):** Legacy ticketing vs ResolveIQ with highlighted checks.
12. **Tech Stack Marquee (`#tech`):** Dual-row infinite scrolling logo marquee.
13. **Roadmap (`#roadmap`):** Now (Core), Next (Q1 2027), and Later (Future).
14. **FAQ (`#faq`):** Accessible Radix accordion addressing key municipal questions.
15. **Pilot Request CTA (`#cta`):** Form with Zod validation, offline localStorage queueing, and confetti-free SVG checkmark draw.
16. **Footer:** Brand mark, Problem Statement AA-02 attribution, dynamic backend telemetry status badge, privacy policy link, and copyright.

---

## 5. Security, Civic Privacy & Phone Masking

- **Citizen Phone Masking:** Phone numbers are masked across all dashboard feeds (e.g. `+91 98*** **321`), accessible only to system administrators.
- **Rule-Based Risk Guard:** Deterministic formula guarantees auditability:
  $$\text{Risk} = 0.4 \times \left(\frac{\text{elapsed}}{\text{sla}}\right) + 0.3 \times \left(\frac{\text{load}}{\text{capacity}}\right) + 0.2 \times (\text{noFirstResponse}) + 0.1 \times \min\left(\frac{\text{reopen}}{2}, 1\right)$$
- **Object Storage Security:** Pre-signed URLs for citizen audio and photo uploads expire within 5 minutes.

