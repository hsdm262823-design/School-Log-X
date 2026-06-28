export function validateEventInput(input) {
  const errors = {}

  if (!input.type) errors.type = '유형은 필수입니다.'
  if (!input.subject?.trim()) errors.subject = '과목은 필수입니다.'
  if (!input.title?.trim()) errors.title = '제목은 필수입니다.'
  if (!input.date) errors.date = '날짜는 필수입니다.'

  return errors
}

export function validateProgress(value) {
  if (Number.isNaN(value) || value < 0 || value > 100) {
    return '진행률은 0~100 사이여야 합니다.'
  }
  return null
}
