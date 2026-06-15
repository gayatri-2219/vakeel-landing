# VaultAI — Local Legal Intelligence Platform

## Overview
VaultAI is a local-first legal risk engine for India. Users upload financial and legal documents; an on-device AI scans for hidden risks and delivers a plain-language verdict in 30 seconds. No documents leave the user's device.

## Target Personas
1. **Middle Class** — Tax overpayment, hidden loan charges, insurance mis-selling
2. **Farmer** — Land title verification, fake POA detection, encumbrance checks
3. **Remote Worker** — Cross-border tax compliance, FEMA, contractor misclassification
4. **Freelancer** — Contract forgery detection, IP-transfer overreach, missing milestones

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
    Landing.tsx       — Hero + persona cards + product positioning
    Vault.tsx         — Document management hub
    Analyze.tsx       — Step-by-step analysis demo (per persona)
    HowItWorks.tsx    — Architecture explainer + trust building
  components/
    Navbar.tsx
    Footer.tsx
    RiskBadge.tsx     — Green/amber/red risk indicator
  App.tsx             — Router setup
  index.css           — Design tokens (CSS variables) + base styles
```

## Routes
- `/` — Landing page
- `/vault` — My Secure Vault (document management)
- `/analyze/:persona` — Analysis demo (tax-loan, land-title, cross-border-tax, contract-verify)
- `/how-it-works` — Architecture and privacy explainer

## Design System
- **Primary color**: Deep legal green (`#0b3b2d`)
- **Accent**: Muted gold (`#c5a880`)
- **Risk colors**: Green (safe), Amber (caution), Red (danger)
- **Fonts**: Cabinet Grotesk (headings) + Plus Jakarta Sans (body)

## Running
```bash
npm run dev
```

## User Preferences
- India-specific content throughout (rupee amounts, Indian banks, Indian laws like 80C, FEMA, DTAA)
- No emojis in UI
- Privacy-first positioning (local processing, no cloud upload)
