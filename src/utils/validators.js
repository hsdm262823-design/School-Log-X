export function normalizeDateInput(value) {
  const matched = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value ?? '')
  if (!matched) return null

  const year = matched[1]
  const month = Number(matched[2])
  const day = Number(matched[3])

  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function validateEventInput(input) {
  const errors = {}

  if (!input.subject?.trim()) errors.subject = '과목은 필수입니다.'
  if (!input.title?.trim()) errors.title = '제목은 필수입니다.'
  if (!input.date) {
    errors.date = '날짜는 필수입니다.'
  } else if (!normalizeDateInput(input.date)) {
    errors.date = '날짜를 확인해주세요.'
  }

  return errors
}

export function validateProgress(value) {
  if (Number.isNaN(value) || value < 0 || value > 100) {
    return '진행률은 0~100 사이여야 합니다.'
  }
  return null
}
