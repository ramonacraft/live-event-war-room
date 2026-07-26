export type RunbookTabId = 'tasks' | 'coverage' | 'links' | 'contacts'

export type PhaseId =
  | 'pre-launch'
  | 'two-weeks-out'
  | 'production-ready'
  | 'production-deploy'
  | 'launch-day'
  | 'wrap'

export type TaskStatus = 'open' | 'done' | 'cancelled'

export interface RunbookPhase {
  id: PhaseId
  label: string
  /** Placeholder timing, e.g. "Month Day" or "Date Frame" */
  when: string
  blurb: string
}

export interface RunbookTask {
  id: string
  phaseId: PhaseId
  /** Placeholder date label */
  date: string
  /** Placeholder time label */
  time: string
  event: string
  ownerRole: string
  team: string
  notes: string
  status: TaskStatus
}

export interface DeploySlot {
  id: string
  track: string
  window: string
  ownerRole: string
  team: string
  notes: string
  status: TaskStatus
}

export interface CoverageShift {
  id: string
  day: string
  am: string
  pm: string
  pager: string
}

export interface CoverageBlock {
  id: string
  title: string
  blurb: string
  shifts: CoverageShift[]
}

export interface CoverageGroup {
  id: string
  name: string
  focus: string
  roles: string[]
}

export interface ImportantLink {
  id: string
  item: string
  href: string
  note: string
}

export interface ContactRow {
  id: string
  role: string
  team: string
  /** Placeholder only — never real people or employer emails */
  channel: string
  notes: string
}

export interface EscalationStep {
  id: string
  level: string
  trigger: string
  action: string
  ownerRole: string
}

export interface WarRoomRunbook {
  id: string
  title: string
  eventName: string
  livingNote: string
  phases: RunbookPhase[]
  tasks: RunbookTask[]
  scheduledDeploys: DeploySlot[]
  coverageBlocks: CoverageBlock[]
  coverageGroups: CoverageGroup[]
  importantLinks: ImportantLink[]
  contacts: ContactRow[]
  escalation: EscalationStep[]
}
