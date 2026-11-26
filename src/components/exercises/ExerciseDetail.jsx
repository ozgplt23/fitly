import { Heart, Plus, AlertTriangle, ListChecks } from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import ExerciseImage from './ExerciseImage'

export default function ExerciseDetail({
  exercise,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToWorkout,
}) {
  if (!exercise) return null

  const { recommended } = exercise
  const recommendedText = recommended.note
    ? `${recommended.sets} set × ${recommended.note}`
    : `${recommended.sets} set × ${recommended.reps} tekrar`

  return (
    <Modal isOpen={!!exercise} onClose={onClose} title={exercise.name} maxWidth="max-w-3xl">
      <ExerciseImage exercise={exercise} className="w-full h-56 sm:h-72 rounded-xl" />

      <dl className="grid grid-cols-2 gap-3 mt-5">
        <div className="bg-surface rounded-xl p-3">
          <dt className="text-xs text-muted">Ana kas grubu</dt>
          <dd className="font-semibold mt-1">{exercise.muscleGroup}</dd>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <dt className="text-xs text-muted">Zorluk</dt>
          <dd className="font-semibold mt-1">{exercise.difficulty}</dd>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <dt className="text-xs text-muted">Ekipman</dt>
          <dd className="font-semibold mt-1">{exercise.equipment}</dd>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <dt className="text-xs text-muted">Önerilen</dt>
          <dd className="font-semibold mt-1">{recommendedText}</dd>
        </div>
      </dl>

      <div className="mt-4">
        <p className="text-xs text-muted mb-2">Yardımcı kas grupları</p>
        {exercise.secondaryMuscles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {exercise.secondaryMuscles.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-full bg-surface text-sm text-ink"
              >
                {m}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Belirgin yardımcı kas yok.</p>
        )}
      </div>

      <section className="mt-6">
        <h3 className="flex items-center gap-2 font-bold mb-3">
          <ListChecks className="w-5 h-5 text-accent" aria-hidden="true" />
          Nasıl yapılır?
        </h3>
        <ol className="space-y-3">
          {exercise.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="shrink-0 w-6 h-6 rounded-full bg-accent text-bg text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6">
        <h3 className="flex items-center gap-2 font-bold mb-3">
          <AlertTriangle className="w-5 h-5 text-warning" aria-hidden="true" />
          Sık yapılan hatalar
        </h3>
        <ul className="space-y-2">
          {exercise.mistakes.map((m, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted">
              <span className="text-warning">•</span>
              {m}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        {onAddToWorkout && (
          <Button onClick={() => onAddToWorkout(exercise)} className="flex-1">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Antrenmana ekle
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() => onToggleFavorite(exercise.id)}
          className="flex-1"
          aria-pressed={isFavorite}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-accent text-accent' : ''}`}
            aria-hidden="true"
          />
          {isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        </Button>
      </div>
    </Modal>
  )
}