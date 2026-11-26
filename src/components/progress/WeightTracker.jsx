import { useState } from 'react'
import { Scale, Plus, Trash2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import Button from '../common/Button'
import Modal from '../common/Modal'
import { todayString, formatDate, generateId } from '../../utils/calculations'

const inputClass =
  'w-full bg-bg border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none'

const shortDate = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })

export default function WeightTracker({ records, setRecords, unit }) {
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(todayString())
  const [errors, setErrors] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [message, setMessage] = useState(null)

  const sorted = [...records].sort((a, b) => (a.date < b.date ? -1 : 1))
  const recent = [...sorted].reverse().slice(0, 5)
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const diff = sorted.length >= 2 ? Number((last.weight - first.weight).toFixed(1)) : null

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = {}
    const value = Number(weight)
    if (weight === '' || !Number.isFinite(value) || value <= 0 || value > 500) {
      next.weight = 'Geçerli ve pozitif bir kilo gir.'
    }
    if (!date) next.date = 'Tarih seçmelisin.'
    else if (date > todayString()) next.date = 'Gelecek bir tarih giremezsin.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const exists = records.some((r) => r.date === date)
    if (exists) {
      setRecords((prev) => prev.map((r) => (r.date === date ? { ...r, weight: value } : r)))
    } else {
      setRecords((prev) => [{ id: generateId(), date, weight: value }, ...prev])
    }
    setMessage(exists ? 'O günün kaydı güncellendi.' : 'Kilo kaydı eklendi.')
    setTimeout(() => setMessage(null), 3000)
    setWeight('')
  }

  const confirmDelete = () => {
    setRecords((prev) => prev.filter((r) => r.id !== deleting.id))
    setDeleting(null)
  }

  const chartData = sorted.map((r) => ({ label: shortDate(r.date), weight: r.weight }))

  return (
    <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="weight-title">
      <h2 id="weight-title" className="flex items-center gap-2 text-lg font-bold">
        <Scale className="w-5 h-5 text-accent" aria-hidden="true" />
        Kilo takibi
      </h2>

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 mt-5 items-start">
        <div>
          <label htmlFor="w-weight" className="sr-only">
            Kilo ({unit})
          </label>
          <input
            id="w-weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={`Kilo (${unit})`}
            className={inputClass}
          />
          {errors.weight && (
            <p className="text-danger text-sm mt-1" role="alert">
              {errors.weight}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="w-date" className="sr-only">
            Tarih
          </label>
          <input
            id="w-date"
            type="date"
            max={todayString()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
          {errors.date && (
            <p className="text-danger text-sm mt-1" role="alert">
              {errors.date}
            </p>
          )}
        </div>
        <Button type="submit">
          <Plus className="w-4 h-4" aria-hidden="true" />
          Kaydet
        </Button>
      </form>

      {message && (
        <p role="status" className="text-accent text-sm font-medium mt-3">
          {message}
        </p>
      )}

      {records.length === 0 ? (
        <p className="text-sm text-muted mt-6 py-10 text-center bg-surface rounded-xl">
          Henüz kilo kaydı yok. Gelişimini görmek için yukarıdan kilonu ekle.
        </p>
      ) : (
        <>
          {sorted.length < 2 ? (
            <p className="text-sm text-muted mt-6 py-10 text-center bg-surface rounded-xl">
              Grafik için en az 2 kayıt gerekli. Şu an {sorted.length} kayıt var, farklı bir güne
              ait bir kayıt daha ekle.
            </p>
          ) : (
            <>
              <p className="text-sm mt-5">
                Son kilo: <strong>{last.weight} {unit}</strong>
                {diff !== null && (
                  <span className="text-muted">
                    {' '}
                    · İlk kayıttan bu yana {diff > 0 ? '+' : ''}
                    {diff} {unit}
                  </span>
                )}
              </p>
              <div className="h-60 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="#303835" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" stroke="#AAB3AD" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis
                      stroke="#AAB3AD"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      domain={[(min) => Math.floor(min - 1), (max) => Math.ceil(max + 1)]}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#252B29',
                        border: '1px solid #303835',
                        borderRadius: 12,
                        color: '#F1F3F0',
                      }}
                      formatter={(value) => [`${value} ${unit}`, 'Kilo']}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#A3F36B"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#A3F36B' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          <h3 className="font-semibold mt-6 mb-3 text-sm text-muted">Son kayıtlar</h3>
          <ul className="space-y-2">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center gap-3 bg-surface rounded-xl px-3 py-2.5">
                <span className="text-sm font-semibold">
                  {r.weight} {unit}
                </span>
                <span className="text-xs text-muted">{formatDate(r.date)}</span>
                <button
                  type="button"
                  onClick={() => setDeleting(r)}
                  className="ml-auto p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10"
                  aria-label={`${formatDate(r.date)} kilo kaydını sil`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Kilo kaydını sil"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-muted">
          {deleting && `${formatDate(deleting.date)} tarihli ${deleting.weight} ${unit} kaydı silinecek.`}{' '}
          Bu işlem geri alınamaz.
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
