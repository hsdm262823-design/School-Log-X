function parseDateValue(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  return new Date(value)
}

function toDayStart(value) {
  const d = parseDateValue(value)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getFutureEventsSorted(events, now = new Date()) {
  const today = toDayStart(now)
  return events
    .filter((event) => toDayStart(event.date) >= today)
    .sort((a, b) => toDayStart(a.date) - toDayStart(b.date))
}

export function getDdayLabel(date, now = new Date()) {
  const target = toDayStart(date)
  const today = toDayStart(now)
  const diffMs = target - today
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  return `D-${diffDays}`
}
