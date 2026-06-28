import { useMemo, useState } from 'react'
import CalendarView from './components/CalendarView'
import DdayPanel from './components/DdayPanel'
import ProgressPanel from './components/ProgressPanel'
import ScheduleForm from './components/ScheduleForm'
import { getDdayLabel, getFutureEventsSorted } from './utils/date'
import { loadEvents, loadProgress, saveEvents, saveProgress } from './utils/storage'
import { validateEventInput, validateProgress } from './utils/validators'

const INITIAL_FORM = {
  type: '',
  subject: '',
  title: '',
  date: '',
  memo: '',
}

function initializeStorageState() {
  try {
    return {
      events: loadEvents(),
      progress: loadProgress(),
      initialError: '',
    }
  } catch {
    return {
      events: [],
      progress: {},
      initialError: '저장 데이터를 읽지 못했습니다.',
    }
  }
}

function App() {
  const [initialStorage] = useState(() => initializeStorageState())
  const [events, setEvents] = useState(initialStorage.events)
  const [progress, setProgress] = useState(initialStorage.progress)
  const [viewMode, setViewMode] = useState('month')
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [uiError, setUiError] = useState(initialStorage.initialError)
  const [progressDraft, setProgressDraft] = useState({})

  const futureEvents = useMemo(() => getFutureEventsSorted(events), [events])

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateEventInput(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setUiError('입력값을 확인해주세요.')
      return
    }

    const nextEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...form,
    }
    const nextEvents = [...events, nextEvent]

    try {
      saveEvents(nextEvents)
    } catch {
      setUiError('저장 공간에 문제가 있어 일정을 저장하지 못했습니다.')
      return
    }

    setEvents(nextEvents)
    setForm(INITIAL_FORM)
    setUiError('')
  }

  function handleProgressDraftChange(subject, value) {
    setProgressDraft((prev) => ({ ...prev, [subject]: value }))
  }

  function handleSaveProgress(subject) {
    const raw = progressDraft[subject] ?? progress[subject] ?? 0
    const numericValue = Number(raw)
    const validationError = validateProgress(numericValue)

    if (validationError) {
      setUiError(validationError)
      return
    }

    const next = { ...progress, [subject]: numericValue }

    try {
      saveProgress(next)
    } catch {
      setUiError('저장 공간에 문제가 있어 진행률을 저장하지 못했습니다.')
      return
    }

    setProgress(next)
    setUiError('')
  }

  return (
    <main>
      <h1>School Log X</h1>
      {uiError && (
        <p role="status" aria-live="polite">
          {uiError}
        </p>
      )}

      <ScheduleForm
        form={form}
        errors={errors}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      <CalendarView viewMode={viewMode} onViewChange={setViewMode} events={events} />
      <DdayPanel events={futureEvents} getDdayLabel={getDdayLabel} />

      <ProgressPanel
        progress={progress}
        progressDraft={progressDraft}
        onDraftChange={handleProgressDraftChange}
        onSave={handleSaveProgress}
      />
    </main>
  )
}

export default App
