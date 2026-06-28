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
    <section className="panel panel-progress">
      <h2 className="panel-title">과목별 진행률</h2>
      {subjects.map((subject) => (
        <div key={subject} className="progress-card">
          <label htmlFor={`progress-${subject}`}>{subject} 진행률</label>
          <div className="progress-row">
            <input
              id={`progress-${subject}`}
              type="number"
              min="0"
              max="100"
              value={progressDraft[subject] ?? ''}
              onChange={(e) => onDraftChange(subject, e.target.value)}
            />
            <button className="secondary-btn" type="button" onClick={() => onSave(subject)}>
              진행률 저장
            </button>
          </div>
          <p className="progress-value">
            {subject}: {progress[subject] ?? 0}%
          </p>
        </div>
      ))}
    </section>
  )
}
