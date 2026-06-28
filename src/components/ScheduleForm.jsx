function parseDateParts(value) {
  const matched = /^(\d{0,4})(?:-(\d{0,2}))?(?:-(\d{0,2}))?$/.exec(value ?? '')
  if (!matched) return { year: '', month: '', day: '' }
  return {
    year: matched[1] ?? '',
    month: matched[2] ?? '',
    day: matched[3] ?? '',
  }
}

function toDigits(value, maxLength) {
  const normalized = value
    .replace(/[０-９]/g, (digit) =>
      String.fromCharCode(digit.charCodeAt(0) - 0xfee0),
    )
    .replace(/\D/g, '')
  return normalized.slice(0, maxLength)
}

export default function ScheduleForm({ form, errors, onChange, onSubmit }) {
  const dateParts = parseDateParts(form.date)

  function handleDatePartChange(part, value) {
    const nextParts = { ...dateParts, [part]: value }
    const year = toDigits(nextParts.year, 4)
    const month = toDigits(nextParts.month, 2)
    const day = toDigits(nextParts.day, 2)

    const hasAnyPart = year.length > 0 || month.length > 0 || day.length > 0
    onChange('date', hasAnyPart ? `${year}-${month}-${day}` : '')
  }

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
          <div className="date-input-row" id="event-date">
            <div className="date-part">
              <label htmlFor="event-year">연도</label>
              <input
                id="event-year"
                type="text"
                inputMode="numeric"
                placeholder="YYYY"
                maxLength={4}
                value={dateParts.year}
                onChange={(e) => handleDatePartChange('year', e.target.value)}
              />
            </div>
            <div className="date-part">
              <label htmlFor="event-month">월</label>
              <input
                id="event-month"
                type="text"
                inputMode="numeric"
                placeholder="6"
                maxLength={2}
                value={dateParts.month}
                onChange={(e) => handleDatePartChange('month', e.target.value)}
              />
            </div>
            <div className="date-part">
              <label htmlFor="event-day">일</label>
              <input
                id="event-day"
                type="text"
                inputMode="numeric"
                placeholder="3"
                maxLength={2}
                value={dateParts.day}
                onChange={(e) => handleDatePartChange('day', e.target.value)}
              />
            </div>
          </div>
          <p className="date-help">예: 2026년, 6월, 3일 처럼 입력 가능</p>
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
