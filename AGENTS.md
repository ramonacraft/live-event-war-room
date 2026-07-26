# Live Event War Room — agent notes

## Project

Live-event operations board + living runbook.

- **Scenario panels** = Healthy / Degrading / Incident (labeled demo data)
- **Player probe** = real public HLS metrics in-browser
- **Release Gate strip** = fetch from Release Gate Lab `/api/runs`
- **Runbook** = public-safe launch template (4 tabs)

## Stack

- Vite + React 19 + TypeScript + `hls.js`
- Scenarios in `src/data/scenarios.ts`
- Runbook in `src/data/runbook.ts`
- Local proxy: `/release-gate-api` → `https://release-gate-lab.vercel.app/api/runs`

## Conventions

- No employer streams, DRM catalogs, or customer data
- Player probe stays on a public sample HLS only
- Runbook: placeholder dates, role titles only, example.com URLs as plain text (not clickable), except the in-app Live board control
- Label live vs scenario clearly in the UI
- Status colors always paired with text labels
- Do not commit `.env` or tokens
- Keep README professional and product-focused

## Related

Release Gate Lab → this war room (gate + live window view)
