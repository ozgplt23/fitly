import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { exercises as library } from '../../data/exercises'

const inputClass =
  'w-full bg-bg border border-line rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none'

export default function ExerciseSelector({ items, onChange, weightUnit = 'kg', error }) {
  const [selectedId, setSelectedId] = useState('')

  const addExercise = () => {
    const found = library.find((e) => e.id === selectedId)
    if (!found) return
    onChange([
      ...items,
      {
        exerciseId: found.id,
        sets: found.recommended.sets,
        reps: found.recommended.note ? 1 : found.recommended.reps,
        weight: 0,
      },
    ])
    setSelectedId('')
  }

  const updateItem = (index, field, value) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeItem = (index) => onChange(items.filter((_, i) => i !== index))

  return (
    <div>
      <label className="block text-sm font-medium mb-2" htmlFor="exercise-select">
        Egzersiz ekle
      </label>
      <div className="flex gap-2">
        <select
          id="exercise-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="flex-1 bg-bg border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">Kütüphaneden seç...</option>
          {library.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.muscleGroup})
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addExercise}
          disabled={!selectedId}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-bg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Ekle
        </button>
      </div>

      {error && (
        <p className="text-danger text-sm mt-2" role="alert">
          {error}
        </p>
      )}

      {items.length > 0 && (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => {
            const info = library.find((e) => e.id === item.exerciseId)
            return (
              <li key={`${item.exerciseId}-${index}`} className="bg-surface rounded-xl p-3">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-semibold text-sm">
                    {info ? info.name : 'Silinmiş egzersiz'}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10"
                    aria-label={`${info?.name || 'Egzersiz'} egzersizini çıkar`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="text-xs text-muted">
                    Set
                    <input
                      type="number"
                      min="1"
                      value={item.sets}
                      onChange={(e) => updateItem(index, 'sets', e.target.value)}
                      className={`${inputClass} mt-1`}
                    />
                  </label>
                  <label className="text-xs text-muted">
                    Tekrar
                    <input
                      type="number"
                      min="1"
                      value={item.reps}
                      onChange={(e) => updateItem(index, 'reps', e.target.value)}
                      className={`${inputClass} mt-1`}
                    />
                  </label>
                  <label className="text-xs text-muted">
                    Ağırlık ({weightUnit})
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={item.weight}
                      onChange={(e) => updateItem(index, 'weight', e.target.value)}
                      className={`${inputClass} mt-1`}
                    />
                  </label>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
