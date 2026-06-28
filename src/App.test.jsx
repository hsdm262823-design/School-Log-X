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
    expect(screen.getByText('유형은 필수입니다.')).toBeInTheDocument()
    expect(screen.getByText('유형은 필수입니다.')).toHaveClass('field-error')
  })

  it('shows field errors when required values are missing', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))

    expect(screen.getByText('유형은 필수입니다.')).toBeInTheDocument()
    expect(screen.getByText('과목은 필수입니다.')).toBeInTheDocument()
    expect(screen.getByText('제목은 필수입니다.')).toBeInTheDocument()
    expect(screen.getByText('날짜는 필수입니다.')).toBeInTheDocument()
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
    fireEvent.change(screen.getByLabelText('날짜'), { target: { value: '2026-06-30' } })
    fireEvent.click(screen.getByRole('button', { name: '일정 저장' }))

    expect(screen.getAllByText(/문제집 3단원/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/2026-06-30/)).toBeInTheDocument()
    expect(screen.getByText(/D-2/)).toBeInTheDocument()
  })

  it('switches calendar view mode', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: '주' }))
    expect(screen.getByRole('heading', { name: '주 캘린더' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '일' }))
    expect(screen.getByRole('heading', { name: '일 캘린더' })).toBeInTheDocument()
  })

  it('updates subject progress', () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText('수학 진행률'), { target: { value: '80' } })
    fireEvent.click(screen.getByRole('button', { name: '진행률 저장' }))

    expect(screen.getByText('수학: 80%')).toBeInTheDocument()
  })
})
