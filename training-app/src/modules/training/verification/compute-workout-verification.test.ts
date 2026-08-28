import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { computeWorkoutVerification } from './compute-workout-verification.ts'
import type { WorkoutTree } from '@/modules/training/plans'
import type { SetLog } from '@/payload-types'

const workout = {
  id: 1,
  title: 'Test',
  sections: [
    {
      title: 'Main',
      blocks: [
        {
          index: 0,
          groups: [
            {
              id: 1,
              exercises: [
                {
                  id: 10,
                  numer: '1',
                  rounds: '3',
                  repsLeft: '10',
                  kg: '50',
                  rir: '2',
                  meta: [],
                  exercise: { id: 1, name: 'Squat' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as unknown as WorkoutTree

describe('computeWorkoutVerification', () => {
  it('calculates completion when all planned sets are logged', () => {
    const sets = [
      { id: 1, exerciseRow: 10, setNumber: 1, weightLeft: 50, repsLeft: '10' },
      { id: 2, exerciseRow: 10, setNumber: 2, weightLeft: 50, repsLeft: '10' },
      { id: 3, exerciseRow: 10, setNumber: 3, weightLeft: 50, repsLeft: '10' },
    ] as SetLog[]

    const report = computeWorkoutVerification(workout, sets)
    assert.equal(report.completionPct, 100)
    assert.equal(report.actualVolume, 1500)
    assert.equal(report.plannedVolume, 1500)
  })

  it('flags incomplete sets', () => {
    const sets = [{ id: 1, exerciseRow: 10, setNumber: 1, weightLeft: 50, repsLeft: '10' }] as SetLog[]

    const report = computeWorkoutVerification(workout, sets)
    assert.equal(report.completionPct, 33)
    assert.ok(report.suggestions.includes('incomplete_sets'))
  })
})
