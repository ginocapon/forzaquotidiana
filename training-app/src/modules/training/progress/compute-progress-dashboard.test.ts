import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildProgressDashboard } from './compute-progress-dashboard.ts'
import type { PlanTree } from '@/modules/training/plans'
import type { BodyWeightLog, SetLog, WorkoutLog } from '@/payload-types'

const plans = [
  {
    id: 1,
    microcycles: [
      {
        id: 1,
        workouts: [
          {
            id: 5,
            title: 'Upper',
            sections: [
              {
                blocks: [
                  {
                    index: 0,
                    groups: [
                      {
                        id: 1,
                        exercises: [
                          {
                            id: 10,
                            rounds: '2',
                            repsLeft: '8',
                            kg: '40',
                            meta: [],
                            exercise: { name: 'Press' },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
] as unknown as PlanTree[]

describe('buildProgressDashboard', () => {
  it('aggregates session stats and personal records', () => {
    const sessions = [
      {
        id: 1,
        workout: 5,
        title: 'Upper — test',
        updatedAt: '2026-08-20T10:00:00.000Z',
      },
    ] as WorkoutLog[]

    const sets = [
      { id: 1, session: 1, exerciseRow: 10, exerciseName: 'Press', setNumber: 1, weightLeft: 40, repsLeft: '8' },
      { id: 2, session: 1, exerciseRow: 10, exerciseName: 'Press', setNumber: 2, weightLeft: 42, repsLeft: '8' },
    ] as SetLog[]

    const bodyWeightLogs = [
      { id: 1, recordedAt: '2026-08-01', weightKg: 78 },
      { id: 2, recordedAt: '2026-08-20', weightKg: 77.5 },
    ] as BodyWeightLog[]

    const data = buildProgressDashboard({ plans, sessions, sets, bodyWeightLogs })

    assert.equal(data.summary.totalSessions, 1)
    assert.equal(data.summary.totalVolume, 656)
    assert.equal(data.personalRecords.length, 1)
    assert.equal(data.personalRecords[0]?.exerciseName, 'Press')
    assert.equal(data.bodyWeightTrend.length, 2)
    assert.equal(data.latestWeightKg, 77.5)
  })
})
