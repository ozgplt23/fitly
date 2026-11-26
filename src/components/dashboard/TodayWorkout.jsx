import { Link } from 'react-router-dom'
import { CalendarCheck, CheckCircle2, Dumbbell } from 'lucide-react'
import Button from '../common/Button'

export default function TodayWorkout({ workouts, onComplete }) {
  // Önce tamamlanmamış antrenmanı göster
  const main = workouts.find((w) => !w.completed) || workouts[0]
  const extra = workouts.length - 1

  return (
    <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="today-title">
      <h2 id="today-title" className="flex items-center gap-2 text-lg font-bold">
        <CalendarCheck className="w-5 h-5 text-accent" aria-hidden="true" />
        Bugünkü antrenman
      </h2>

      {!main ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted">Bugün için planlanmış antrenman yok.</p>
          <Link
            to="/workouts"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-accent text-bg text-sm font-semibold hover:opacity-90"
          >
            <Dumbbell className="w-4 h-4" aria-hidden="true" />
            Antrenman planla
          </Link>
        </div>
      ) : (
        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-xl">{main.name}</h3>
            <span
              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                main.completed ? 'bg-accent/15 text-accent' : 'bg-warning/15 text-warning'
              }`}
            >
              {main.completed && <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />}
              {main.completed ? 'Tamamlandı' : 'Planlandı'}
            </span>
          </div>
          <p className="text-sm text-muted mt-2">
            {main.category} · {main.exercises.length} hareket
          </p>
          {extra > 0 && (
            <p className="text-xs text-muted mt-1">Bugün {extra} antrenman daha var.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link
              to="/workouts"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-surface border border-line text-sm font-semibold hover:border-accent transition-colors"
            >
              Antrenmanları görüntüle
            </Link>
            {!main.completed && (
              <Button onClick={() => onComplete(main.id)}>
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                Tamamla
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
