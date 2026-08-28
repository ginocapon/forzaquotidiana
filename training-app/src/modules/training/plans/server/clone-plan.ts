import 'server-only'

import type { Payload } from 'payload'

import { loadPlanDocuments } from './load-plan-documents'

type ClonePlanOptions = {
  title?: string
  clientId?: number | string
  sourceProductId?: number | string
}

const relId = (value: number | string | undefined): number | undefined => {
  if (value == null) return undefined
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : undefined
}

export async function clonePlanForClient(
  payload: Payload,
  templatePlanId: number | string,
  options: ClonePlanOptions = {},
): Promise<{ planId: number | string }> {
  const docs = await loadPlanDocuments(payload, [templatePlanId], true)
  const templatePlan = docs.plans[0]

  if (!templatePlan) {
    throw new Error(`Template plan ${templatePlanId} not found`)
  }

  const numericClientId = options.clientId != null ? Number(options.clientId) : undefined

  const newPlan = await payload.create({
    collection: 'plans',
    data: {
      title: options.title ?? `${templatePlan.title} (copy)`,
      description: templatePlan.description,
      trainingType: templatePlan.trainingType,
      status: 'active',
      client: Number.isFinite(numericClientId) ? numericClientId : undefined,
      isTemplate: false,
      startDate: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  const microcycleIdMap = new Map<number | string, number>()

  for (const microcycle of docs.microcycles) {
    const created = await payload.create({
      collection: 'microcycles',
      data: {
        title: microcycle.title,
        plan: relId(newPlan.id)!,
        rpe: microcycle.rpe,
        order: microcycle.order,
      },
      overrideAccess: true,
    })
    microcycleIdMap.set(microcycle.id, relId(created.id)!)
  }

  const workoutIdMap = new Map<number | string, number>()

  for (const workout of docs.workouts) {
    const microcycleRef =
      typeof workout.microcycle === 'object' ? workout.microcycle?.id : workout.microcycle
    const microcycleId = microcycleRef ? microcycleIdMap.get(microcycleRef) : undefined
    if (!microcycleId) continue

    const created = await payload.create({
      collection: 'workouts',
      data: {
        title: workout.title,
        microcycle: microcycleId,
        rpe: workout.rpe,
        order: workout.order,
        sections: workout.sections,
      },
      overrideAccess: true,
    })
    workoutIdMap.set(workout.id, relId(created.id)!)
  }

  const groupIdMap = new Map<number | string, number>()

  for (const group of docs.groups) {
    const workoutRef = typeof group.workout === 'object' ? group.workout?.id : group.workout
    const workoutId = workoutRef ? workoutIdMap.get(workoutRef) : undefined
    if (!workoutId) continue

    const created = await payload.create({
      collection: 'workout-groups',
      data: {
        workout: workoutId,
        sectionRowId: group.sectionRowId,
        label: group.label,
        order: group.order,
        bundleWithPrevious: group.bundleWithPrevious,
        protocol: group.protocol,
        rounds: group.rounds,
        durationMinutes: group.durationMinutes,
        intervalSeconds: group.intervalSeconds,
        workSeconds: group.workSeconds,
        restSeconds: group.restSeconds,
        restBetweenRounds: group.restBetweenRounds,
      },
      overrideAccess: true,
    })
    groupIdMap.set(group.id, relId(created.id)!)
  }

  for (const row of docs.exerciseRows) {
    const groupRef = typeof row.group === 'object' ? row.group?.id : row.group
    const groupId = groupRef ? groupIdMap.get(groupRef) : undefined
    if (!groupId) continue

    const exerciseRef =
      typeof row.exercise === 'object' && row.exercise ? row.exercise.id : row.exercise

    await payload.create({
      collection: 'workout-exercise-rows',
      data: {
        group: groupId,
        order: row.order,
        numer: row.numer,
        exercise: exerciseRef != null ? relId(exerciseRef) : undefined,
        note: row.note,
        targetType: row.targetType,
        rounds: row.rounds,
        reps: row.reps,
        repsLeft: row.repsLeft,
        repsRight: row.repsRight,
        kg: row.kg,
        tut: row.tut,
        rir: row.rir,
        rest: row.rest,
        durationMin: row.durationMin,
        durationSec: row.durationSec,
        setParameters: row.setParameters,
        override: row.override,
      },
      overrideAccess: true,
    })
  }

  if (options.sourceProductId) {
    await payload.update({
      collection: 'plans',
      id: newPlan.id,
      data: {
        source: `program-product:${options.sourceProductId}`,
      },
      overrideAccess: true,
    })
  }

  return { planId: newPlan.id }
}
