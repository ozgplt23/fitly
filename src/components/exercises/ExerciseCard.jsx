import { Heart, Eye } from 'lucide-react'
import ExerciseImage from './ExerciseImage'

export default function ExerciseCard({ exercise, isFavorite, onToggleFavorite, onOpen }) {
  return (
    <article className="flex flex-col bg-card border border-line rounded-2xl overflow-hidden hover:border-accent/60 transition-colors">
      <div className="relative">
        <ExerciseImage exercise={exercise} className="w-full h-40" />
        <button
          type="button"
          onClick={() => onToggleFavorite(exercise.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-bg/80 backdrop-blur hover:bg-bg"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'fill-accent text-accent' : 'text-ink'}`}
          />
        </button>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-base">{exercise.name}</h3>

        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold">
            {exercise.muscleGroup}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface text-muted text-xs font-medium">
            {exercise.difficulty}
          </span>
        </div>

        <p className="text-sm text-muted mt-3">Ekipman: {exercise.equipment}</p>

        <button
          type="button"
          onClick={() => onOpen(exercise)}
          className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-line text-sm font-semibold hover:border-accent transition-colors"
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
          Detayları gör
        </button>
      </div>
    </article>
  )
}