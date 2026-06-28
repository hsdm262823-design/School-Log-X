export default function ScheduleForm({ form, errors, onChange, onSubmit }) {
  return (
    <section className="panel panel-form">
      <h2 className="panel-title">일정 등록/수정</h2>
      <form className="schedule-form" onSubmit={onSubmit}>
        <div className="field">
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
          {errors.type && (
            <p className="field-error" role="alert">
              {errors.type}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="event-subject">과목</label>
          <input
            id="event-subject"
            value={form.subject}
            onChange={(e) => onChange('subject', e.target.value)}
          />
          {errors.subject && (
            <p className="field-error" role="alert">
              {errors.subject}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="event-title">제목</label>
          <input
            id="event-title"
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
          />
          {errors.title && (
            <p className="field-error" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="event-date">날짜</label>
          <input
            id="event-date"
            type="date"
            value={form.date}
            onChange={(e) => onChange('date', e.target.value)}
          />
          {errors.date && (
            <p className="field-error" role="alert">
              {errors.date}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="event-memo">메모</label>
          <textarea
            id="event-memo"
            value={form.memo}
            onChange={(e) => onChange('memo', e.target.value)}
          />
        </div>

        <button className="primary-btn" type="submit">
          일정 저장
        </button>
      </form>
    </section>
  )
}
