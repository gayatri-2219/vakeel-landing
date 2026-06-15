# VAKEEL — Privacy-First Legal Intelligence Platform

## Overview
VAKEEL is a local-first legal intelligence platform powered entirely by the QVAC SDK. It turns the moment "should I sign this?" from a question only lawyers can answer into a 30-second offline analysis anyone can run on a $300 laptop or mid-range phone. Every inference call runs on-device — no OpenAI, no Gemini, no cloud LLM anywhere.

## The Story
VAKEEL exists because a family member was defrauded through a loan document that referenced annexures that didn't exist. Every feature traces back to this: the Fraud Engine catches the missing-annexure pattern automatically; the Rights Engine ensures no one is blamed for not knowing their protections; the offline-first architecture ensures no one's most sensitive documents ever leave their device.

## Seven QVAC-Powered Engines
1. **Trust Score** — GST, PAN, CIN, MCA21 cross-reference for counterparty trust verdict
2. **Deadline Detection** — Auto-extracted dates → calendar alerts → no missed lock-in windows
3. **Consequences in Money** — Financial impact in ₹, not legal jargon
4. **Fraud Pattern Detection** — Missing annexures, contradictory clauses, blank signature fields
5. **Personal Document Vault** — Vector search across all signed documents via SQLite (vakeel.db)
6. **Rights Engine** — PM-Kisan, PMFBY, MUDRA, ESIC, eShram surfaced against your profile
7. **Counterparty Verification** — GST / PAN / QR code → trust verdict instantly

## Target Personas
1. **Middle Class** — Tax overpayment, hidden loan charges, insurance mis-selling
2. **Farmer** — Land title verification, fake POA detection, encumbrance checks
3. **Remote Worker** — Cross-border tax compliance, FEMA, contractor misclassification
4. **Freelancer** — Contract forgery detection, IP-transfer overreach, missing milestones

## QVAC Architecture (Five Layers)
- **L1 Ingestion** — `LLAMA_3_2_11B_VISION_INSTRUCT` for OCR of scanned docs/photos
- **L2 Classification** — `LLAMA_3_2_1B_INST_Q4_0` (TurboQuant KV-cache) for docType + userProfile
- **L3 Vault** — `NOMIC_EMBED_TEXT_V1_5_Q8_0` → SQLite cosine similarity search (vakeel.db)
- **L4 Decision Engine** — Risk · Deadline · Negotiation · Rights · Trust sub-engines
- **L5 Output** — 19 languages · `WHISPER_TINY + VAD_SILERO_5_1_2` voice pipeline · PDF/MD/JSON export

## Tech Stack
- React 18 + TypeScript
- Vite (port 5000)
- Tailwind CSS (with CSS variable color system)
- Framer Motion (animations)
- Lucide React (icons)
- React Router v6

## Project Structure
```
src/
  pages/
    Landing.tsx       — Hero + 7 features + QVAC models + comparison table
    Features.tsx      — Detailed feature deep-dive (all 7 engines)
    Vault.tsx         — Document management hub with health score + semantic search
    Analyze.tsx       — Step-by-step QVAC analysis demo (per persona)
    HowItWorks.tsx    — Five-layer QVAC architecture + model registry + hardware req
  components/
    Navbar.tsx        — VAKEEL logo + offline badge
    Footer.tsx        — QVAC model list + branding
    Logo.tsx          — SVG shield+V logo (VakeelLogo, VakeelWordmark)
    RiskBadge.tsx     — Green/amber/red risk indicator (size prop)
    QvacBadge.tsx     — QVAC SDK model + offline indicator
  App.tsx             — Router setup (5 routes)
  index.css           — Design tokens (CSS variables) + base styles
```

## Routes
- `/` — Landing page
- `/features` — All 7 engines in detail
- `/vault` — My Secure Vault (document management)
- `/analyze/:persona` — Analysis demo (tax-loan, land-title, cross-border-tax, contract-verify)
- `/how-it-works` — Five-layer QVAC architecture + model registry

## Design System
- **Primary color**: Deep legal green (`#0b3b2d`) — `hsl(160 70% 14%)`
- **Accent**: Muted gold (`#c5a880`) — `hsl(35 45% 62%)`
- **Background**: Warm cream (`hsl(40 25% 97%)`)
- **Risk colors**: Green (safe), Amber (caution), Red (danger)
- **Fonts**: Cabinet Grotesk (headings) + Plus Jakarta Sans (body) + JetBrains Mono (code)
- **Logo**: SVG shield with gold "V" on deep green

## Running
```bash
npm run dev
```

## User Preferences
- India-specific content throughout (rupee amounts, Indian banks, Indian laws like 80C, FEMA, DTAA)
- No emojis in UI
- Privacy-first positioning (local processing, no cloud upload)
- QVAC SDK shown prominently: model names, TurboQuant, Vulkan acceleration
- Pure frontend demo — no backend, no real QVAC SDK calls (simulated with animations)
