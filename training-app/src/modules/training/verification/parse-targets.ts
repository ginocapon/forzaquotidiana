/** Parse "4", "3-4", "8-12" into numeric bounds. */
export function parseNumericRange(value?: string | null): { min: number; max: number } | null {
  const trimmed = value?.trim() ?? ''
  if (!trimmed || trimmed.toLowerCase() === 'x') return null

  const range = trimmed.match(/^(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)$/)
  if (range) {
    const min = Number(range[1])
    const max = Number(range[2])
    if (Number.isFinite(min) && Number.isFinite(max)) {
      return { min: Math.min(min, max), max: Math.max(min, max) }
    }
  }

  const single = trimmed.match(/(\d+(?:\.\d+)?)/)
  if (!single) return null
  const n = Number(single[1])
  return Number.isFinite(n) ? { min: n, max: n } : null
}

export function parseRestSeconds(rest?: string | null): number | null {
  const range = parseNumericRange(rest)
  if (!range) return null
  return Math.round((range.min + range.max) / 2)
}

export function parseRepsCount(repsLeft?: string | null, repsRight?: string | null, reps?: string | null): number | null {
  const left = parseNumericRange(repsLeft)
  const right = parseNumericRange(repsRight)
  const combined = parseNumericRange(reps)

  if (left && right) {
    const l = (left.min + left.max) / 2
    const r = (right.min + right.max) / 2
    return l + r
  }
  if (left) return (left.min + left.max) / 2
  if (right) return (right.min + right.max) / 2
  if (combined) return (combined.min + combined.max) / 2
  return null
}

export function effectiveSetWeight(set: {
  isBodyweight?: boolean | null
  weight?: number | null
  weightLeft?: number | null
  weightRight?: number | null
}): number {
  if (set.isBodyweight) return 0
  const left = set.weightLeft ?? null
  const right = set.weightRight ?? null
  if (left != null && right != null) return (left + right) / 2
  return left ?? right ?? set.weight ?? 0
}

export function effectiveSetReps(set: {
  reps?: string | null
  repsLeft?: string | null
  repsRight?: string | null
}): number | null {
  return parseRepsCount(set.repsLeft, set.repsRight, set.reps)
}

export function parseTargetWeight(kg?: string | null): number | null {
  const range = parseNumericRange(kg)
  if (!range) return null
  return (range.min + range.max) / 2
}
