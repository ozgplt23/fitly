import { useState } from 'react'
import { Droplets, Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import { dateDaysAgo, waterTotalForDate, todayString } from '../../utils/calculations'

const inputClass =
  'bg-bg border border-line rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none'

export default function WaterTracker({ logs, setLogs, goal, generateId }) {
  const [custom, setCustom] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const today = todayString()
  const todayLogs = logs.filter((l) => l.date === today)
  const total = waterTotalForDate(logs, today)
  const percent = Math.min(100, Math.round((total / goal) * 100))

  const addWater = (amount) => {
    setLogs((prev) => [{ id: generateId(), date: today, amount: Number(amount) }, ...prev])
  }

  const handleCustom = (e) => {
    e.preventDefault()
    const value = Number(custom)
    if (!custom || !Number.isFinite(value) || value <= 0) {
      setError('Geçerli ve pozitif bir miktar gir.')
      return
    }
    if (value > 5000) {
      setError('Tek seferde en fazla 5000 ml ekleyebilirsin.')
      return
    }
    addWater(value)
    setCustom('')
    setError('')
  }

  const startEdit = (log) => {
    setEditingId(log.id)
    setEditValue(String(log.amount))
  }

  const saveEdit = () => {
    const value = Number(editValue)
    if (!Number.isFinite(value) || value <= 0 || value > 5000) return
    setLogs((prev) => prev.map((l) => (l.id === editingId ? { ...l, amount: value } : l)))
    setEditingId(null)
  }

  const removeLog = (id) => setLogs((prev) => prev.filter((l) => l.id !== id))

  // Son 7 günün geçmişi
  const history = Array.from({ length: 7 }, (_, i) => {
    const date = dateDaysAgo(i)
    return { date, total: waterTotalForDate(logs, date) }
  })

  return (
    <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="water-title">
      <h2 id="water-title" className="flex items-center gap-2 text-lg font-bold">
        <Droplets className="w-5 h-5 text-accent" aria-hidden="true" />
        Su takibi
      </h2>

      <div className="mt-5">
        <div className="flex items-end justify-between">
          <p className="text-3xl font-extrabold">
            {total} <span className="text-base font-medium text-muted">/ {goal} ml</span>
          </p>
          <p className="text-accent font-bold">%{percent}</p>
        </div>
        <div
          className="h-3 bg-surface rounded-full mt-3 overflow-hidden"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Günlük su hedefi ilerlemesi"
        >
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        {total >= goal && (
          <p className="text-accent text-sm mt-2 font-medium">Günlük hedefe ulaştın!</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Button variant="secondary" onClick={() => addWater(250)}>
          <Plus className="w-4 h-4" aria-hidden="true" /> 250 ml
        </Button>
        <Button variant="secondary" onClick={() => addWater(500)}>
          <Plus className="w-4 h-4" aria-hidden="true" /> 500 ml
        </Button>
      </div>

      <form onSubmit={handleCustom} className="mt-3" noValidate>
        <label htmlFor="custom-water" className="sr-only">
          Özel miktar (ml)
        </label>
        <div className="flex gap-2">
          <input
            id="custom-water"
            type="number"
            min="1"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Özel miktar (ml)"
            className={`${inputClass} flex-1`}
          />
          <Button type="submit">Ekle</Button>
        </div>
        {error && (
          <p className="text-danger text-sm mt-2" role="alert">
            {error}
          </p>
        )}
      </form>

      <h3 className="font-semibold mt-6 mb-3 text-sm text-muted">Bugünkü kayıtlar</h3>
      {todayLogs.length === 0 ? (
        <p className="text-sm text-muted">Bugün henüz su kaydı yok.</p>
      ) : (
        <ul className="space-y-2">
          {todayLogs.map((log) => (
            <li key={log.id} className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2">
              {editingId === log.id ? (
                <>
                  <input
                    type="number"
                    min="1"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    aria-label="Miktarı düzenle"
                    className={`${inputClass} w-24`}
                  />
                  <span className="text-sm text-muted">ml</span>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="ml-auto p-1.5 rounded-lg text-accent hover:bg-accent/10"
                    aria-label="Kaydet"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="p-1.5 rounded-lg text-muted hover:bg-line"
                    aria-label="Vazgeç"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium">{log.amount} ml</span>
                  <button
                    type="button"
                    onClick={() => startEdit(log)}
                    className="ml-auto p-1.5 rounded-lg text-muted hover:text-ink hover:bg-line"
                    aria-label={`${log.amount} ml kaydını düzenle`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLog(log.id)}
                    className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10"
                    aria-label={`${log.amount} ml kaydını sil`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <h3 className="font-semibold mt-6 mb-3 text-sm text-muted">Son 7 gün</h3>
      {logs.length === 0 ? (
        <EmptyState
          icon={Droplets}
          title="Geçmiş yok"
          description="Su ekledikçe geçmişin burada görünecek."
        />
      ) : (
        <ul className="space-y-2">
          {history.map((h) => {
            const pct = Math.min(100, Math.round((h.total / goal) * 100))
            return (
              <li key={h.date} className="flex items-center gap-3 text-sm">
                <span className="w-20 text-muted shrink-0">
                  {new Date(h.date + 'T00:00:00').toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
                <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-16 text-right shrink-0">{h.total} ml</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
