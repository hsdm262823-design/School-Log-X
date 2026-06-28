export default function DdayPanel({ events, getDdayLabel }) {
  return (
    <section className="panel panel-dday">
      <h2 className="panel-title">다가오는 일정 D-day</h2>
      <ul className="dday-list">
        {events.map((event) => (
          <li key={event.id} className="dday-item">
            <span className="dday-title">{event.title}</span>{' '}
            <span className="dday-chip">{getDdayLabel(event.date)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
