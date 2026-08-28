import type { PlanTree, WorkoutTree } from '@/modules/training/plans'
import { effectiveSetReps, effectiveSetWeight } from '@/modules/training/verification/parse-targets'
import { computeWorkoutVerification } from '@/modules/training/verification'
import type { BodyWeightLog, SetLog, WorkoutLog } from '@/payload-types'
import type {
  BodyWeightPoint,
  PersonalRecord,
  ProgressDashboardData,
  SessionSummary,
  VolumePoint,
  WeeklyFrequency,
} from './types'

const relationshipId = (
  relationship: number | { id: number } | null | undefined,
): number | null =>
  relationship && typeof relationship === 'object' ? relationship.id : (relationship ?? null)

export const findWorkoutInPlans = (plans: PlanTree[], workoutId: number): WorkoutTree | null => {
  for (const plan of plans) {
    for (const microcycle of plan.microcycles) {
      for (const workout of microcycle.workouts) {
        if (workout.id === workoutId) return workout
      }
    }
  }
  return null
}

const sessionDate = (session: WorkoutLog): Date => {
  const raw = session.finishedAt ?? session.startedAt ?? session.updatedAt
  return new Date(raw)
}

const formatDayLabel = (date: Date): string =>
  date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })

const isoWeekKey = (date: Date): string => {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = target.getUTCDay() || 7
  target.setUTCDate(target.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${target.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

const estimate1rm = (weight: number, reps: number): number => {
  if (reps <= 0 || weight <= 0) return 0
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30) * 10) / 10
}

const sumSetVolume = (sets: SetLog[]): number =>
  sets.reduce((sum, set) => {
    const reps = effectiveSetReps(set)
    const weight = effectiveSetWeight(set)
    if (reps == null) return sum
    return sum + reps * weight
  }, 0)

export function computePersonalRecords(
  sessions: WorkoutLog[],
  setsBySession: Map<number, SetLog[]>,
): PersonalRecord[] {
  const bestByExercise = new Map<string, PersonalRecord>()

  for (const session of sessions) {
    const sessionSets = setsBySession.get(session.id) ?? []
    const date = sessionDate(session).toISOString()

    for (const set of sessionSets) {
      const name = set.exerciseName?.trim() || 'Esercizio'
      const reps = effectiveSetReps(set)
      const weight = effectiveSetWeight(set)
      if (reps == null || weight <= 0) continue

      const candidate: PersonalRecord = {
        exerciseName: name,
        weightKg: weight,
        reps,
        estimated1rm: estimate1rm(weight, reps),
        date,
      }

      const existing = bestByExercise.get(name)
      if (!existing || candidate.estimated1rm > existing.estimated1rm) {
        bestByExercise.set(name, candidate)
      }
    }
  }

  return [...bestByExercise.values()]
    .sort((a, b) => b.estimated1rm - a.estimated1rm)
    .slice(0, 8)
}

export function computeWeeklyFrequency(sessions: WorkoutLog[], weeks = 8): WeeklyFrequency[] {
  const counts = new Map<string, number>()

  for (const session of sessions) {
    const key = isoWeekKey(sessionDate(session))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const sortedKeys = [...counts.keys()].sort().slice(-weeks)
  return sortedKeys.map((weekKey) => ({
    weekKey,
    weekLabel: weekKey.replace('-W', ' · S'),
    count: counts.get(weekKey) ?? 0,
  }))
}

export function buildProgressDashboard(input: {
  plans: PlanTree[]
  sessions: WorkoutLog[]
  sets: SetLog[]
  bodyWeightLogs: BodyWeightLog[]
}): ProgressDashboardData {
  const { plans, sessions, sets, bodyWeightLogs } = input

  const setsBySession = new Map<number, SetLog[]>()
  for (const set of sets) {
    const sessionId = relationshipId(set.session)
    if (sessionId == null) continue
    const bucket = setsBySession.get(sessionId) ?? []
    bucket.push(set)
    setsBySession.set(sessionId, bucket)
  }

  const sessionsWithSets = sessions.filter((session) => (setsBySession.get(session.id)?.length ?? 0) > 0)

  const sessionSummaries: SessionSummary[] = sessionsWithSets.map((session) => {
    const sessionSets = setsBySession.get(session.id) ?? []
    const workoutId = relationshipId(session.workout)
    const workoutTree = workoutId != null ? findWorkoutInPlans(plans, workoutId) : null
    const date = sessionDate(session)
    const volume = sumSetVolume(sessionSets)

    if (workoutTree) {
      const report = computeWorkoutVerification(workoutTree, sessionSets)
      return {
        id: session.id,
        title: session.title ?? workoutTree.title,
        workoutTitle: workoutTree.title,
        date: date.toISOString(),
        completionPct: report.completionPct,
        volume: report.actualVolume,
        volumePct: report.volumePct,
      }
    }

    return {
      id: session.id,
      title: session.title ?? 'Sessione',
      workoutTitle: session.title ?? '—',
      date: date.toISOString(),
      completionPct: 0,
      volume: Math.round(volume),
      volumePct: 0,
    }
  })

  sessionSummaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const avgCompletionPct =
    sessionSummaries.length > 0
      ? Math.round(
          sessionSummaries.reduce((sum, entry) => sum + entry.completionPct, 0) / sessionSummaries.length,
        )
      : 0

  const totalVolume = sessionSummaries.reduce((sum, entry) => sum + entry.volume, 0)

  const volumeTrend: VolumePoint[] = [...sessionSummaries]
    .reverse()
    .slice(-10)
    .map((entry) => ({
      date: entry.date,
      label: formatDayLabel(new Date(entry.date)),
      volume: entry.volume,
      completionPct: entry.completionPct,
    }))

  const bodyWeightTrend: BodyWeightPoint[] = bodyWeightLogs
    .filter((entry) => entry.weightKg != null && entry.recordedAt)
    .map((entry) => ({
      date: entry.recordedAt!,
      weightKg: entry.weightKg!,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-12)

  const weeklyFrequency = computeWeeklyFrequency(sessionsWithSets)

  return {
    summary: {
      totalSessions: sessionsWithSets.length,
      sessionsThisMonth: sessionsWithSets.filter((session) => sessionDate(session) >= monthStart).length,
      avgCompletionPct,
      totalVolume: Math.round(totalVolume),
      activeWeeks: weeklyFrequency.filter((week) => week.count > 0).length,
    },
    weeklyFrequency,
    volumeTrend,
    recentSessions: sessionSummaries.slice(0, 8),
    personalRecords: computePersonalRecords(sessionsWithSets, setsBySession),
    bodyWeightTrend,
    latestWeightKg: bodyWeightTrend.at(-1)?.weightKg ?? null,
  }
}
