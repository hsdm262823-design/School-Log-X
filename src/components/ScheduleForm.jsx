export default function ScheduleForm({ form, errors, onChange, onSubmit }) {
  return (
    <section>
      <h2>일정 등록/수정</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="event-type">유형</label>
        <select
          id="event-type"
          value={form.type}
          onChange={(e) => onChange('type', e.target.value)}
        >
          <option value="">선택</option>
          <option value="assignment">과제</option>
          <option value="exam">시험</option>
        </select>
        {errors.type && <p role="alert">{errors.type}</p>}

        <label htmlFor="event-subject">과목</label>
        <input
          id="event-subject"
          value={form.subject}
          onChange={(e) => onChange('subject', e.target.value)}
        />
        {errors.subject && <p role="alert">{errors.subject}</p>}

        <label htmlFor="event-title">제목</label>
        <input
          id="event-title"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
        />
        {errors.title && <p role="alert">{errors.title}</p>}

        <label htmlFor="event-date">날짜</label>
        <input
          id="event-date"
          type="date"
          value={form.date}
          onChange={(e) => onChange('date', e.target.value)}
        />
        {errors.date && <p role="alert">{errors.date}</p>}

        <label htmlFor="event-memo">메모</label>
        <textarea
          id="event-memo"
          value={form.memo}
          onChange={(e) => onChange('memo', e.target.value)}
        />

        <button type="submit">일정 저장</button>
      </form>
    </section>
  )
}
