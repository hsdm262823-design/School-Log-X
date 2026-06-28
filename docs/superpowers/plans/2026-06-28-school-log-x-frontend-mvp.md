# School Log X Frontend MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 문서 요구사항(FR-001~004)에 맞는 일정 CRUD, 월/주/일 캘린더, D-day, 과목별 진행률 기능을 localStorage 기반 React MVP로 구현한다.

**Architecture:** 기존 단일 `App` 구조를 유지하되 책임을 작은 컴포넌트/유틸 파일로 분리한다. 일정/진행률 상태는 `App`에서 관리하고, UI는 폼/캘린더/패널 컴포넌트로 나눠 props로 연결한다. 입력 검증과 날짜 계산은 순수 함수 유틸로 분리해 테스트 가능성을 높인다.

**Tech Stack:** React 19, Vite, Vitest, Testing Library

---

## File Structure (planned)

- Modify: `src/App.jsx` — 상위 상태 관리, CRUD 핸들러, 화면 조합
- Modify: `src/App.test.jsx` — 통합 시나리오 테스트
- Create: `src/components/ScheduleForm.jsx` — 일정 등록/수정 폼 + 필드 오류 표시
- Create: `src/components/CalendarView.jsx` — 월/주/일 전환 + 일정 리스트
- Create: `src/components/DdayPanel.jsx` — 미래 일정 D-day 카드
- Create: `src/components/ProgressPanel.jsx` — 과목별 진행률 표시/수정
- Create: `src/utils/storage.js` — localStorage 로드/저장
- Create: `src/utils/validators.js` — 입력 검증
- Create: `src/utils/date.js` — D-day 계산/정렬
- Create: `src/styles/app.css` — 기본 레이아웃/접근성 보조 스타일
- Modify: `src/main.jsx` — 스타일 import

### Task 1: 공통 유틸(저장/검증/날짜) 준비

**Files:**
- Create: `src/utils/storage.js`
- Create: `src/utils/validators.js`
- Create: `src/utils/date.js`
- Test: `src/App.test.jsx` (유틸 통합 관점 테스트 추가)

- [ ] **Step 1: Write the failing test**

```jsx
it('shows validation message when required fields are missing', async () => {
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: '일정 저장' }))
  expect(screen.getByText('유형은 필수입니다.')).toBeInTheDocument()
  expect(screen.getByText('과목은 필수입니다.')).toBeInTheDocument()
  expect(screen.getByText('제목은 필수입니다.')).toBeInTheDocument()
  expect(screen.getByText('날짜는 필수입니다.')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- App.test.jsx`  
Expected: FAIL with missing form/validation implementation assertions.

- [ ] **Step 3: Write minimal implementation**

```js
// src/utils/validators.js
export function validateEventInput(input) {
  const errors = {}
  if (!input.type) errors.type = '유형은 필수입니다.'
  if (!input.subject?.trim()) errors.subject = '과목은 필수입니다.'
  if (!input.title?.trim()) errors.title = '제목은 필수입니다.'
  if (!input.date) errors.date = '날짜는 필수입니다.'
  return errors
}
```

```js
// src/utils/storage.js
const EVENTS_KEY = 'school-log-x:events'
const PROGRESS_KEY = 'school-log-x:progress'

export function loadEvents() {
  const raw = localStorage.getItem(EVENTS_KEY)
  return raw ? JSON.parse(raw) : []
}

export function saveEvents(events) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
}

export function loadProgress() {
  const raw = localStorage.getItem(PROGRESS_KEY)
  return raw ? JSON.parse(raw) : {}
}

export function saveProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}
```

```js
// src/utils/date.js
export function getDdayLabel(targetDate, today = new Date()) {
  const base = new Date(today.toDateString())
  const target = new Date(targetDate)
  const diff = Math.ceil((target - base) / (1000 * 60 * 60 * 24))
  return `D-${diff}`
}

export function getFutureEventsSorted(events, today = new Date()) {
  const base = new Date(today.toDateString())
  return events
    .filter((event) => new Date(event.date) >= base)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- App.test.jsx`  
Expected: PASS for validation scenario.

- [ ] **Step 5: Commit**

