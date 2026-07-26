export type EventPhase = 'preflight' | 'live' | 'incident' | 'wrap'

export type HealthLevel = 'healthy' | 'watch' | 'critical'

export type DevicePlatform = 'web' | 'ios' | 'android' | 'ctv'

export type ScenarioId = 'healthy' | 'degrading' | 'incident'

export interface SloMetric {
  id: string
  label: string
  /** Short unit label shown next to the value */
  unit: string
  value: number
  /** Threshold that starts "watch" */
  watchAt: number
  /** Threshold that starts "critical" */
  criticalAt: number
  /** lower = better (startup, buffer, errors) vs higher = better (bitrate health) */
  direction: 'lower-better' | 'higher-better'
  description: string
}

export interface DeviceHealthRow {
  platform: DevicePlatform
  label: string
  concurrentViewers: number
  startupMs: number
  bufferRatio: number
  errorRate: number
  level: HealthLevel
}

export interface ChecklistItem {
  id: string
  label: string
  owner: string
  checked: boolean
  critical: boolean
}

export interface IncidentSignal {
  id: string
  time: string
  level: HealthLevel
  message: string
  platform?: DevicePlatform
}

export interface LiveEventSnapshot {
  id: string
  name: string
  feed: string
  phase: EventPhase
  scenarioId: ScenarioId
  startedAt: string
  concurrentViewers: number
  peakViewers: number
  overall: HealthLevel
  summary: string
  slos: SloMetric[]
  devices: DeviceHealthRow[]
  checklist: ChecklistItem[]
  signals: IncidentSignal[]
}
