import type { ChecklistItem } from '../types/event'
import { goLiveReady } from '../utils/slo'
import './OpsChecklist.css'

interface Props {
  items: ChecklistItem[]
  onToggle: (id: string) => void
}

export function OpsChecklist({ items, onToggle }: Props) {
  const ready = goLiveReady(items)
  const criticalLeft = items.filter((item) => item.critical && !item.checked).length

  return (
    <section className="ops" aria-labelledby="ops-heading">
      <div className="panel-head panel-head--row">
        <div>
          <h2 id="ops-heading">Ops checklist</h2>
          <p>Human gates next to the automation signals.</p>
        </div>
        <p className={`ops__ready ${ready ? 'is-ready' : 'is-blocked'}`}>
          {ready ? 'Critical path clear' : `${criticalLeft} critical open`}
        </p>
      </div>

      <ul className="ops__list">
        {items.map((item) => (
          <li key={item.id}>
            <label className={`ops__item${item.checked ? ' is-checked' : ''}`}>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggle(item.id)}
              />
              <span className="ops__copy">
                <span className="ops__label">
                  {item.label}
                  {item.critical ? (
                    <span className="ops__critical">Critical</span>
                  ) : null}
                </span>
                <span className="ops__owner">{item.owner}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  )
}
