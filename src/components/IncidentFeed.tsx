import type { IncidentSignal } from '../types/event'
import { levelLabel } from '../utils/slo'
import './IncidentFeed.css'

interface Props {
  signals: IncidentSignal[]
}

export function IncidentFeed({ signals }: Props) {
  return (
    <section className="feed" aria-labelledby="feed-heading">
      <div className="panel-head">
        <h2 id="feed-heading">Signal feed</h2>
        <p>What the room is talking about right now.</p>
      </div>

      <ol className="feed__list">
        {signals.map((signal) => (
          <li key={signal.id} className={`feed__item feed__item--${signal.level}`}>
            <div className="feed__meta">
              <time dateTime={signal.time}>{signal.time}</time>
              <span className={`feed__level feed__level--${signal.level}`}>
                {levelLabel(signal.level)}
              </span>
              {signal.platform ? (
                <span className="feed__platform">{signal.platform.toUpperCase()}</span>
              ) : null}
            </div>
            <p>{signal.message}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
