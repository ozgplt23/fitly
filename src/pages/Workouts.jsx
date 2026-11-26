import { useState, useMemo } from 'react'
import { Plus, Dumbbell, SearchX } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { defaultSettings } from '../data/defaultSettings'
import { workoutCategories } from '../data/workoutCategories'
import { generateId, todayString } from '../utils/calculations'
import WorkoutCard from '../components/workouts/WorkoutCard'
import WorkoutForm from '../components/workouts/WorkoutForm'
import WorkoutDetail from '../components/workouts/WorkoutDetail'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'

const statusFilters = [
  { value: 'all', label: 'Tümü' },
  { value: 'planned', label: 'Planlananlar' },
  { value: 'completed', label: 'Tamamlananlar' },
]

export default function Workouts() {
  const [workouts, setWorkouts] = useLocalStorage('fitly_workouts', [])
  const [settings] = useLocalStorage('fitly_settings', defaultSettings)

  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('Tümü')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null) // düzenlenen antrenman (null = yeni)
  const [viewingId, setViewingId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [message, setMessage] = useState(null)

  const showMessage = (text) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 3000)
  }

  // ---- EKLE ve GÜNCELLE ----
  const handleSave = (data) => {
    if (editing) {
      setWorkouts((prev) =>
        prev.map((w) => (w.id === editing.id ? { ...w, ...data } : w)),
      )
      showMessage('Antrenman güncellendi.')
    } else {
      setWorkouts((prev) => [
        { id: generateId(), completed: false, completedAt: null, ...data },
        ...prev,
      ])
      showMessage('Antrenman oluşturuldu.')
    }
    closeForm()
  }

  // ---- SİL ----
  const confirmDelete = () => {
    setWorkouts((prev) => prev.filter((w) => w.id !== deleting.id))
    setDeleting(null)
    showMessage('Antrenman silindi.')
  }

  // ---- TAMAMLA ----
  const toggleComplete = (id) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              completed: !w.completed,
              completedAt: w.completed ? null : todayString(),
            }
          : w,
      ),
    )
  }

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (workout) => {
    setEditing(workout)
    setFormOpen(true)
  }
  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  // ---- LİSTELE (filtreli) ----
  const filtered = useMemo(
    () =>
      workouts.filter((w) => {
        if (status === 'planned' && w.completed) return false
        if (status === 'completed' && !w.completed) return false
        if (category !== 'Tümü' && w.category !== category) return false
        return true
      }),
    [workouts, status, category],
  )

  // Detay penceresi her zaman güncel veriyi göstersin diye ID ile bulunur
  const viewing = workouts.find((w) => w.id === viewingId) || null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-muted text-sm">
          {workouts.length} antrenman · {workouts.filter((w) => w.completed).length} tamamlandı
        </p>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          Yeni antrenman
        </Button>
      </div>

      {message && (
        <div
          role="status"
          className="bg-accent/15 border border-accent/30 text-accent text-sm font-medium rounded-xl px-4 py-3"
        >
          {message}
        </div>
      )}

      {workouts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatus(f.value)}
                aria-pressed={status === f.value}
                className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  status === f.value
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-card text-muted border-line hover:text-ink hover:border-accent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Kategoriye göre filtrele"
            className="sm:ml-auto bg-card border border-line rounded-xl px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="Tümü">Tüm kategoriler</option>
            {workoutCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {workouts.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="Henüz antrenman yok"
          description="İlk antrenman programını oluştur ve egzersiz kütüphanesinden hareketleri ekle."
          action={<Button onClick={openNew}>İlk antrenmanı oluştur</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Sonuç bulunamadı"
          description="Seçtiğin filtrelere uyan antrenman yok."
          action={
            <Button
              onClick={() => {
                setStatus('all')
                setCategory('Tümü')
              }}
            >
              Filtreleri temizle
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onView={(w) => setViewingId(w.id)}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      {/* Ekle / Düzenle penceresi */}
      <Modal
        isOpen={formOpen}
        onClose={closeForm}
        title={editing ? 'Antrenmanı düzenle' : 'Yeni antrenman'}
        maxWidth="max-w-2xl"
      >
        <WorkoutForm
          key={editing ? editing.id : 'new'}
          initialData={editing}
          weightUnit={settings.weightUnit}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      </Modal>

      {/* Detay penceresi */}
      <WorkoutDetail
        workout={viewing}
        weightUnit={settings.weightUnit}
        onClose={() => setViewingId(null)}
        onToggleComplete={toggleComplete}
      />

      {/* Silme onayı */}
      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Antrenmanı sil"
        maxWidth="max-w-md"
      >
        <p className="text-sm text-muted">
          <strong className="text-ink">{deleting?.name}</strong> antrenmanı kalıcı olarak
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
    </div>
  )
}
