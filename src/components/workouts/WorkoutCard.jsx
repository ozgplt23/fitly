import { Pencil, Trash2, Eye, CheckCircle2, CalendarDays, Dumbbell } from 'lucide-react'
import { formatDate } from '../../utils/calculations'

export default function WorkoutCard({ workout, onView, onEdit, onDelete }) {
  const done = workout.completed

  return (
    <article className="flex flex-col bg-card border border-line rounded-2xl p-5 hover:border-accent/60 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-lg leading-snug">{workout.name}</h3>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            done ? 'bg-accent/15 text-accent' : 'bg-warning/15 text-warning'
          }`}
        >
          {done && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
          {done ? 'Tamamlandı' : 'Planlandı'}
        </span>
      </div>

      <span className="self-start mt-3 px-2.5 py-1 rounded-full bg-surface text-muted text-xs font-medium">
        {workout.category}
      </span>

      <div className="mt-4 space-y-2 text-sm text-muted">
        <p className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" aria-hidden="true" />
          {formatDate(workout.date)}
        </p>
        <p className="flex items-center gap-2">
          <Dumbbell className="w-4 h-4" aria-hidden="true" />
          {workout.exercises.length} hareket
        </p>
      </div>

      <div className="flex gap-2 mt-5 pt-4 border-t border-line">
        <button
          type="button"
          onClick={() => onView(workout)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-surface text-sm font-semibold hover:bg-line transition-colors"
        >
          <Eye className="w-4 h-4" aria-hidden="true" />
          Detay
        </button>
        <button
          type="button"
          onClick={() => onEdit(workout)}
          className="p-2.5 rounded-xl bg-surface text-muted hover:text-ink hover:bg-line transition-colors"
          aria-label={`${workout.name} antrenmanını düzenle`}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(workout)}
          className="p-2.5 rounded-xl bg-surface text-muted hover:text-danger hover:bg-danger/10 transition-colors"
          aria-label={`${workout.name} antrenmanını sil`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  )
}
