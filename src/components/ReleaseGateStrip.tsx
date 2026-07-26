import { useEffect, useState } from 'react'
import { RELEASE_GATE_LAB_URL } from '../data/releaseGateDemo'
import type { GateFetchResult } from '../types/gate'
import { fetchReleaseGate, formatStartedAt } from '../utils/fetchReleaseGate'
import './ReleaseGateStrip.css'

function sourceLabel(source: GateFetchResult['source']): string {
  if (source === 'live') return 'Live Azure'
  if (source === 'demo') return 'Demo sample'
  return 'Unreachable'
}

export function ReleaseGateStrip() {
  const [result, setResult] = useState<GateFetchResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    void fetchReleaseGate().then((next) => {
      if (!active) return
      setResult(next)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const latest = result?.latest

  return (
    <section className="gate-strip" aria-labelledby="gate-strip-heading">
      <div className="panel-head panel-head--row">
        <div>
          <p className="gate-strip__eyebrow">Live signal B</p>
          <h2 id="gate-strip-heading">Release Gate</h2>
          <p>Can we ship? Pulled from Release Gate Lab.</p>
        </div>
        <span
          className={`gate-strip__source gate-strip__source--${result?.source ?? 'demo'}`}
        >
          {loading ? 'Loading…' : sourceLabel(result?.source ?? 'demo')}
        </span>
      </div>

      {loading ? (
        <p className="gate-strip__message">Checking Release Gate Lab…</p>
      ) : (
        <>
          <p className="gate-strip__message">{result?.message}</p>
          {latest ? (
            <dl className="gate-strip__stats">
              <div>
                <dt>Build</dt>
                <dd>{latest.buildNumber}</dd>
              </div>
              <div>
                <dt>Branch</dt>
                <dd>{latest.branch}</dd>
              </div>
              <div>
                <dt>Playwright</dt>
                <dd className={`gate-strip__smoke gate-strip__smoke--${latest.smoke}`}>
                  {latest.smoke}
                </dd>
              </div>
              <div>
                <dt>Deploy</dt>
                <dd className={`gate-strip__deploy gate-strip__deploy--${latest.deploy}`}>
                  {latest.deploy}
                </dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{latest.duration}</dd>
              </div>
              <div>
                <dt>Started</dt>
                <dd>{formatStartedAt(latest.startedAt)}</dd>
              </div>
            </dl>
          ) : null}
          <a
            className="gate-strip__link"
            href={RELEASE_GATE_LAB_URL}
            target="_blank"
            rel="noreferrer"
          >
            Open Release Gate Lab dashboard
          </a>
        </>
      )}
    </section>
  )
}
