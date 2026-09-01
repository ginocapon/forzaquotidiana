import { getExerciseName, type WorkoutTree } from '@/modules/training/plans'
import type { SetLog } from '@/payload-types'
import {
  effectiveSetReps,
  effectiveSetWeight,
  parseNumericRange,
  parseRepsCount,
  parseTargetWeight,
} from './parse-targets'
import type { ExerciseVerification, Trend, WorkoutVerification } from './types'

const relationshipId = (
  relationship: number | { id: number } | null | undefined,
): number | null =>
  relationship && typeof relationship === 'object' ? relationship.id : (relationship ?? null)

const trendFromDelta = (delta: number, threshold = 0.5): Trend => {
  if (!Number.isFinite(delta)) return 'unknown'
  if (delta > threshold) return 'up'
  if (delta < -threshold) return 'down'
  return 'same'
}

const buildExerciseSuggestions = (input: {
  plannedSets: number
  actualSets: number
  plannedReps: number | null
  avgReps: number | null
  plannedWeight: number | null
  avgWeight: number | null
  plannedRir: string | null | undefined
  avgRir: number | null
  volumePct: number | null
}): string[] => {
  const tips: string[] = []

  if (input.plannedSets > 0 && input.actualSets < input.plannedSets) {
    tips.push('incomplete_sets')
  }

  if (input.volumePct != null && input.volumePct < 85) {
    tips.push('low_volume')
  }

  if (
    input.plannedReps != null &&
    input.avgReps != null &&
    input.avgReps >= input.plannedReps &&
    input.plannedWeight != null &&
    input.avgWeight != null &&
    input.avgWeight <= input.plannedWeight + 0.5
  ) {
    tips.push('ready_for_load')
  }

  if (input.avgRir != null && input.plannedRir) {
    const targetRir = parseNumericRange(input.plannedRir)
    if (targetRir && input.avgRir > targetRir.max + 1) {
      tips.push('rir_high')
    }
  }

  return tips
}

const avg = (values: number[]): number | null => {
  if (values.length === 0) return null
  return values.reduce((sum, v) => sum + v, 0) / values.length
}

const avgRirFromSets = (sets: SetLog[]): number | null => {
  const values = sets
    .map((set) => parseNumericRange(set.rir))
    .filter((range): range is { min: number; max: number } => range != null)
    .map((range) => (range.min + range.max) / 2)
  return avg(values)
}

export function computeWorkoutVerification(
  workout: WorkoutTree,
  sets: SetLog[],
): WorkoutVerification {
  const exercises: ExerciseVerification[] = []
  let totalPlannedSets = 0
  let totalCompletedSets = 0
  let totalPlannedVolume = 0
  let totalActualVolume = 0

  for (const section of workout.sections) {
    for (const block of section.blocks) {
      for (const group of block.groups) {
        for (const exercise of group.exercises) {
          const rowSets = sets
            .filter((set) => relationshipId(set.exerciseRow) === exercise.id)
            .sort((a, b) => (a.setNumber ?? 0) - (b.setNumber ?? 0))

          const roundsRange = parseNumericRange(exercise.rounds)
          const plannedSets = roundsRange?.max ?? 0
          const actualSets = rowSets.length
          const plannedReps = parseRepsCount(exercise.repsLeft, exercise.repsRight, exercise.reps)
          const plannedWeight = parseTargetWeight(exercise.kg)

          const repValues = rowSets
            .map(effectiveSetReps)
            .filter((value): value is number => value != null)
          const weightValues = rowSets.map(effectiveSetWeight)
          const avgReps = avg(repValues)
          const avgWeight = avg(weightValues)

          const plannedVolume =
            plannedSets > 0 && plannedReps != null && plannedWeight != null
              ? plannedSets * plannedReps * plannedWeight
              : plannedSets > 0 && plannedReps != null
                ? plannedSets * plannedReps * (plannedWeight ?? 0)
                : null

          const actualVolume = rowSets.reduce((sum, set) => {
            const reps = effectiveSetReps(set)
            const weight = effectiveSetWeight(set)
            if (reps == null) return sum
            return sum + reps * weight
          }, 0)

          const setsCompletionPct =
            plannedSets > 0 ? Math.min(100, Math.round((actualSets / plannedSets) * 100)) : 100

          const volumePct =
            plannedVolume != null && plannedVolume > 0
              ? Math.round((actualVolume / plannedVolume) * 100)
              : null

          if (plannedSets > 0) {
            totalPlannedSets += plannedSets
            totalCompletedSets += Math.min(actualSets, plannedSets)
          }

          if (plannedVolume != null) totalPlannedVolume += plannedVolume
          totalActualVolume += actualVolume

          exercises.push({
            exerciseRowId: exercise.id,
            name: getExerciseName(exercise),
            plannedSets,
            actualSets,
            setsCompletionPct,
            plannedRepsPerSet: plannedReps,
            avgActualReps: avgReps,
            plannedWeight,
            avgActualWeight: avgWeight,
            plannedVolume,
            actualVolume,
            volumePct,
            weightTrend: trendFromDelta((avgWeight ?? 0) - (plannedWeight ?? 0)),
            repsTrend: trendFromDelta((avgReps ?? 0) - (plannedReps ?? 0)),
            suggestions: buildExerciseSuggestions({
              plannedSets,
              actualSets,
              plannedReps,
              avgReps,
              plannedWeight,
              avgWeight,
              plannedRir: exercise.rir,
              avgRir: avgRirFromSets(rowSets),
              volumePct,
            }),
          })
        }
      }
    }
  }

  const completionPct =
    totalPlannedSets > 0 ? Math.round((totalCompletedSets / totalPlannedSets) * 100) : 100

  const volumePct =
    totalPlannedVolume > 0 ? Math.round((totalActualVolume / totalPlannedVolume) * 100) : 100

  const allSuggestions = [...new Set(exercises.flatMap((entry) => entry.suggestions))]

  const progressCount = exercises.filter(
    (entry) => entry.weightTrend === 'up' || entry.repsTrend === 'up',
  ).length
  const regressCount = exercises.filter(
    (entry) => entry.weightTrend === 'down' || entry.repsTrend === 'down',
  ).length

  let progression: WorkoutVerification['progression'] = 'maintain'
  if (progressCount > 0 && regressCount > 0) progression = 'mixed'
  else if (progressCount > 0) progression = 'progress'
  else if (regressCount > 0) progression = 'regress'

  if (completionPct < 90) allSuggestions.push('session_incomplete')
  if (volumePct < 85) allSuggestions.push('session_low_volume')

  return {
    completionPct,
    plannedVolume: Math.round(totalPlannedVolume),
    actualVolume: Math.round(totalActualVolume),
    volumePct,
    exercises,
    suggestions: allSuggestions,
    progression,
  }
}
