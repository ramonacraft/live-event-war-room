import type { GateRun } from '../types/gate'

/** Shown when Release Gate Lab API is unreachable or Azure is not configured. */
export const demoGateRun: GateRun = {
  id: 'demo-1042',
  buildNumber: '#1042',
  branch: 'main',
  smoke: 'passed',
  deploy: 'shipped',
  duration: '2m 18s',
  startedAt: '2026-07-21T19:40:00Z',
}

export const RELEASE_GATE_LAB_URL = 'https://release-gate-lab.vercel.app/'
