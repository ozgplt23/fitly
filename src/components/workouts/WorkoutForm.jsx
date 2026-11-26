import { useState } from 'react'
import Button from '../common/Button'
import ExerciseSelector from './ExerciseSelector'
import { workoutCategories } from '../../data/workoutCategories'
import { todayString } from '../../utils/calculations'

const inputClass =
  'w-full bg-bg border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none'

export default function WorkoutForm({ initialData, weightUnit, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initialData || {
      name: '',
      category: workoutCategories[0],
      date: todayString(),
      exercises: [],
    },
  )
  const [errors, setErrors] = useState({})

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Antrenman adı zorunludur.'
    if (!form.date) next.date = 'Tarih seçmelisin.'
    if (form.exercises.length === 0) {
      next.exercises = 'En az bir egzersiz eklemelisin.'
    } else {
      const invalid = form.exercises.some(
        (e) =>
          !(Number(e.sets) > 0) ||
          !(Number(e.reps) > 0) ||
          Number(e.weight) < 0 ||
          e.weight === '',
      )
      if (invalid) {
        next.exercises = 'Set ve tekrar sayısı 0\'dan büyük, ağırlık negatif olmayan bir sayı olmalı.'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      exercises: form.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        sets: Number(ex.sets),
        reps: Number(ex.reps),
        weight: Number(ex.weight),
      })),
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="workout-name" className="block text-sm font-medium mb-2">
          Antrenman adı
        </label>
        <input
          id="workout-name"
          type="text"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Örn: Bacak Günü"
          className={inputClass}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-danger text-sm mt-1" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="workout-category" className="block text-sm font-medium mb-2">
            Kategori
          </label>
          <select
            id="workout-category"
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
            className={inputClass}
          >
            {workoutCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="workout-date" className="block text-sm font-medium mb-2">
            Tarih
          </label>
          <input
            id="workout-date"
            type="date"
            value={form.date}
            onChange={(e) => setField('date', e.target.value)}
            className={inputClass}
            aria-invalid={!!errors.date}
          />
          {errors.date && (
            <p className="text-danger text-sm mt-1" role="alert">
              {errors.date}
            </p>
          )}
        </div>
      </div>

      <ExerciseSelector
        items={form.exercises}
        onChange={(items) => setField('exercises', items)}
        weightUnit={weightUnit}
        error={errors.exercises}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button type="submit">{initialData ? 'Değişiklikleri kaydet' : 'Antrenmanı oluştur'}</Button>
      </div>
    </form>
  )
}
