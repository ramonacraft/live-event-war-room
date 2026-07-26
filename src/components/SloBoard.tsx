import type { SloMetric } from '../types/event'
import { formatMetricValue, levelLabel, metricLevel } from '../utils/slo'
import './SloBoard.css'

interface Props {
  slos: SloMetric[]
}

function thresholdCopy(metric: SloMetric): string {
  const unit = metric.unit === 'score' ? '' : metric.unit
  if (metric.direction === 'higher-better') {
    return `Watch ≤ ${metric.watchAt}${unit} · Critical ≤ ${metric.criticalAt}${unit}`
  }
  return `Watch ≥ ${metric.watchAt}${unit} · Critical ≥ ${metric.criticalAt}${unit}`
}

export function SloBoard({ slos }: Props) {
  return (
    <section className="slo" aria-labelledby="slo-heading">
      <div className="panel-head">
        <h2 id="slo-heading">Playback SLOs (scenario)</h2>
        <p>
          Scenario budgets for the ops walkthrough. Real measurements are in
          Player probe above.
        </p>
      </div>

      <ul className="slo__grid">
        {slos.map((metric) => {
          const level = metricLevel(metric)
          return (
            <li key={metric.id} className={`slo__item slo__item--${level}`}>
              <div className="slo__item-top">
                <h3>{metric.label}</h3>
                <span className={`slo__level slo__level--${level}`}>
                  {levelLabel(level)}
                </span>
              </div>
              <p className="slo__value">
                <span>{formatMetricValue(metric)}</span>
                <small>{metric.unit}</small>
              </p>
              <p className="slo__desc">{metric.description}</p>
              <p className="slo__thresholds">
                {thresholdCopy(metric)}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
