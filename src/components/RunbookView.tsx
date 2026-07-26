import { useMemo, useState } from 'react'
import type {
  PhaseId,
  RunbookTabId,
  RunbookTask,
  WarRoomRunbook,
} from '../types/runbook'
import './RunbookView.css'

interface Props {
  runbook: WarRoomRunbook
  tasks: RunbookTask[]
  onToggleTask: (id: string) => void
  onOpenWarRoom: () => void
}

const tabs: { id: RunbookTabId; label: string }[] = [
  { id: 'tasks', label: 'Run Book' },
  { id: 'coverage', label: 'Coverage Plan' },
  { id: 'links', label: 'Important Links' },
  { id: 'contacts', label: 'Contact Info' },
]

function statusLabel(status: string): string {
  if (status === 'done') return 'Done'
  if (status === 'cancelled') return 'Cancelled'
  return 'Open'
}

export function RunbookView({
  runbook,
  tasks,
  onToggleTask,
  onOpenWarRoom,
}: Props) {
  const [tab, setTab] = useState<RunbookTabId>('tasks')

  const tasksByPhase = useMemo(() => {
    const map = new Map<PhaseId, RunbookTask[]>()
    for (const phase of runbook.phases) {
      map.set(
        phase.id,
        tasks.filter((task) => task.phaseId === phase.id),
      )
    }
    return map
  }, [runbook.phases, tasks])

  const openCount = tasks.filter((task) => task.status === 'open').length
  const doneCount = tasks.filter((task) => task.status === 'done').length

  return (
    <div className="runbook">
      <header className="runbook__hero">
        <p className="runbook__eyebrow">Living runbook</p>
        <h1>{runbook.title}</h1>
        <p className="runbook__event">{runbook.eventName}</p>
        <p className="runbook__note">{runbook.livingNote}</p>
        <div className="runbook__meta">
          <p className="runbook__safe">
            Template only — placeholder dates, roles, and example.com links. No
            real people, employers, or production calendars.
          </p>
          <p className="runbook__counts">
            {doneCount} done · {openCount} open · {tasks.length} total
          </p>
        </div>
      </header>

      <div className="runbook__tabs" role="tablist" aria-label="Runbook sections">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`runbook__tab${tab === item.id ? ' is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'tasks' ? (
        <div className="runbook__panel">
          <section className="runbook__section" aria-labelledby="phases-heading">
            <div className="panel-head">
              <h2 id="phases-heading">Important tasks and milestones</h2>
              <p>
                Same shape as a launch spreadsheet — check boxes as the window
                moves.
              </p>
            </div>

            <ol className="runbook__phase-nav">
              {runbook.phases.map((phase) => (
                <li key={phase.id}>
                  <a href={`#phase-${phase.id}`}>{phase.label}</a>
                  <span>{phase.when}</span>
                </li>
              ))}
            </ol>
          </section>

          {runbook.phases.map((phase) => {
            const phaseTasks = tasksByPhase.get(phase.id) ?? []
            return (
              <section
                key={phase.id}
                id={`phase-${phase.id}`}
                className="runbook__section"
                aria-labelledby={`heading-${phase.id}`}
              >
                <div className="panel-head">
                  <h2 id={`heading-${phase.id}`}>{phase.label}</h2>
                  <p>
                    {phase.when} — {phase.blurb}
                  </p>
                </div>

                {phaseTasks.length === 0 ? (
                  <p className="runbook__empty">No tasks in this phase yet.</p>
                ) : (
                  <div className="runbook__table-wrap">
                    <table className="runbook__table">
                      <thead>
                        <tr>
                          <th scope="col">Complete</th>
                          <th scope="col">Date</th>
                          <th scope="col">Time</th>
                          <th scope="col">Event</th>
                          <th scope="col">Owner role</th>
                          <th scope="col">Team</th>
                          <th scope="col">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {phaseTasks.map((task) => (
                          <tr
                            key={task.id}
                            className={`runbook__task-row runbook__task-row--${task.status}`}
                          >
                            <td>
                              <label className="runbook__check">
                                <input
                                  type="checkbox"
                                  checked={task.status === 'done'}
                                  disabled={task.status === 'cancelled'}
                                  onChange={() => onToggleTask(task.id)}
                                  aria-label={`Mark complete: ${task.event}`}
                                />
                                <span className="runbook__check-label">
                                  {statusLabel(task.status)}
                                </span>
                              </label>
                            </td>
                            <td>{task.date}</td>
                            <td>{task.time}</td>
                            <th scope="row">{task.event}</th>
                            <td>{task.ownerRole}</td>
                            <td>{task.team}</td>
                            <td>{task.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )
          })}

          <section className="runbook__section" aria-labelledby="deploys-heading">
            <div className="panel-head">
              <h2 id="deploys-heading">Scheduled production deploys</h2>
              <p>Including API deploys for native around launch day.</p>
            </div>
            <ul className="runbook__deploys">
              {runbook.scheduledDeploys.map((deploy) => (
                <li key={deploy.id}>
                  <div className="runbook__row-top">
                    <h3>{deploy.track}</h3>
                    <span className={`runbook__status runbook__status--${deploy.status}`}>
                      {statusLabel(deploy.status)}
                    </span>
                  </div>
                  <p className="runbook__when">{deploy.window}</p>
                  <p className="runbook__owner">
                    {deploy.ownerRole} · {deploy.team}
                  </p>
                  <p>{deploy.notes}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="runbook__section" aria-labelledby="escalation-heading">
            <div className="panel-head">
              <h2 id="escalation-heading">Escalation</h2>
              <p>Ties this runbook to Watch → Incident on the live board.</p>
            </div>
            <ol className="runbook__escalation">
              {runbook.escalation.map((step) => (
                <li key={step.id}>
                  <h3>{step.level}</h3>
                  <p>
                    <strong>Trigger:</strong> {step.trigger}
                  </p>
                  <p>
                    <strong>Action:</strong> {step.action}
                  </p>
                  <p className="runbook__owner">Owner role: {step.ownerRole}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      ) : null}

      {tab === 'coverage' ? (
        <div className="runbook__panel">
          {runbook.coverageBlocks.map((block) => (
            <section
              key={block.id}
              className="runbook__section"
              aria-labelledby={`coverage-${block.id}`}
            >
              <div className="panel-head">
                <h2 id={`coverage-${block.id}`}>{block.title}</h2>
                <p>{block.blurb}</p>
              </div>
              <div className="runbook__table-wrap">
                <table className="runbook__table runbook__table--coverage">
                  <thead>
                    <tr>
                      <th scope="col">Day</th>
                      <th scope="col">AM</th>
                      <th scope="col">PM</th>
                      <th scope="col">Pager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.shifts.map((row) => (
                      <tr key={row.id}>
                        <th scope="row">{row.day}</th>
                        <td>{row.am}</td>
                        <td>{row.pm}</td>
                        <td>{row.pager}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}

          <p className="runbook__footnote">
            ** May extend pending launch progress
          </p>

          <section className="runbook__section" aria-labelledby="groups-heading">
            <div className="panel-head">
              <h2 id="groups-heading">Coverage groups</h2>
              <p>Role titles only — put real names in a private roster, not GitHub.</p>
            </div>
            <ul className="runbook__groups">
              {runbook.coverageGroups.map((group) => (
                <li key={group.id}>
                  <h3>{group.name}</h3>
                  <p className="runbook__when">{group.focus}</p>
                  <ul>
                    {group.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {tab === 'links' ? (
        <div className="runbook__panel">
          <section className="runbook__section" aria-labelledby="links-heading">
            <div className="panel-head">
              <h2 id="links-heading">Important links</h2>
              <p>
                Placeholder destinations shown as text only (not clickable) —
                swap for your real tools later.
              </p>
            </div>
            <div className="runbook__table-wrap">
              <table className="runbook__table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Link</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {runbook.importantLinks.map((link) => (
                    <tr key={link.id}>
                      <th scope="row">{link.item}</th>
                      <td>
                        {link.href === '#war-room' ? (
                          <button
                            type="button"
                            className="runbook__link-btn"
                            onClick={onOpenWarRoom}
                          >
                            Open Live board
                          </button>
                        ) : (
                          <span className="runbook__url-plain" title="Placeholder — not linked">
                            {link.href}
                          </span>
                        )}
                      </td>
                      <td>{link.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}

      {tab === 'contacts' ? (
        <div className="runbook__panel">
          <section className="runbook__section" aria-labelledby="contacts-heading">
            <div className="panel-head">
              <h2 id="contacts-heading">Contact info</h2>
              <p>
                Roles and example channels only. Keep real names and phones in a
                private sheet you do not publish.
              </p>
            </div>
            <div className="runbook__table-wrap">
              <table className="runbook__table">
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">Team</th>
                    <th scope="col">Channel</th>
                    <th scope="col">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {runbook.contacts.map((contact) => (
                    <tr key={contact.id}>
                      <th scope="row">{contact.role}</th>
                      <td>{contact.team}</td>
                      <td>{contact.channel}</td>
                      <td>{contact.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
