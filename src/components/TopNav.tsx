import './TopNav.css'

export type AppView = 'war-room' | 'runbook'

interface Props {
  view: AppView
  onChange: (view: AppView) => void
}

export function TopNav({ view, onChange }: Props) {
  return (
    <nav className="topnav" aria-label="War room navigation">
      <div className="topnav__center">
        <p className="topnav__logo">
          <span aria-hidden="true">👩‍💻</span>
          <span>Live Event War Room</span>
        </p>
        <p className="topnav__sub">Board + living runbook</p>
        <div className="topnav__tabs" role="tablist" aria-label="Primary views">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'war-room'}
            className={`topnav__tab${view === 'war-room' ? ' is-active' : ''}`}
            onClick={() => onChange('war-room')}
          >
            Live board
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'runbook'}
            className={`topnav__tab${view === 'runbook' ? ' is-active' : ''}`}
            onClick={() => onChange('runbook')}
          >
            Runbook
          </button>
        </div>
      </div>
    </nav>
  )
}
