# School Log X UI Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 기능은 그대로 유지하면서 Apple/Toss 감성의 밝고 모던한 카드형 UI로 전면 리프레시한다.

**Architecture:** 기존 React 컴포넌트 구조(`App` + 4개 섹션 컴포넌트)는 유지하고, 시각 계층을 위해 클래스 기반 마크업 래퍼만 추가한다. 스타일은 `src/styles/app.css` 중심으로 토큰(색상/간격/그림자/라운드)을 재정의하고, 로직/데이터 흐름은 변경하지 않는다. 테스트는 기능 회귀 + 접근성 쿼리 안정성 유지에 집중한다.

**Tech Stack:** React 19, Vite, Vitest, Testing Library, CSS

---

## File Structure (planned)

- Modify: `src/App.jsx` — 페이지 레이아웃 래퍼 클래스, 섹션 배치 컨테이너
- Modify: `src/components/ScheduleForm.jsx` — 폼 그룹 래퍼/클래스 구조화
- Modify: `src/components/CalendarView.jsx` — 캘린더 헤더/토글/리스트 마크업 정리
- Modify: `src/components/DdayPanel.jsx` — D-day 리스트 아이템 카드 구조화
- Modify: `src/components/ProgressPanel.jsx` — 과목 카드형 마크업 추가
- Modify: `src/styles/app.css` — UI 리프레시 핵심 스타일
- Modify: `src/App.test.jsx` — 스타일 변경 후에도 기능/접근성 동작 유지 검증

### Task 1: 레이아웃 셸(페이지 구조) 리디자인

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles/app.css`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
it('renders branded app shell landmarks', () => {
  render(<App />)
  expect(screen.getByRole('main')).toHaveClass('app-shell')
  expect(screen.getByText('School Log X')).toHaveClass('app-title')
  expect(screen.getByRole('region', { name: '일정 관리 영역' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx`  
Expected: FAIL with missing `app-shell` class / `일정 관리 영역` landmark.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/App.jsx (핵심 구조)
return (
  <main className="app-shell">
    <header className="app-header">
      <h1 className="app-title">School Log X</h1>
      <p className="app-subtitle">과제·시험을 한눈에 정리하는 학생 플래너</p>
    </header>

    {uiError && (
      <p className="status-banner" role="status" aria-live="polite">
        {uiError}
      </p>
    )}

    <section className="app-grid" role="region" aria-label="일정 관리 영역">
      <ScheduleForm ... />
      <CalendarView ... />
      <DdayPanel ... />
      <ProgressPanel ... />
    </section>
  </main>
)
```

```css
/* src/styles/app.css (셸 부분) */
.app-shell { max-width: 1120px; margin: 0 auto; padding: 24px; }
.app-header { margin-bottom: 20px; }
.app-title { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; }
.app-subtitle { color: #4b5563; margin-top: 6px; }
.status-banner { margin: 0 0 16px; color: #d14343; }
.app-grid { display: grid; gap: 16px; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx`  
Expected: PASS for app shell test.

- [ ] **Step 5: Commit**

```bash
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" add src/App.jsx src/App.test.jsx src/styles/app.css
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" commit -m "feat: add modern app shell layout"
```

### Task 2: 카드형 컴포넌트 마크업 정리 (폼/캘린더)

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/components/ScheduleForm.jsx`
- Modify: `src/components/CalendarView.jsx`
- Modify: `src/styles/app.css`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
it('keeps form and calendar controls accessible after card markup update', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: '일정 저장' })).toBeInTheDocument()
  expect(screen.getByLabelText('유형')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '월' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '주' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '일' })).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx`  
Expected: FAIL if refactor temporarily breaks labels/buttons.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/ScheduleForm.jsx (핵심 마크업)
<section className="panel panel-form">
  <h2 className="panel-title">일정 등록/수정</h2>
  <form className="schedule-form" onSubmit={onSubmit}>
    <div className="field">
      <label htmlFor="event-type">유형</label>
      <select id="event-type" ... />
    </div>
    ...
    <button className="primary-btn" type="submit">일정 저장</button>
  </form>
</section>
```

```jsx
// src/components/CalendarView.jsx (핵심 마크업)
<section className="panel panel-calendar">
  <div className="panel-head">
    <h2 className="panel-title">{VIEW_TITLES[viewMode]}</h2>
    <div className="segmented-control" aria-label="캘린더 보기 전환">
      <button className={viewMode === 'month' ? 'segmented is-active' : 'segmented'} ...>월</button>
      <button className={viewMode === 'week' ? 'segmented is-active' : 'segmented'} ...>주</button>
      <button className={viewMode === 'day' ? 'segmented is-active' : 'segmented'} ...>일</button>
    </div>
  </div>
  <ul className="calendar-list">...</ul>
</section>
```

