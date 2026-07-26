import Hls from 'hls.js'
import { useEffect, useRef, useState } from 'react'
import './PlayerProbe.css'

/** Public sample HLS (Mux test streams) — safe for a public demo app. */
export const PROBE_STREAM_URL =
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'

type ProbeStatus = 'idle' | 'loading' | 'playing' | 'waiting' | 'error' | 'ended'

type ProbeMetrics = {
  status: ProbeStatus
  startupMs: number | null
  rebufferCount: number
  rebufferMs: number
  errorCount: number
  lastError: string | null
}

const initialMetrics: ProbeMetrics = {
  status: 'idle',
  startupMs: null,
  rebufferCount: 0,
  rebufferMs: 0,
  errorCount: 0,
  lastError: null,
}

function formatMs(value: number | null): string {
  if (value === null) return '—'
  if (value < 1000) return `${Math.round(value)} ms`
  return `${(value / 1000).toFixed(2)} s`
}

export function PlayerProbe() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)
  const playIntentAt = useRef<number | null>(null)
  const waitingStartedAt = useRef<number | null>(null)
  const sawFirstFrame = useRef(false)

  const [running, setRunning] = useState(false)
  const [metrics, setMetrics] = useState<ProbeMetrics>(initialMetrics)

  useEffect(() => {
    if (!running) return

    const video = videoRef.current
    if (!video) return

    setMetrics(initialMetrics)
    playIntentAt.current = performance.now()
    waitingStartedAt.current = null
    sawFirstFrame.current = false
    setMetrics((prev) => ({ ...prev, status: 'loading' }))

    const markFirstFrame = () => {
      if (sawFirstFrame.current || playIntentAt.current === null) return
      sawFirstFrame.current = true
      const startupMs = performance.now() - playIntentAt.current
      setMetrics((prev) => ({
        ...prev,
        status: 'playing',
        startupMs,
      }))
    }

    const onPlaying = () => {
      markFirstFrame()
      if (waitingStartedAt.current !== null) {
        const waited = performance.now() - waitingStartedAt.current
        waitingStartedAt.current = null
        setMetrics((prev) => ({
          ...prev,
          status: 'playing',
          rebufferMs: prev.rebufferMs + waited,
        }))
      } else {
        setMetrics((prev) => ({ ...prev, status: 'playing' }))
      }
    }

    const onWaiting = () => {
      if (!sawFirstFrame.current) return
      if (waitingStartedAt.current === null) {
        waitingStartedAt.current = performance.now()
        setMetrics((prev) => ({
          ...prev,
          status: 'waiting',
          rebufferCount: prev.rebufferCount + 1,
        }))
      }
    }

    const onError = (message: string) => {
      setMetrics((prev) => ({
        ...prev,
        status: 'error',
        errorCount: prev.errorCount + 1,
        lastError: message,
      }))
    }

    const onEnded = () => {
      setMetrics((prev) => ({ ...prev, status: 'ended' }))
    }

    video.addEventListener('playing', onPlaying)
    video.addEventListener('waiting', onWaiting)
    video.addEventListener('ended', onEnded)
    video.addEventListener('loadeddata', markFirstFrame)

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = PROBE_STREAM_URL
      void video.play().catch((err: unknown) => {
        onError(err instanceof Error ? err.message : 'Playback blocked')
      })
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true })
      hlsRef.current = hls
      hls.loadSource(PROBE_STREAM_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch((err: unknown) => {
          onError(err instanceof Error ? err.message : 'Playback blocked')
        })
      })
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          onError(data.type || 'Fatal HLS error')
        }
      })
    } else {
      onError('HLS is not supported in this browser')
    }

    return () => {
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('waiting', onWaiting)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('loadeddata', markFirstFrame)
      hlsRef.current?.destroy()
      hlsRef.current = null
      video.removeAttribute('src')
      video.load()
    }
  }, [running])

  const handleStop = () => {
    setRunning(false)
    setMetrics((prev) => ({
      ...prev,
      status: prev.status === 'idle' ? 'idle' : 'ended',
    }))
  }

  return (
    <section className="probe" aria-labelledby="probe-heading">
      <div className="panel-head panel-head--row">
        <div>
          <p className="probe__eyebrow">Live signal A</p>
          <h2 id="probe-heading">Player probe</h2>
          <p>
            Real HLS in this browser — startup, rebuffer, and errors from a public
            sample stream.
          </p>
        </div>
        <div className="probe__actions">
          {!running ? (
            <button type="button" className="probe__btn probe__btn--primary" onClick={() => setRunning(true)}>
              Start probe
            </button>
          ) : (
            <button type="button" className="probe__btn" onClick={handleStop}>
              Stop probe
            </button>
          )}
        </div>
      </div>

      <div className="probe__layout">
        <div className="probe__player-wrap">
          <video
            ref={videoRef}
            className="probe__video"
            controls
            playsInline
            muted
            aria-label="Public sample HLS probe"
          />
          <p className="probe__stream-note">
            Stream: Mux public test HLS (not your production CDN).
          </p>
        </div>

        <dl className="probe__metrics">
          <div>
            <dt>Status</dt>
            <dd className={`probe__status probe__status--${metrics.status}`}>
              {metrics.status}
            </dd>
          </div>
          <div>
            <dt>Startup</dt>
            <dd>{formatMs(metrics.startupMs)}</dd>
          </div>
          <div>
            <dt>Rebuffers</dt>
            <dd>{metrics.rebufferCount}</dd>
          </div>
          <div>
            <dt>Rebuffer time</dt>
            <dd>{formatMs(metrics.rebufferMs)}</dd>
          </div>
          <div>
            <dt>Errors</dt>
            <dd>{metrics.errorCount}</dd>
          </div>
          <div className="probe__metrics-wide">
            <dt>Last error</dt>
            <dd>{metrics.lastError ?? '—'}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
