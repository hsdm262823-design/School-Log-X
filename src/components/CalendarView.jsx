const VIEW_TITLES = {
  month: '월 캘린더',
  week: '주 캘린더',
  day: '일 캘린더',
}

export default function CalendarView({ viewMode, onViewChange, events }) {
  return (
    <section>
      <h2>{VIEW_TITLES[viewMode]}</h2>
      <div aria-label="캘린더 보기 전환">
        <button type="button" onClick={() => onViewChange('month')}>
          월
        </button>
        <button type="button" onClick={() => onViewChange('week')}>
          주
        </button>
        <button type="button" onClick={() => onViewChange('day')}>
          일
        </button>
      </div>

      <ul>
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
