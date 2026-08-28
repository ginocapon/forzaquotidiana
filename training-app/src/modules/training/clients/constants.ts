export const EXPERIENCE_LEVEL_OPTIONS = [
  { label: 'Principiante', value: 'beginner' },
  { label: 'Intermedio', value: 'intermediate' },
  { label: 'Avanzato', value: 'advanced' },
] as const

export const TRAINING_FOCUS_OPTIONS = [
  { label: 'Ipertrofia', value: 'hypertrophy' },
  { label: 'Forza', value: 'strength' },
  { label: 'Definizione', value: 'definition' },
  { label: 'Ricomposizione corporea', value: 'recomposition' },
  { label: 'Dimagrimento', value: 'fat_loss' },
  { label: 'Mantenimento', value: 'maintenance' },
  { label: 'Resistenza muscolare', value: 'muscular_endurance' },
  { label: 'Mobilità', value: 'mobility' },
  { label: 'Recupero', value: 'recovery' },
  { label: 'Over 50', value: 'over_50' },
] as const

export type ExperienceLevel = (typeof EXPERIENCE_LEVEL_OPTIONS)[number]['value']
export type TrainingFocus = (typeof TRAINING_FOCUS_OPTIONS)[number]['value']

export const experienceLevelLabel = (value?: string | null) =>
  EXPERIENCE_LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? value ?? ''

export const trainingFocusLabel = (value: string) =>
  TRAINING_FOCUS_OPTIONS.find((option) => option.value === value)?.label ?? value
