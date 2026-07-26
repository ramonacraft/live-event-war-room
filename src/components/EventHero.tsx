import type { LiveEventSnapshot } from '../types/event'
import { formatViewers, levelLabel, phaseLabel } from '../utils/slo'
import './EventHero.css'

interface Props {
  event: LiveEventSnapshot
}

export function EventHero({ event }: Props) {
  return (
    <header className={`hero hero--${event.overall}`} aria-labelledby="event-title">
      <div className="hero__atmosphere" aria-hidden="true" />
      <div className="hero__top">
        <p className="hero__brand">Live board</p>
        <div className="hero__badges">
          <span className={`hero__phase hero__phase--${event.phase}`}>
            {phaseLabel(event.phase)}
          </span>
          <span className={`hero__health hero__health--${event.overall}`}>
            {levelLabel(event.overall)}
          </span>
        </div>
      </div>

      <div className="hero__main">
        <div className="hero__copy">
          <h1 id="event-title" className="hero__title">
            {event.name}
          </h1>
          <p className="hero__feed">{event.feed}</p>
          <p className="hero__summary">{event.summary}</p>
        </div>

        <dl className="hero__stats">
          <div>
            <dt>Concurrent</dt>
            <dd>{formatViewers(event.concurrentViewers)}</dd>
          </div>
          <div>
            <dt>Peak</dt>
            <dd>{formatViewers(event.peakViewers)}</dd>
          </div>
          <div>
            <dt>Feed</dt>
            <dd className="hero__stats-text">East</dd>
          </div>
        </dl>
      </div>
    </header>
  )
}
