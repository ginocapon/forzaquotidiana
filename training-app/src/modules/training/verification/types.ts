export type Trend = 'up' | 'down' | 'same' | 'unknown'

export type ExerciseVerification = {
  exerciseRowId: number
  name: string
  plannedSets: number
  actualSets: number
  setsCompletionPct: number
  plannedRepsPerSet: number | null
  avgActualReps: number | null
  plannedWeight: number | null
  avgActualWeight: number | null
  plannedVolume: number | null
  actualVolume: number
  volumePct: number | null
  weightTrend: Trend
  repsTrend: Trend
  suggestions: string[]
}

export type WorkoutVerification = {
  completionPct: number
  plannedVolume: number
  actualVolume: number
  volumePct: number
  exercises: ExerciseVerification[]
  suggestions: string[]
  progression: 'progress' | 'maintain' | 'regress' | 'mixed'
}
