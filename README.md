# 👩‍💻 Live Event War Room

A **live-event operations board** plus a **living runbook** for pre-prod and production windows.

This project shows how I think about release and playback readiness in media and streaming. The Live board mixes **real monitoring signals** with **scenario data** so you can walk Healthy → Degrading → Incident without touching a production CDN. The Runbook covers milestones, deploys, coverage, and escalation from weeks out through launch and wrap.

## How the flow works

```mermaid
%%{init: {
  "theme": "base",
  "flowchart": { "curve": "basis", "padding": 20, "nodeSpacing": 50, "rankSpacing": 70 },
  "themeVariables": {
    "fontSize": "20px",
    "fontFamily": "ui-sans-serif, system-ui, sans-serif",
    "primaryColor": "#E0F2FE",
    "primaryTextColor": "#0F172A",
    "primaryBorderColor": "#0284C7",
    "secondaryColor": "#CCFBF1",
    "secondaryTextColor": "#0F172A",
    "secondaryBorderColor": "#0D9488",
    "tertiaryColor": "#FEF3C7",
    "tertiaryTextColor": "#0F172A",
    "tertiaryBorderColor": "#D97706",
    "lineColor": "#64748B",
    "textColor": "#0F172A",
    "mainBkg": "#F8FAFC",
    "clusterBkg": "#F8FAFC",
    "clusterBorder": "#CBD5E1",
    "titleColor": "#0F172A"
  }
}}%%
flowchart LR
  subgraph REAL["1 · Real signals"]
    direction TB
    Gate["Release Gate<br/>Can we ship?"]
    Probe["Player probe<br/>Is playback healthy?"]
  end

  subgraph BOARD["2 · Live board"]
    direction TB
    View["Event health<br/>SLOs · devices · checklist"]
    Scene["Scenarios<br/>Healthy → Degrading → Incident"]
  end

  subgraph BOOK["3 · Living runbook"]
    direction TB
    Plan["Milestones · deploys<br/>Coverage · escalation"]
  end

  Gate --> View
  Probe --> View
  View --> Scene
  BOARD -. parallel .-> BOOK

  classDef signal fill:#E0F2FE,stroke:#0284C7,stroke-width:2px,color:#0F172A
  classDef board fill:#CCFBF1,stroke:#0D9488,stroke-width:2px,color:#0F172A
  classDef runbook fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#0F172A

  class Gate,Probe signal
  class View,Scene board
  class Plan runbook
```

**In plain English**

1. **Real signals** — release gate + player probe  
2. **Live board** — health view + scenario walkthrough  
3. **Living runbook** — plan, coverage, and escalation running in parallel for pre-prod and production

## What problem this solves

Shipping code is only half the job on a live window. You also need a shared view of:

- Can we ship? (release gate)
- Is playback healthy right now? (probe + SLO view)
- What is the plan, who is on coverage, and how do we escalate? (runbook)

This lab puts those pieces on one surface.

## What’s on the Live board

**Real signals**
- **Release Gate** — pulls latest status from [Release Gate Lab](https://release-gate-lab.vercel.app/) (Azure Pipelines when configured)
- **Player probe** — plays a public sample HLS stream in the browser and measures startup, rebuffers, and errors (`hls.js`)

**Scenario view**
- Event hero, playback SLOs, device breakdown, ops checklist, and signal feed
- Switch scenarios: Healthy → Degrading → Incident
- Clearly labeled so it is not confused with live telemetry

## What’s in the Runbook

Four tabs, same shape as a real launch spreadsheet:

| Tab | Contents |
|-----|----------|
| **Run Book** | Important tasks and milestones (Pre-Launch through Wrap), scheduled production deploys, escalation |
| **Coverage Plan** | Shift grid and coverage groups by role |
| **Important Links** | Tool placeholders (shown as text, not live links) |
| **Contact Info** | Role-based contacts with example channels only |

Dates use placeholders like `Month Day` and `Date Frame`. Owners are **roles**, not personal names, so the template stays safe to share publicly.

## Quick start

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/ramonacraft/live-event-war-room.git
cd live-event-war-room
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

You should see **Live board** and **Runbook** in the top nav. On the board, check Release Gate, click **Start probe**, then try the scenario switcher. Open **Runbook** for the living plan.

## How to walk the product

1. **Release Gate** — latest gate outcome from Release Gate Lab
2. **Start probe** — real startup and rebuffer metrics from a public HLS sample
3. **Scenario switcher** — Healthy → Degrading → Incident for multi-device ops judgment
4. **Runbook** — milestones, deploy slots, coverage, and escalation beside the board

## Stack

- Vite + React 19 + TypeScript + `hls.js`
- Scenario data in `src/data/scenarios.ts`
- Runbook template in `src/data/runbook.ts`
- Local Release Gate proxy: `/release-gate-api` → Release Gate Lab `/api/runs`

## Project layout

```text
src/
  components/     Board panels, player probe, release gate strip, runbook
  data/           Scenarios, runbook template, gate fallback
  types/          Shared types
  utils/          SLO helpers, Release Gate fetch and mapping
```

## Related work

- [Release Gate Lab](https://github.com/ramonacraft/release-gate-lab) — lean Playwright quality gate and go/no-go dashboard
- This war room — playback and ops view for the live window, with a runbook alongside

## Status

| Area | Status |
|------|--------|
| Live board + scenarios + runbook | Ready |
| Player probe (public HLS) | Ready |
| Release Gate → Azure (via Release Gate Lab) | Ready when Lab env vars are set |
| Public deploy of this app (Vercel) | Optional next step |

## Notes

- Player probe uses a **public** Mux test stream, not a production catalog or CDN.
- Runbook contacts and links are placeholders on purpose.
- See [AGENTS.md](./AGENTS.md) for contributor conventions in Cursor.
