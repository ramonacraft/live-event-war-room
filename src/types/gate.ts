export type SmokeResult = 'passed' | 'failed' | 'running' | 'skipped'
export type DeployResult = 'shipped' | 'blocked' | 'pending'

export type GateRun = {
  id: string
  buildNumber: string
  branch: string
  smoke: SmokeResult
  deploy: DeployResult
  duration: string
  startedAt: string
}

export type GateSource = 'live' | 'demo' | 'unavailable'

export type GateFetchResult = {
  latest: GateRun | null
  source: GateSource
  message: string
}
