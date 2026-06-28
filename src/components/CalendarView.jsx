const VIEW_TITLES = {
  month: '월 캘린더',
  week: '주 캘린더',
  day: '일 캘린더',
}

function parseDateString(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function getWeekStart(date) {
  const copy = new Date(date)
  copy.setDate(copy.getDate() - copy.getDay())
  copy.setHours(0, 0, 0, 0)
  return copy
}

function getDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function groupEventsByDate(events) {
  const map = new Map()
  events.forEach((event) => {
    const parsed = parseDateString(event.date)
    if (!parsed) return
    const key = getDateKey(parsed)
    const grouped = map.get(key) ?? []
    grouped.push(event)
    map.set(key, grouped)
  })
  return map
}

function renderMonthCalendar(events) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate()
  const leadingEmptyCount = firstDay.getDay()
  const eventsByDay = new Map()

  events.forEach((event) => {
    const parsed = parseDateString(event.date)
    if (!parsed) return
    if (parsed.getFullYear() !== currentYear || parsed.getMonth() !== currentMonth)
      return

    const day = parsed.getDate()
    const dayEvents = eventsByDay.get(day) ?? []
    dayEvents.push(event)
    eventsByDay.set(day, dayEvents)
  })

  return (
    <>
      <p className="month-title">
        {currentYear}년 {currentMonth + 1}월
      </p>
      <div className="month-grid" role="grid" aria-label="월별 일정 달력">
        {Array.from({ length: leadingEmptyCount }).map((_, index) => (
          <div key={`empty-${index}`} className="month-cell empty" aria-hidden="true" />
        ))}
        {Array.from({ length: lastDate }).map((_, index) => {
          const day = index + 1
          const dayEvents = eventsByDay.get(day) ?? []

          return (
            <div key={day} className="month-cell" role="gridcell">
              <p className="month-day">{day}</p>
              <ul className="month-events">
                {dayEvents.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </>
  )
}

function renderWeekCalendar(events) {
  const now = new Date()
  const weekStart = getWeekStart(now)
  const eventsByDate = groupEventsByDate(events)

  return (
    <>
      <p className="week-title">이번 주</p>
      <div className="week-grid" role="grid" aria-label="주간 일정 달력">
        {Array.from({ length: 7 }).map((_, index) => {
          const current = new Date(weekStart)
          current.setDate(weekStart.getDate() + index)
          const key = getDateKey(current)
          const dayEvents = eventsByDate.get(key) ?? []

          return (
            <div key={key} className="week-cell" role="gridcell">
              <p className="week-day-label">
                {current.getMonth() + 1}/{current.getDate()}
              </p>
              <ul className="week-events">
                {dayEvents.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </>
  )
}

function renderDayCalendar(events) {
  const today = new Date()
  const todayKey = getDateKey(today)
  const eventsByDate = groupEventsByDate(events)
  const todayEvents = eventsByDate.get(todayKey) ?? []

  return (
    <>
      <p className="day-title">오늘 일정</p>
      <div className="day-grid" role="grid" aria-label="일간 일정 달력">
        <div className="day-cell" role="gridcell">
          <p className="day-label">
            {today.getFullYear()}-{String(today.getMonth() + 1).padStart(2, '0')}-
            {String(today.getDate()).padStart(2, '0')}
          </p>
          <ul className="day-events">
            {todayEvents.map((event) => (
              <li key={event.id}>{event.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default function CalendarView({ viewMode, onViewChange, events }) {
  return (
    <section className="panel panel-calendar">
      <div className="panel-head">
        <h2 className="panel-title">{VIEW_TITLES[viewMode]}</h2>
        <div className="segmented-control" aria-label="캘린더 보기 전환">
          <button
            className={viewMode === 'month' ? 'segmented is-active' : 'segmented'}
            type="button"
            onClick={() => onViewChange('month')}
          >
            월
          </button>
          <button
            className={viewMode === 'week' ? 'segmented is-active' : 'segmented'}
            type="button"
            onClick={() => onViewChange('week')}
          >
            주
          </button>
          <button
            className={viewMode === 'day' ? 'segmented is-active' : 'segmented'}
            type="button"
            onClick={() => onViewChange('day')}
          >
            일
          </button>
        </div>
      </div>

      {viewMode === 'month' && renderMonthCalendar(events)}
      {viewMode === 'week' && renderWeekCalendar(events)}
      {viewMode === 'day' && renderDayCalendar(events)}
    </section>
  )
}
