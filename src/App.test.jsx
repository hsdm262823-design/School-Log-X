import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-28T00:00:00.000Z'))
    window.localStorage.clear()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders main heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'School Log X', level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders branded app shell landmarks', () => {
    render(<App />)

    expect(screen.getByRole('main')).toHaveClass('app-shell')
    expect(screen.getByText('School Log X')).toHaveClass('app-title')
    expect(
      screen.getByRole('region', { name: '일정 관리 영역' }),
    ).toBeInTheDocument()
  })

  it('keeps form and calendar controls accessible after card markup update', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: '일정 저장' })).toBeInTheDocument()
    expect(screen.getByLabelText('유형')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '월' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '주' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '일' })).toBeInTheDocument()
    expect(screen.getByText('일정 등록/수정').closest('section')).toHaveClass(
      'panel',
      'panel-form',
    )
    expect(screen.getByLabelText('캘린더 보기 전환')).toHaveClass('segmented-control')
    expect(screen.queryByRole('option', { name: '선택' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('유형')).toHaveValue('assignment')
    expect(screen.getByLabelText('연도')).toHaveValue('2026')
    expect(screen.getByLabelText('월')).toHaveValue('06')
    expect(screen.getByLabelText('일')).toHaveValue('28')
    expect(screen.getByLabelText('연도')).toHaveAttribute('maxLength', '4')
    expect(screen.getByLabelText('월')).toHaveAttribute('maxLength', '2')
    expect(screen.getByLabelText('일')).toHaveAttribute('maxLength', '2')
  })

  it('shows d-day and progress blocks with existing semantics', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: '다가오는 일정 D-day' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '과목별 진행률' })).toBeInTheDocument()
    expect(screen.getByLabelText('수학 진행률')).toBeInTheDocument()
    expect(screen.getByText('다가오는 일정 D-day').closest('section')).toHaveClass(
      'panel',
      'panel-dday',
    )
    expect(screen.getByText('수학 진행률').closest('.progress-card')).toBeInTheDocument()
  })

  it('preserves validation and status announcement behavior', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))

    expect(screen.getByRole('status')).toHaveTextContent('입력값을 확인해주세요.')
    expect(screen.getByText('과목은 필수입니다.')).toBeInTheDocument()
    expect(screen.getByText('과목은 필수입니다.')).toHaveClass('field-error')
  })

  it('shows field errors when required values are missing', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))

    expect(screen.getByText('과목은 필수입니다.')).toBeInTheDocument()
    expect(screen.getByText('제목은 필수입니다.')).toBeInTheDocument()
    expect(screen.queryByText('날짜는 필수입니다.')).not.toBeInTheDocument()
  })

  it('shows generic date error message when date is invalid', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('과목'), { target: { value: '국어' } })
    fireEvent.change(screen.getByLabelText('제목'), { target: { value: '비문학 정리' } })
    fireEvent.change(screen.getByLabelText('연도'), { target: { value: '26' } })
    fireEvent.change(screen.getByLabelText('월'), { target: { value: '06' } })
    fireEvent.change(screen.getByLabelText('일'), { target: { value: '30' } })
    fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))

    expect(screen.queryByText('날짜는 YYYY-MM-DD 형식(연도 4자리)으로 입력해주세요.')).not.toBeInTheDocument()
    expect(screen.getByText('날짜를 확인해주세요.')).toBeInTheDocument()
  })

  it('creates and displays a schedule item', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('유형'), {
      target: { value: 'assignment' },
    })
    fireEvent.change(screen.getByLabelText('과목'), { target: { value: '수학' } })
    fireEvent.change(screen.getByLabelText('제목'), {
      target: { value: '문제집 3단원' },
    })
    fireEvent.change(screen.getByLabelText('연도'), { target: { value: '2026' } })
    fireEvent.change(screen.getByLabelText('월'), { target: { value: '06' } })
    fireEvent.change(screen.getByLabelText('일'), { target: { value: '30' } })
    fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))

    expect(screen.getAllByText(/문제집 3단원/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/D-2/)).toBeInTheDocument()
    expect(screen.getByText((text) => /2026년\s*6월/.test(text))).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('accepts valid date when month/day are entered as single digits', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('과목'), { target: { value: '영어' } })
    fireEvent.change(screen.getByLabelText('제목'), { target: { value: '단어 시험' } })
    fireEvent.change(screen.getByLabelText('연도'), { target: { value: '2026' } })
    fireEvent.change(screen.getByLabelText('월'), { target: { value: '6' } })
    fireEvent.change(screen.getByLabelText('일'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))

    expect(
      screen.queryByText('날짜를 확인해주세요.'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('단어 시험')).toBeInTheDocument()
  })

  it('switches calendar view mode', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '주' }))
    expect(screen.getByRole('heading', { name: '주 캘린더' })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: '주간 일정 달력' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '일' }))
    expect(screen.getByRole('heading', { name: '일 캘린더' })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: '일간 일정 달력' })).toBeInTheDocument()
  })

  it('updates subject progress', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('수학 진행률'), { target: { value: '80' } })
    fireEvent.click(screen.getByRole('button', { name: '진행률 저장' }))

    expect(screen.getByText('수학: 80%')).toBeInTheDocument()
  })
})
