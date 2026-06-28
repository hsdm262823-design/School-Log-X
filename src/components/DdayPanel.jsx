export default function DdayPanel({ events, getDdayLabel }) {
  return (
    <section>
      <h2>다가오는 일정 D-day</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <span>{event.title}</span> <span>{getDdayLabel(event.date)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
