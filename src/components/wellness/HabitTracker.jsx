import { useState } from 'react'
import { ListChecks, Plus } from 'lucide-react'
import Button from '../common/Button'
import Modal from '../common/Modal'
import HabitCard from './HabitCard'
import { suggestedHabits } from '../../data/suggestedHabits'
import { todayString, habitCompletionForDate } from '../../utils/calculations'

export default function HabitTracker({ habits, setHabits, generateId }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)

  const today = todayString()
  const percent = habitCompletionForDate(habits, today)
  const doneCount = habits.filter((h) => h.completedDates.includes(today)).length

  const addHabit = (habitName) => {
    const trimmed = habitName.trim()
    if (!trimmed) {
      setError('Alışkanlık adı boş olamaz.')
      return
    }
    if (habits.some((h) => h.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Bu alışkanlık zaten var.')
      return
    }
    setHabits((prev) => [...prev, { id: generateId(), name: trimmed, completedDates: [] }])
    setName('')
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addHabit(name)
  }

  const toggle = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const has = h.completedDates.includes(today)
        return {
          ...h,
          completedDates: has
            ? h.completedDates.filter((d) => d !== today)
            : [...h.completedDates, today],
        }
      }),
    )
  }

  const rename = (id, newName) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, name: newName } : h)))
  }

  const confirmDelete = () => {
    setHabits((prev) => prev.filter((h) => h.id !== deleting.id))
    setDeleting(null)
  }

  // Henüz eklenmemiş öneriler
  const remainingSuggestions = suggestedHabits.filter(
    (s) => !habits.some((h) => h.name.toLowerCase() === s.toLowerCase()),
  )

  return (
    <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="habit-title">
      <h2 id="habit-title" className="flex items-center gap-2 text-lg font-bold">
        <ListChecks className="w-5 h-5 text-accent" aria-hidden="true" />
        Alışkanlık takibi
      </h2>

      <div className="mt-5">
        <div className="flex items-end justify-between">
          <p className="text-sm text-muted">
            Bugün {doneCount}/{habits.length} tamamlandı
          </p>
          <p className="text-accent font-bold">%{percent}</p>
        </div>
        <div
          className="h-3 bg-surface rounded-full mt-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Günlük alışkanlık tamamlanma yüzdesi"
        >
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5" noValidate>
        <label htmlFor="habit-name" className="sr-only">
          Yeni alışkanlık
        </label>
        <div className="flex gap-2">
          <input
            id="habit-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Yeni alışkanlık ekle"
            className="flex-1 min-w-0 bg-bg border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
          <Button type="submit">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Ekle
          </Button>
        </div>
        {error && (
          <p className="text-danger text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </form>

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {remainingSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addHabit(s)}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface text-muted border border-line hover:text-ink hover:border-accent transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      {habits.length === 0 ? (
        <p className="text-sm text-muted mt-5">
          Henüz alışkanlık yok. Yukarıdan ekle ya da bir öneriye tıkla.
        </p>
      ) : (
        <ul className="space-y-3 mt-5">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              today={today}
              onToggle={toggle}
              onRename={rename}
              onDelete={setDeleting}
            />
          ))}
        </ul>
      )}

      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Alışkanlığı sil"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-muted">
          <strong className="text-ink">{deleting?.name}</strong> alışkanlığı ve tüm geçmişi
          silinecek. Bu işlem geri alınamaz.
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            Vazgeç
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Evet, sil
          </Button>
        </div>
      </Modal>
    </section>
  )
}
