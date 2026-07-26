import type { ScenarioId } from '../types/event'
import { scenarioMeta, scenarioOrder } from '../data/scenarios'
import './ScenarioSwitcher.css'

interface Props {
  active: ScenarioId
  onChange: (id: ScenarioId) => void
}

export function ScenarioSwitcher({ active, onChange }: Props) {
  return (
    <div className="scenario" role="group" aria-label="Demo scenario">
      <p className="scenario__label">Scenario (demo) — not live telemetry</p>
      <div className="scenario__buttons">
        {scenarioOrder.map((id) => {
          const meta = scenarioMeta[id]
          const isActive = id === active
          return (
            <button
              key={id}
              type="button"
              className={`scenario__btn scenario__btn--${id}${isActive ? ' is-active' : ''}`}
              aria-pressed={isActive}
              onClick={() => onChange(id)}
            >
              <span className="scenario__btn-title">{meta.label}</span>
              <span className="scenario__btn-blurb">{meta.blurb}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
