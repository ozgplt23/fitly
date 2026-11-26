import { useState } from 'react'
import { Dumbbell } from 'lucide-react'

export default function ExerciseImage({ exercise, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (exercise.image && !failed) {
    return (
      <img
        src={exercise.image}
        alt={`${exercise.name} hareket görseli`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-surface ${className}`}
      role="img"
      aria-label={`${exercise.name} için görsel yok`}
    >
      <Dumbbell className="w-10 h-10 text-accent" aria-hidden="true" />
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
        {exercise.muscleGroup}
      </span>
    </div>
  )
}