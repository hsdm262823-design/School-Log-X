const EVENTS_KEY = 'school-log-x:events'
const PROGRESS_KEY = 'school-log-x:progress'

export function loadEvents() {
  const raw = localStorage.getItem(EVENTS_KEY)
  const parsed = raw ? JSON.parse(raw) : []
  return Array.isArray(parsed) ? parsed : []
}

export function saveEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function loadProgress() {
  const raw = localStorage.getItem(PROGRESS_KEY)
  const parsed = raw ? JSON.parse(raw) : {}
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed
    : {}
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}
