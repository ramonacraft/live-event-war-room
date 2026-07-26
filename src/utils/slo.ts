import type { ChecklistItem, HealthLevel, SloMetric } from '../types/event'

export function metricLevel(metric: SloMetric): HealthLevel {
  if (metric.direction === 'lower-better') {
    if (metric.value >= metric.criticalAt) return 'critical'
    if (metric.value >= metric.watchAt) return 'watch'
    return 'healthy'
  }

  if (metric.value <= metric.criticalAt) return 'critical'
  if (metric.value <= metric.watchAt) return 'watch'
  return 'healthy'
}

export function worstLevel(levels: HealthLevel[]): HealthLevel {
  if (levels.includes('critical')) return 'critical'
  if (levels.includes('watch')) return 'watch'
  return 'healthy'
}

export function formatMetricValue(metric: SloMetric): string {
  if (metric.unit === 'ms') return `${Math.round(metric.value)}`
  if (metric.unit === '%') return metric.value.toFixed(2)
  if (metric.unit === 'score') return metric.value.toFixed(0)
  return String(metric.value)
}

export function levelLabel(level: HealthLevel): string {
  if (level === 'healthy') return 'Healthy'
  if (level === 'watch') return 'Watch'
  return 'Critical'
}

export function phaseLabel(phase: string): string {
  if (phase === 'preflight') return 'Preflight'
  if (phase === 'live') return 'Live'
  if (phase === 'incident') return 'Incident'
  if (phase === 'wrap') return 'Wrap'
  return phase
}

export function goLiveReady(checklist: ChecklistItem[]): boolean {
  return checklist.filter((item) => item.critical).every((item) => item.checked)
}

export function formatViewers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
