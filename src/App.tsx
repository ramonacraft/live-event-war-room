import { useState } from 'react'
import { DeviceHealth } from './components/DeviceHealth'
import { EventHero } from './components/EventHero'
import { IncidentFeed } from './components/IncidentFeed'
import { OpsChecklist } from './components/OpsChecklist'
import { PlayerProbe } from './components/PlayerProbe'
import { ReleaseGateStrip } from './components/ReleaseGateStrip'
import { RunbookView } from './components/RunbookView'
import { ScenarioSwitcher } from './components/ScenarioSwitcher'
import { SloBoard } from './components/SloBoard'
import { TopNav, type AppView } from './components/TopNav'
import { warRoomRunbook } from './data/runbook'
import { scenarios } from './data/scenarios'
import type { ChecklistItem, ScenarioId } from './types/event'
import type { RunbookTask } from './types/runbook'
import './App.css'

function App() {
  const [view, setView] = useState<AppView>('war-room')
  const [scenarioId, setScenarioId] = useState<ScenarioId>('healthy')
  const [checklistOverrides, setChecklistOverrides] = useState<
    Partial<Record<ScenarioId, ChecklistItem[]>>
  >({})
  const [tasks, setTasks] = useState<RunbookTask[]>(warRoomRunbook.tasks)

  const snapshot = scenarios[scenarioId]
  const checklist = checklistOverrides[scenarioId] ?? snapshot.checklist

  const handleChecklistToggle = (id: string) => {
    setChecklistOverrides((prev) => {
      const current = prev[scenarioId] ?? snapshot.checklist
      return {
        ...prev,
        [scenarioId]: current.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item,
        ),
      }
    })
  }

  const handleTaskToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id || task.status === 'cancelled') return task
        return {
          ...task,
          status: task.status === 'done' ? 'open' : 'done',
        }
      }),
    )
  }

  return (
    <div className="shell">
      <TopNav view={view} onChange={setView} />

      <div className="shell__inner">
        {view === 'runbook' ? (
          <RunbookView
            runbook={warRoomRunbook}
            tasks={tasks}
            onToggleTask={handleTaskToggle}
            onOpenWarRoom={() => setView('war-room')}
          />
        ) : (
          <>
            <EventHero event={{ ...snapshot, checklist }} />

            <ReleaseGateStrip />

            <PlayerProbe />

            <ScenarioSwitcher active={scenarioId} onChange={setScenarioId} />

            <SloBoard slos={snapshot.slos} />

            <div className="shell__split">
              <DeviceHealth devices={snapshot.devices} />
              <OpsChecklist items={checklist} onToggle={handleChecklistToggle} />
            </div>

            <IncidentFeed signals={snapshot.signals} />
          </>
        )}

        <footer className="shell__footer">
          <p>
            Live signals: Player probe (real HLS) + Release Gate Lab fetch.
            Scenario panels are labeled demo data for Healthy / Degrading /
            Incident walkthroughs.
          </p>
          <p>
            Portfolio companions: ForgeQA / TestMCP → Release Gate Lab → CTV Lab →
            this board.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
