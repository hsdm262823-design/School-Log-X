import { useMemo } from 'react'

export default function ProgressPanel({
  progressDraft,
  progress,
  onDraftChange,
  onSave,
}) {
  const subjects = useMemo(() => {
    const set = new Set(['수학', ...Object.keys(progress)])
    return [...set]
  }, [progress])

  return (
    <section>
      <h2>과목별 진행률</h2>
      {subjects.map((subject) => (
        <div key={subject}>
          <label htmlFor={`progress-${subject}`}>{subject} 진행률</label>
          <input
            id={`progress-${subject}`}
            type="number"
            min="0"
            max="100"
            value={progressDraft[subject] ?? ''}
            onChange={(e) => onDraftChange(subject, e.target.value)}
          />
          <button type="button" onClick={() => onSave(subject)}>
            진행률 저장
          </button>
          <p>
            {subject}: {progress[subject] ?? 0}%
          </p>
        </div>
      ))}
    </section>
  )
}
