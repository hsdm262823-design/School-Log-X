const VIEW_TITLES = {
  month: '월 캘린더',
  week: '주 캘린더',
  day: '일 캘린더',
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

      <ul className="calendar-list">
        {events.map((event) => (
          <li key={event.id}>
            <span>{event.subject}</span> <span>{event.title}</span>{' '}
            <span>{event.date}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