```bash
git add src/utils/storage.js src/utils/validators.js src/utils/date.js src/App.test.jsx
git commit -m "feat: add frontend utility modules for mvp"
```

### Task 2: 일정 CRUD 폼 구현

**Files:**
- Create: `src/components/ScheduleForm.jsx`
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
it('creates a new event and renders it in list', async () => {
  render(<App />)
  await userEvent.selectOptions(screen.getByLabelText('유형'), 'assignment')
  await userEvent.type(screen.getByLabelText('과목'), '수학')
  await userEvent.type(screen.getByLabelText('제목'), '문제집 3단원')
  await userEvent.type(screen.getByLabelText('날짜'), '2026-07-01')
  await userEvent.click(screen.getByRole('button', { name: '일정 저장' }))
  expect(screen.getByText('수학')).toBeInTheDocument()
  expect(screen.getByText('문제집 3단원')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- App.test.jsx`  
Expected: FAIL with missing form fields/handlers.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/ScheduleForm.jsx
export default function ScheduleForm({
  form,
  errors,
  onChange,
  onSubmit,
  submitLabel = '일정 저장',
}) {
  return (
    <form onSubmit={onSubmit} aria-label="일정 폼">
      <label htmlFor="type">유형</label>
      <select id="type" value={form.type} onChange={(e) => onChange('type', e.target.value)}>
        <option value="">선택</option>
        <option value="assignment">과제</option>
        <option value="exam">시험</option>
      </select>
      {errors.type && <p role="alert">{errors.type}</p>}

      <label htmlFor="subject">과목</label>
      <input id="subject" value={form.subject} onChange={(e) => onChange('subject', e.target.value)} />
      {errors.subject && <p role="alert">{errors.subject}</p>}

      <label htmlFor="title">제목</label>
      <input id="title" value={form.title} onChange={(e) => onChange('title', e.target.value)} />
      {errors.title && <p role="alert">{errors.title}</p>}

      <label htmlFor="date">날짜</label>
      <input id="date" type="date" value={form.date} onChange={(e) => onChange('date', e.target.value)} />
      {errors.date && <p role="alert">{errors.date}</p>}

      <label htmlFor="memo">메모</label>
      <textarea id="memo" value={form.memo} onChange={(e) => onChange('memo', e.target.value)} />

      <button type="submit">{submitLabel}</button>
    </form>
  )
}
```

```jsx
// src/App.jsx (핵심 부분)
const [events, setEvents] = useState(loadEvents())
const [form, setForm] = useState({ type: '', subject: '', title: '', date: '', memo: '' })
const [errors, setErrors] = useState({})

function handleSubmit(e) {
  e.preventDefault()
  const nextErrors = validateEventInput(form)
  setErrors(nextErrors)
  if (Object.keys(nextErrors).length > 0) return
  const nextEvent = { id: crypto.randomUUID(), ...form }
  const nextEvents = [...events, nextEvent]
  setEvents(nextEvents)
  saveEvents(nextEvents)
  setForm({ type: '', subject: '', title: '', date: '', memo: '' })
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- App.test.jsx`  
Expected: PASS for create scenario.

- [ ] **Step 5: Commit**

```bash
git add src/components/ScheduleForm.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: add schedule form and event create flow"
```

### Task 3: 캘린더(월/주/일) + D-day 패널 구현

**Files:**
- Create: `src/components/CalendarView.jsx`
- Create: `src/components/DdayPanel.jsx`
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
it('switches month/week/day tabs and shows d-day sorted cards', async () => {
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: '주' }))
  expect(screen.getByRole('heading', { name: '주 캘린더' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button', { name: '일' }))
  expect(screen.getByRole('heading', { name: '일 캘린더' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '다가오는 일정 D-day' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- App.test.jsx`  
Expected: FAIL with missing tab and d-day UI.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/CalendarView.jsx
const VIEW_LABEL = { month: '월 캘린더', week: '주 캘린더', day: '일 캘린더' }

export default function CalendarView({ viewMode, onViewChange, events }) {
  return (
    <section>
      <div role="tablist" aria-label="캘린더 보기 전환">
        <button type="button" onClick={() => onViewChange('month')}>월</button>
        <button type="button" onClick={() => onViewChange('week')}>주</button>
        <button type="button" onClick={() => onViewChange('day')}>일</button>
      </div>
      <h2>{VIEW_LABEL[viewMode]}</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.subject} - {event.title} ({event.date})</li>
        ))}
      </ul>
    </section>
  )
}
```

```jsx
// src/components/DdayPanel.jsx
export default function DdayPanel({ events, getDdayLabel }) {
  return (
    <section aria-label="d-day 패널">
      <h2>다가오는 일정 D-day</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.title} - {getDdayLabel(event.date)}
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- App.test.jsx`  
Expected: PASS for tab and D-day scenario.

- [ ] **Step 5: Commit**

```bash
git add src/components/CalendarView.jsx src/components/DdayPanel.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: add calendar view modes and d-day panel"
```

### Task 4: 과목별 진행률 패널 구현

**Files:**
- Create: `src/components/ProgressPanel.jsx`
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
it('updates subject progress and reflects changed value', async () => {
  render(<App />)
  await userEvent.type(screen.getByLabelText('수학 진행률'), '80')
  await userEvent.click(screen.getByRole('button', { name: '진행률 저장' }))
  expect(screen.getByText('수학: 80%')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- App.test.jsx`  
Expected: FAIL with missing progress UI/handler.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/ProgressPanel.jsx
export default function ProgressPanel({ progress, onSave }) {
  const [subject, setSubject] = useState('수학')
  const [value, setValue] = useState(progress['수학'] ?? 0)

  return (
    <section>
      <h2>과목별 진행률</h2>
      <label htmlFor="progress-input">{subject} 진행률</label>
      <input
        id="progress-input"
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="button" onClick={() => onSave(subject, Number(value))}>진행률 저장</button>
      <p>{subject}: {progress[subject] ?? 0}%</p>
    </section>
  )
}
```

```jsx
// src/App.jsx (핵심 부분)
const [progress, setProgress] = useState(loadProgress())

function handleSaveProgress(subject, value) {
  if (Number.isNaN(value) || value < 0 || value > 100) {
    setUiError('진행률은 0~100 범위여야 합니다.')
    return
  }
  const next = { ...progress, [subject]: value }
  setProgress(next)
  saveProgress(next)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- App.test.jsx`  
Expected: PASS for progress update scenario.

- [ ] **Step 5: Commit**

```bash
git add src/components/ProgressPanel.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: add subject progress panel"
```

### Task 5: 스타일/접근성/회귀 테스트 정리

**Files:**
- Create: `src/styles/app.css`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
it('announces validation errors and keeps keyboard accessible controls', async () => {
  render(<App />)
  await userEvent.click(screen.getByRole('button', { name: '일정 저장' }))
  expect(screen.getByRole('status')).toHaveTextContent('입력값을 확인해주세요.')
  expect(screen.getByRole('tablist', { name: '캘린더 보기 전환' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- App.test.jsx`  
Expected: FAIL with missing status region / accessibility markers.

- [ ] **Step 3: Write minimal implementation**

```css
/* src/styles/app.css */
main {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  font-family: system-ui, sans-serif;
}

[role='alert'] { color: #b00020; }
[role='status'] { margin: 8px 0; }
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible { outline: 2px solid #2563eb; outline-offset: 2px; }
```

```jsx
// src/main.jsx
import './styles/app.css'
```

```jsx
// src/App.jsx (핵심 부분)
{uiError && (
  <p role="status" aria-live="polite">
    {uiError}
  </p>
)}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- App.test.jsx`  
Expected: PASS for accessibility/error scenario.

- [ ] **Step 5: Run full suite and commit**

Run: `npm run test`  
Expected: PASS for all tests.

```bash
git add src/styles/app.css src/main.jsx src/App.jsx src/App.test.jsx
git commit -m "feat: finalize mvp accessibility and styles"
```

## Spec Coverage Check

- FR-001 일정 CRUD → Task 2
- FR-002 월/주/일 캘린더 → Task 3
- FR-003 D-day 알림 → Task 3
- FR-004 과목별 진행률 → Task 4
- 오류 안내/접근성/완료 기준 보강 → Task 5

모든 스펙 항목이 최소 1개 이상의 태스크에 연결됨.

