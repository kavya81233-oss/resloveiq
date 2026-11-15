# ResolveIQ — Architectural Decisions (DECISIONS.md)

This document records architectural, technical, and design choices made during the development of the ResolveIQ civic-tech complaint management and resolution platform, following Rule 2 of the Master Build Prompt.

---

## 1. Dual-Engine Vector and Fallback Strategy
- **Decision:** Use PostgreSQL with the `pgvector` extension for production embeddings (multilingual-e5-small, 384 dimensions). For test runs and environments where pgvector extension or PostgreSQL is being spun up or running SQLite/in-memory unit tests, provide a seamless transparent cosine-similarity vector fallback in pure Python / NumPy or SQLAlchemy JSON vector column.
- **Rationale:** Ensures unit tests and local development can run without requiring a running PostgreSQL instance with pgvector compiled, while maintaining exact cosine similarity distance matching (threshold 0.82) and 384-dimensional vector schemas.

## 2. LLM & Multilingual Inference Engine
- **Decision:** Primary LLM integration is Claude with Gemini as fallback. For zero-credential local runs, unit tests, and the offline simulation mode, an embedded deterministic rule-based / regex Kannada & Kanglish phonetic NLP parser is integrated in `UnderstandAgent` that parses the sample and scripted complaints accurately with confidence scores and sentiment distress extraction.
- **Rationale:** Section 2 and 10.12 state: "Judge-ready: works offline in simulation mode, no backend needed for the demo". Providing an embedded deterministic pipeline ensures tests and offline demos never fail due to API rate limits or missing credentials.

## 3. Frontend Localization & Routing (`next-intl`)
- **Decision:** Implement internationalization with `next-intl` using cookie/header detection with localized routes `/[locale]` supporting `en` and `kn`. Include a persistent language toggle (`EN` | `ಕನ್`) in the sticky navigation.
- **Rationale:** Meets Section 9 ("Two locales, en and kn... switches without a page reload") and provides native Kannada typography with `Noto Sans Kannada` and fluid scaling.

## 4. Priority Formula & Risk Guard Weightings
- **Decision:** Hardcode the exact formula specified in Section 6 and Section 10.6:
  - `Priority Score` = `30 * severity + (safety ? 25 : 0) + 20 * min(affected / 20, 1) + 10 * distress + (vulnerable ? 10 : 0) + 5 * slaRisk`
  - Priority bands: `>= 75` Critical (danger), `>= 50` High (warn), `>= 25` Medium (primary), `< 25` Low (muted).
  - `Risk Guard` = `0.4 * (elapsed / sla) + 0.3 * (load / capacity) + 0.2 * (noFirstResponse ? 1 : 0) + 0.1 * min(reopen / 2, 1)`
  - Escalation threshold: `>= 0.70` (triggers immediate lead alert and priority bump).
- **Rationale:** Strict adherence to section 6 and 12 requirements.

## 5. Hero 3D & 2D Particle Cluster
- **Decision:** Build a responsive Three.js (@react-three/fiber + @react-three/drei) visual with 400 glowing particles that dynamically cluster into 5 incident nodes over 6 seconds. If WebGL is not supported or device hardware concurrency is `<= 4` on mobile, automatically render a high-performance Canvas 2D fallback with 120 particles.
- **Rationale:** Strictly complies with Section 5.2 and Section 7 responsiveness rules, preserving battery on mobile while providing the "wow factor in the first 5 seconds" on desktop.

## 6. Pinned Horizontal & Scrubbed Scroll
- **Decision:** On desktop (`>= 768px`), use GSAP + ScrollTrigger for the horizontal pipeline and problem strip ticket collapse. On mobile devices (`< 768px`), gracefully switch to an animated vertical stack without horizontal pinning.
- **Rationale:** Ensures flawless mobile usability with no accidental scroll trap or horizontal scrollbars, respecting touch targets and viewport height (`100svh`).

## 7. Phone Masking and Civic Privacy
- **Decision:** All citizen phone numbers returned to non-admin staff roles (`agent`, `lead`, `citizen`) are masked (e.g., `+91 98*** **321`). Admin role can see unmasked numbers. All data in live and simulated mode complies with strict civic privacy standards.
- **Rationale:** Follows Section 10.8 and Section 10.13 security rules.


## 8. Multi-Model NVIDIA NIM Pipeline Architecture
- **Decision:** Architect a 3-tier dedicated NVIDIA NIM multi-agent pipeline:
  1. **Risk Guard & Hazard Validation (`meta/llama-guard-4-12b`):** Powered by `NVIDIA_GUARD_API_KEY`. Evaluates incoming complaint text for severe life-safety threats (e.g., exposed high-voltage wires, open stormwater drains, toxic drinking water contamination) and triggers instantaneous priority escalation.
  2. **Civic Understanding & Structured Extraction (`nvidia/nemotron-3.5-lightning-30b-a3b`):** Powered by `NVIDIA_NEMOTRON_API_KEY`. Extracts fine-grained municipal categorization, severity, sentiment distress, vulnerable citizen mentions, and Bengaluru ward locations with strict Pydantic JSON validation.
  3. **Multilingual Translation & Kannada Copilot (`nvidia/nemotron-3.5-lightning-30b-a3b`):** Powered by `NVIDIA_MULTILINGUAL_API_KEY`. Bridges Kannada script, Kanglish phonetics, Hindi, and English, drafting technical 3-step field engineering SOP repair plans and citizen updates in native Kannada.
- **Rationale:** Strictly uses the user's three NVIDIA NIM keys (`multlilugal`, `nemotron-3.5-parse`, `llama-guard-4-12b`) for sovereign, low-latency, enterprise-grade civic operations with resilient fallback to deterministic local NLP.