```css
/* src/styles/app.css (카드/컨트롤) */
.panel { background: rgba(255,255,255,0.78); border: 1px solid rgba(255,255,255,0.55); border-radius: 18px; box-shadow: 0 8px 24px rgba(17,24,39,0.06); backdrop-filter: blur(10px); padding: 18px; }
.panel-title { font-size: 20px; margin: 0 0 12px; }
.schedule-form { display: grid; gap: 10px; }
.field { display: grid; gap: 6px; }
.segmented-control { display: inline-flex; gap: 8px; background: #f1f5f9; padding: 4px; border-radius: 12px; }
.segmented { border: 0; background: transparent; border-radius: 10px; padding: 8px 12px; }
.segmented.is-active { background: #ffffff; box-shadow: 0 2px 8px rgba(15,23,42,0.08); }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx`  
Expected: PASS for accessibility/control presence.

- [ ] **Step 5: Commit**

```bash
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" add src/components/ScheduleForm.jsx src/components/CalendarView.jsx src/styles/app.css src/App.test.jsx
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" commit -m "feat: refresh form and calendar card ui"
```

### Task 3: D-day/진행률 카드 시각 개선

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/components/DdayPanel.jsx`
- Modify: `src/components/ProgressPanel.jsx`
- Modify: `src/styles/app.css`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
it('shows d-day and progress blocks with existing semantics', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: '다가오는 일정 D-day' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: '과목별 진행률' })).toBeInTheDocument()
  expect(screen.getByLabelText('수학 진행률')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx`  
Expected: FAIL while markup refactor is incomplete.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/components/DdayPanel.jsx
<section className="panel panel-dday">
  <h2 className="panel-title">다가오는 일정 D-day</h2>
  <ul className="dday-list">
    {events.map((event) => (
      <li key={event.id} className="dday-item">
        <span className="dday-title">{event.title}</span>
        <span className="dday-chip">{getDdayLabel(event.date)}</span>
      </li>
    ))}
  </ul>
</section>
```

```jsx
// src/components/ProgressPanel.jsx (핵심 마크업)
<section className="panel panel-progress">
  <h2 className="panel-title">과목별 진행률</h2>
  {subjects.map((subject) => (
    <div key={subject} className="progress-card">
      <label htmlFor={`progress-${subject}`}>{subject} 진행률</label>
      <div className="progress-row">
        <input id={`progress-${subject}`} type="number" ... />
        <button className="secondary-btn" type="button" onClick={() => onSave(subject)}>진행률 저장</button>
      </div>
      <p className="progress-value">{subject}: {progress[subject] ?? 0}%</p>
    </div>
  ))}
</section>
```

```css
/* src/styles/app.css (D-day/진행률) */
.dday-list, .calendar-list { display: grid; gap: 10px; padding: 0; list-style: none; margin: 0; }
.dday-item, .progress-card { border: 1px solid #eef2f7; border-radius: 14px; background: #fff; padding: 12px; }
.dday-chip { font-weight: 600; color: #2563eb; background: #eff6ff; border-radius: 999px; padding: 4px 10px; }
.progress-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; }
.progress-value { margin: 8px 0 0; color: #334155; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx`  
Expected: PASS for headings/label semantics.

- [ ] **Step 5: Commit**

```bash
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" add src/components/DdayPanel.jsx src/components/ProgressPanel.jsx src/styles/app.css src/App.test.jsx
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" commit -m "feat: refresh d-day and progress card visuals"
```

### Task 4: 폴리시(포커스/반응형) 마무리 + 회귀 검증

**Files:**
- Modify: `src/styles/app.css`
- Modify: `src/App.test.jsx`
- Test: `src/App.test.jsx`, `src/utils/date.test.js`

- [ ] **Step 1: Write the failing test**

```jsx
it('preserves validation and status announcement behavior', () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))
  expect(screen.getByRole('status')).toHaveTextContent('입력값을 확인해주세요.')
  expect(screen.getByText('유형은 필수입니다.')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx`  
Expected: FAIL if error/status semantics were accidentally broken.

- [ ] **Step 3: Write minimal implementation**

```css
/* src/styles/app.css (접근성/반응형 보강) */
:root { color-scheme: light; }
body { background: linear-gradient(160deg, #f6f7fb 0%, #ffffff 100%); color: #111827; }

input, select, textarea, button { border-radius: 12px; border: 1px solid #dbe2ea; background: #fff; }
.primary-btn { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.secondary-btn { background: #fff; color: #1f2937; }

button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

@media (min-width: 1024px) {
  .app-grid { grid-template-columns: 1.1fr 1fr; }
  .panel-form { grid-column: 1 / -1; }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test -- App.test.jsx src/utils/date.test.js`  
Expected: PASS (기능/검증 로직 회귀 없음).

- [ ] **Step 5: Run full suite and commit**

Run: `npm --prefix "C:\School Log X\.worktrees\feat-frontend-mvp" run test`  
Expected: PASS for all tests.

```bash
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" add src/styles/app.css src/App.test.jsx
git -C "C:\School Log X\.worktrees\feat-frontend-mvp" commit -m "feat: finalize premium light ui refresh"
```

## Self-Review

1. **Spec coverage:** 디자인 방향(화이트/블러/카드), 접근성 유지, 테스트 유지 조건을 Task 1~4로 모두 매핑했다.  
2. **Placeholder scan:** TBD/TODO/모호한 단계 없이 테스트/명령/코드 예시를 모두 명시했다.  
3. **Type consistency:** 기존 props/핸들러 이름(`onViewChange`, `onSave`, `getDdayLabel`)을 일관되게 유지했다.

