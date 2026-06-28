import { describe, expect, it } from 'vitest'
import { getDdayLabel, getFutureEventsSorted } from './date'

describe('date utils', () => {
  it('calculates D-day from YYYY-MM-DD as calendar date', () => {
    const now = new Date(2026, 5, 28)
    expect(getDdayLabel('2026-06-30', now)).toBe('D-2')
  })

  it('filters and sorts future events by calendar date', () => {
    const now = new Date(2026, 5, 28)
    const events = [
      { id: '1', date: '2026-06-27' },
      { id: '2', date: '2026-06-30' },
      { id: '3', date: '2026-06-29' },
    ]

    const result = getFutureEventsSorted(events, now)
    expect(result.map((item) => item.id)).toEqual(['3', '2'])
  })
})
