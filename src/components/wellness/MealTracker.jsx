import { useState } from 'react'
import { Utensils, Plus, Pencil, Trash2 } from 'lucide-react'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { caloriesForDate, todayString } from '../../utils/calculations'

export const mealCategories = ['Kahvaltı', 'Öğle yemeği', 'Akşam yemeği', 'Ara öğün']

const inputClass =
  'w-full bg-bg border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none'

const emptyForm = () => ({
  name: '',
  category: mealCategories[0],
  calories: '',
  date: todayString(),
  note: '',
})

export default function MealTracker({ meals, setMeals, generateId }) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [errors, setErrors] = useState({})
  const [deleting, setDeleting] = useState(null)

  const today = todayString()
  const todayMeals = meals.filter((m) => m.date === today)
  const totalCalories = caloriesForDate(meals, today)

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm())
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (meal) => {
    setEditing(meal)
    setForm({ ...meal, calories: String(meal.calories) })
    setErrors({})
    setFormOpen(true)
  }

  const closeForm = () => setFormOpen(false)

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Yiyecek adı zorunludur.'
    const cal = Number(form.calories)
    if (form.calories === '' || !Number.isFinite(cal) || cal <= 0) {
      next.calories = 'Kalori pozitif bir sayı olmalı.'
    }
    if (!form.date) next.date = 'Tarih seçmelisin.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = {
      name: form.name.trim(),
      category: form.category,
      calories: Number(form.calories),
      date: form.date,
      note: form.note.trim(),
    }
    if (editing) {
      setMeals((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...data } : m)))
    } else {
      setMeals((prev) => [{ id: generateId(), ...data }, ...prev])
    }
    closeForm()
  }

  const confirmDelete = () => {
    setMeals((prev) => prev.filter((m) => m.id !== deleting.id))
    setDeleting(null)
  }

  return (
    <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="meal-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="meal-title" className="flex items-center gap-2 text-lg font-bold">
          <Utensils className="w-5 h-5 text-accent" aria-hidden="true" />
          Beslenme takibi
        </h2>
        <Button onClick={openNew} className="!px-3 !py-2">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Öğün ekle
        </Button>
      </div>

      <p className="text-3xl font-extrabold mt-5">
        {totalCalories} <span className="text-base font-medium text-muted">kcal bugün</span>
      </p>

      <div className="mt-5 space-y-4">
        {todayMeals.length === 0 ? (
          <p className="text-sm text-muted">Bugün henüz öğün kaydı yok.</p>
        ) : (
          mealCategories.map((cat) => {
            const items = todayMeals.filter((m) => m.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                  {cat}
                </h3>
                <ul className="space-y-2">
                  {items.map((meal) => (
                    <li
                      key={meal.id}
                      className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{meal.name}</p>
                        {meal.note && (
                          <p className="text-xs text-muted truncate">{meal.note}</p>
                        )}
                      </div>
                      <span className="text-sm text-accent font-semibold shrink-0">
                        {meal.calories} kcal
                      </span>
                      <button
                        type="button"
                        onClick={() => openEdit(meal)}
                        className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-line"
                        aria-label={`${meal.name} öğününü düzenle`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(meal)}
                        className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10"
                        aria-label={`${meal.name} öğününü sil`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })
        )}
      </div>

      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editing ? 'Öğünü düzenle' : 'Öğün ekle'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="meal-name" className="block text-sm font-medium mb-2">
              Yiyecek adı
            </label>
            <input
              id="meal-name"
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Örn: Yulaf ezmesi"
              className={inputClass}
            />
            {errors.name && (
              <p className="text-danger text-sm mt-1" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="meal-category" className="block text-sm font-medium mb-2">
                Öğün
              </label>
              <select
                id="meal-category"
                value={form.category}
                onChange={(e) => setField('category', e.target.value)}
                className={inputClass}
              >
                {mealCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="meal-calories" className="block text-sm font-medium mb-2">
                Kalori (kcal)
              </label>
              <input
                id="meal-calories"
                type="number"
                min="1"
                value={form.calories}
                onChange={(e) => setField('calories', e.target.value)}
                className={inputClass}
              />
              {errors.calories && (
                <p className="text-danger text-sm mt-1" role="alert">
                  {errors.calories}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="meal-date" className="block text-sm font-medium mb-2">
              Tarih
            </label>
            <input
              id="meal-date"
              type="date"
              value={form.date}
              onChange={(e) => setField('date', e.target.value)}
              className={inputClass}
            />
            {errors.date && (
              <p className="text-danger text-sm mt-1" role="alert">
                {errors.date}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="meal-note" className="block text-sm font-medium mb-2">
              Açıklama (isteğe bağlı)
            </label>
            <textarea
              id="meal-note"
              rows="2"
              value={form.note}
              onChange={(e) => setField('note', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={closeForm}>
              Vazgeç
            </Button>
            <Button type="submit">{editing ? 'Kaydet' : 'Öğünü ekle'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Öğünü sil"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-muted">
          <strong className="text-ink">{deleting?.name}</strong> öğünü silinecek. Bu işlem geri
          alınamaz.
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
