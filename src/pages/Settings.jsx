import { useState } from 'react'
import { User, Target, Database, RotateCcw, Trash2 } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { defaultSettings } from '../data/defaultSettings'
import { toMl, fromMl } from '../utils/calculations'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'

const inputClass =
  'w-full bg-bg border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none'

const buildForm = (s) => ({
  displayName: s.displayName || '',
  height: s.height === '' || s.height == null ? '' : String(s.height),
  weight: s.weight === '' || s.weight == null ? '' : String(s.weight),
  waterGoal: String(fromMl(Number(s.dailyWaterGoal) || 2500, s.waterUnit)),
  weeklyWorkoutGoal: String(s.weeklyWorkoutGoal),
  weightUnit: s.weightUnit,
  waterUnit: s.waterUnit,
})

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-danger text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Settings() {
  const [stored, setSettings] = useLocalStorage('fitly_settings', defaultSettings)
  const [, setWorkouts] = useLocalStorage('fitly_workouts', [])
  const [, setWater] = useLocalStorage('fitly_water', [])
  const [, setMeals] = useLocalStorage('fitly_meals', [])
  const [, setHabits] = useLocalStorage('fitly_habits', [])
  const [, setFavorites] = useLocalStorage('fitly_favorites', [])
  const [, setWeights] = useLocalStorage('fitly_weight_records', [])

  const settings = { ...defaultSettings, ...stored }
  const [form, setForm] = useState(() => buildForm(settings))
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }

  // Birim değişince girilen su hedefini yeni birime çevirir
  const changeWaterUnit = (newUnit) => {
    const ml = toMl(form.waterGoal, form.waterUnit)
    setForm((prev) => ({
      ...prev,
      waterUnit: newUnit,
      waterGoal: ml > 0 ? String(fromMl(ml, newUnit)) : prev.waterGoal,
    }))
  }

  const validate = () => {
    const next = {}
    const name = form.displayName.trim()
    if (!name) next.displayName = 'Görünen isim zorunludur.'
    else if (name.length > 30) next.displayName = 'En fazla 30 karakter olabilir.'

    if (form.height !== '') {
      const h = Number(form.height)
      if (!Number.isFinite(h) || h < 50 || h > 250) next.height = 'Boy 50 ile 250 cm arasında olmalı.'
    }
    if (form.weight !== '') {
      const w = Number(form.weight)
      if (!Number.isFinite(w) || w <= 0 || w > 500) next.weight = 'Geçerli ve pozitif bir kilo gir.'
    }

    const goalMl = toMl(form.waterGoal, form.waterUnit)
    if (!(Number(form.waterGoal) > 0) || goalMl < 500 || goalMl > 10000) {
      next.waterGoal = 'Su hedefi 500 ml ile 10 L arasında olmalı.'
    }

    const wk = Number(form.weeklyWorkoutGoal)
    if (!Number.isInteger(wk) || wk < 1 || wk > 14) {
      next.weeklyWorkoutGoal = '1 ile 14 arasında tam sayı gir.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSettings({
      displayName: form.displayName.trim(),
      height: form.height === '' ? '' : Number(form.height),
      weight: form.weight === '' ? '' : Number(form.weight),
      dailyWaterGoal: toMl(form.waterGoal, form.waterUnit),
      weeklyWorkoutGoal: Number(form.weeklyWorkoutGoal),
      weightUnit: form.weightUnit,
      waterUnit: form.waterUnit,
    })
    showMessage('Ayarların kaydedildi.')
  }

  const resetPreferences = () => {
    setSettings(defaultSettings)
    setForm(buildForm(defaultSettings))
    setErrors({})
    showMessage('Tercihler varsayılana döndürüldü.')
  }

  const clearAllData = () => {
    setWorkouts([])
    setWater([])
    setMeals([])
    setHabits([])
    setFavorites([])
    setWeights([])
    setConfirmClear(false)
    showMessage('Tüm uygulama verileri silindi.')
  }

  return (
    <div className="max-w-3xl space-y-6">
      {message && (
        <div
          role="status"
          className="bg-accent/15 border border-accent/30 text-accent text-sm font-medium rounded-xl px-4 py-3"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSave} noValidate className="space-y-6">
        <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="personal-title">
          <h2 id="personal-title" className="flex items-center gap-2 text-lg font-bold">
            <User className="w-5 h-5 text-accent" aria-hidden="true" />
            Kişisel bilgiler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="sm:col-span-2">
              <Field id="s-name" label="Görünen isim" error={errors.displayName}>
                <input
                  id="s-name"
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setField('displayName', e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field id="s-height" label="Boy (cm)" error={errors.height}>
              <input
                id="s-height"
                type="number"
                value={form.height}
                onChange={(e) => setField('height', e.target.value)}
                placeholder="Örn: 170"
                className={inputClass}
              />
            </Field>
            <Field id="s-weight" label={`Güncel kilo (${form.weightUnit})`} error={errors.weight}>
              <input
                id="s-weight"
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setField('weight', e.target.value)}
                placeholder="Örn: 65"
                className={inputClass}
              />
            </Field>
          </div>
        </section>

        <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="fitness-title">
          <h2 id="fitness-title" className="flex items-center gap-2 text-lg font-bold">
            <Target className="w-5 h-5 text-accent" aria-hidden="true" />
            Fitness tercihleri
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <Field
              id="s-water"
              label={`Günlük su hedefi (${form.waterUnit})`}
              error={errors.waterGoal}
            >
              <input
                id="s-water"
                type="number"
                step={form.waterUnit === 'L' ? '0.1' : '50'}
                value={form.waterGoal}
                onChange={(e) => setField('waterGoal', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field
              id="s-weekly"
              label="Haftalık antrenman hedefi"
              error={errors.weeklyWorkoutGoal}
            >
              <input
                id="s-weekly"
                type="number"
                min="1"
                value={form.weeklyWorkoutGoal}
                onChange={(e) => setField('weeklyWorkoutGoal', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="s-wunit" label="Ağırlık birimi">
              <select
                id="s-wunit"
                value={form.weightUnit}
                onChange={(e) => setField('weightUnit', e.target.value)}
                className={inputClass}
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="lb">Pound (lb)</option>
              </select>
            </Field>
            <Field id="s-vunit" label="Su birimi">
              <select
                id="s-vunit"
                value={form.waterUnit}
                onChange={(e) => changeWaterUnit(e.target.value)}
                className={inputClass}
              >
                <option value="ml">Mililitre (ml)</option>
                <option value="L">Litre (L)</option>
              </select>
            </Field>
          </div>
          <p className="text-xs text-muted mt-4">
            Not: Ağırlık birimi yalnızca etiketleri değiştirir, daha önce girdiğin değerler
            otomatik dönüştürülmez.
          </p>
          <div className="flex justify-end mt-5">
            <Button type="submit">Ayarları kaydet</Button>
          </div>
        </section>
      </form>

      <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="data-title">
        <h2 id="data-title" className="flex items-center gap-2 text-lg font-bold">
          <Database className="w-5 h-5 text-accent" aria-hidden="true" />
          Veri yönetimi
        </h2>
        <p className="text-sm text-muted mt-2">
          Verilerin yalnızca bu tarayıcıda saklanır. Silinen veriler geri getirilemez.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <Button variant="secondary" onClick={resetPreferences}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Tercihleri sıfırla
          </Button>
          <Button variant="danger" onClick={() => setConfirmClear(true)}>
            <Trash2 className="w-4 h-4" aria-hidden="true" />
            Tüm verileri temizle
          </Button>
        </div>
      </section>

      <Modal
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Tüm verileri temizle"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-muted">
          Antrenmanlar, su, öğün, alışkanlık, favori ve kilo kayıtların kalıcı olarak silinecek.
          Ayarların korunur. Bu işlem geri alınamaz.
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setConfirmClear(false)}>
            Vazgeç
          </Button>
          <Button variant="danger" onClick={clearAllData}>
            Evet, hepsini sil
          </Button>
        </div>
      </Modal>
    </div>
  )
}
