import { CheckCircle2, Clock, Undo2 } from 'lucide-react'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { exercises as library } from '../../data/exercises'
import { estimateDuration, formatDate } from '../../utils/calculations'

export default function WorkoutDetail({ workout, weightUnit, onClose, onToggleComplete }) {
  if (!workout) return null

  return (
    <Modal isOpen={!!workout} onClose={onClose} title={workout.name} maxWidth="max-w-2xl">
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="px-2.5 py-1 rounded-full bg-surface text-sm">{workout.category}</span>
        <span className="px-2.5 py-1 rounded-full bg-surface text-sm">
          {formatDate(workout.date)}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface text-sm">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          Tahmini {estimateDuration(workout.exercises)} dk
        </span>
      </div>

      <div
        className={`rounded-xl p-3 mb-5 text-sm font-medium ${
          workout.completed ? 'bg-accent/15 text-accent' : 'bg-warning/15 text-warning'
        }`}
      >
        {workout.completed
          ? `Tamamlandı: ${formatDate(workout.completedAt)}`
          : 'Bu antrenman henüz tamamlanmadı.'}
      </div>

      <ul className="space-y-3">
        {workout.exercises.map((item, index) => {
          const info = library.find((e) => e.id === item.exerciseId)
          return (
            <li key={`${item.exerciseId}-${index}`} className="bg-surface rounded-xl p-4">
              <p className="font-semibold">{info ? info.name : 'Silinmiş egzersiz'}</p>
              <p className="text-sm text-muted mt-1">
                {item.sets} set × {item.reps} tekrar
                {item.weight > 0 ? ` · ${item.weight} ${weightUnit}` : ' · Vücut ağırlığı'}
              </p>
            </li>
          )
        })}
      </ul>

      <div className="mt-6">
        {workout.completed ? (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onToggleComplete(workout.id)}
          >
            <Undo2 className="w-4 h-4" aria-hidden="true" />
            Tamamlandı işaretini kaldır
          </Button>
        ) : (
          <Button className="w-full" onClick={() => onToggleComplete(workout.id)}>
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Antrenmanı tamamla
          </Button>
        )}
      </div>
    </Modal>
  )
}
