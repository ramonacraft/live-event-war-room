import { demoGateRun } from '../data/releaseGateDemo'
import type { GateFetchResult } from '../types/gate'
import { mapAzureBuildsToRuns, type AzureBuildsResponse } from './mapAzureBuilds'

/**
 * In local dev, Vite proxies /release-gate-api → Release Gate Lab /api/runs.
 * In production, call the public API URL (needs CORS on that API when Azure is live).
 */
function releaseGateApiUrl(): string {
  const fromEnv = import.meta.env.VITE_RELEASE_GATE_API_URL as string | undefined
  if (fromEnv) return fromEnv
  if (import.meta.env.DEV) return '/release-gate-api'
  return 'https://release-gate-lab.vercel.app/api/runs'
}

function formatStartedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export { formatStartedAt }

export async function fetchReleaseGate(): Promise<GateFetchResult> {
  try {
    const response = await fetch(releaseGateApiUrl())
    const payload = (await response.json()) as AzureBuildsResponse

    if (!response.ok) {
      const reason =
        payload.error === 'Azure DevOps is not configured'
          ? 'Release Gate Lab is up, but Azure secrets are not configured yet.'
          : `Release Gate API returned ${response.status}.`
      return {
        latest: demoGateRun,
        source: 'demo',
        message: `${reason} Showing demo gate sample — open the live dashboard for the full board.`,
      }
    }

    const runs = mapAzureBuildsToRuns(payload)
    if (runs.length === 0) {
      return {
        latest: demoGateRun,
        source: 'demo',
        message: 'No Azure builds returned yet. Showing demo gate sample.',
      }
    }

    return {
      latest: runs[0],
      source: 'live',
      message: 'Live from Release Gate Lab → Azure Pipelines.',
    }
  } catch {
    return {
      latest: demoGateRun,
      source: 'unavailable',
      message:
        'Could not reach Release Gate Lab from here. Showing demo sample — open the dashboard link.',
    }
  }
}
