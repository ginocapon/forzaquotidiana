export type SessionSummary = {
  id: number
  title: string
  workoutTitle: string
  date: string
  completionPct: number
  volume: number
  volumePct: number
}

export type WeeklyFrequency = {
  weekKey: string
  weekLabel: string
  count: number
}

export type VolumePoint = {
  date: string
  label: string
  volume: number
  completionPct: number
}

export type PersonalRecord = {
  exerciseName: string
  weightKg: number
  reps: number
  estimated1rm: number
  date: string
}

export type BodyWeightPoint = {
  date: string
  weightKg: number
}

export type ProgressSummary = {
  totalSessions: number
  sessionsThisMonth: number
  avgCompletionPct: number
  totalVolume: number
  activeWeeks: number
}

export type ProgressDashboardData = {
  summary: ProgressSummary
  weeklyFrequency: WeeklyFrequency[]
  volumeTrend: VolumePoint[]
  recentSessions: SessionSummary[]
  personalRecords: PersonalRecord[]
  bodyWeightTrend: BodyWeightPoint[]
  latestWeightKg: number | null
}

export type ProgressDashboardOutput =
  | {
      user: { id: number | string; name?: string | null; email?: string | null }
      data: ProgressDashboardData
    }
  | { user: null }
