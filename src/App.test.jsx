import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders required landing UI text', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'School Log X', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('학생을 위한 아주 간단한 시작 페이지입니다.'),
    ).toBeInTheDocument()
    expect(screen.getByText('상태: 배포 준비 완료')).toBeInTheDocument()
  })
})
