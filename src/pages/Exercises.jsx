import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { exercises } from '../data/exercises'
import useLocalStorage from '../hooks/useLocalStorage'
import { generateId, todayString } from '../utils/calculations'
import ExerciseSearch from '../components/exercises/ExerciseSearch'
import ExerciseFilter from '../components/exercises/ExerciseFilter'
import ExerciseCard from '../components/exercises/ExerciseCard'
import ExerciseDetail from '../components/exercises/ExerciseDetail'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'

const defaultFilters = {
  muscle: 'Tümü',
  difficulty: 'Tümü',
  equipment: 'Tümü',
  onlyFavorites: false,
}

// Türkçe karakterlerden bağımsız arama için metni sadeleştirir
const normalize = (text) => text.toLocaleLowerCase('tr-TR').trim()

export default function Exercises() {
  const [favorites, setFavorites] = useLocalStorage('fitly_favorites', [])
  const [workouts, setWorkouts] = useLocalStorage('fitly_workouts', [])
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [selected, setSelected] = useState(null)

  const updateFilters = (changes) => setFilters((prev) => ({ ...prev, ...changes }))

  const resetAll = () => {
    setQuery('')
    setFilters(defaultFilters)
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    )
  }

  // Seçilen egzersizi en yakın planlanmış antrenmana ekler.
  // Planlanmış antrenman yoksa yeni bir antrenman oluşturur.
  const addToWorkout = (exercise) => {
    const item = {
      exerciseId: exercise.id,
      sets: exercise.recommended.sets,
      reps: exercise.recommended.note ? 1 : exercise.recommended.reps,
      weight: 0,
    }
    const planned = workouts.find((w) => !w.completed)

    if (planned) {
      setWorkouts((prev) =>
        prev.map((w) =>
          w.id === planned.id ? { ...w, exercises: [...w.exercises, item] } : w,
        ),
      )
    } else {
      setWorkouts((prev) => [
        {
          id: generateId(),
          name: 'Yeni Antrenman',
          category: 'Tüm vücut',
          date: todayString(),
          exercises: [item],
          completed: false,
          completedAt: null,
        },
        ...prev,
      ])
    }
    setSelected(null)
    navigate('/workouts')
  }

  const filtered = useMemo(() => {
    const q = normalize(query)
    return exercises.filter((e) => {
      if (q && !normalize(e.name).includes(q)) return false
      if (filters.muscle !== 'Tümü' && e.muscleGroup !== filters.muscle) return false
      if (filters.difficulty !== 'Tümü' && e.difficulty !== filters.difficulty) return false
      if (filters.equipment !== 'Tümü' && e.equipment !== filters.equipment) return false
      if (filters.onlyFavorites && !favorites.includes(e.id)) return false
      return true
    })
  }, [query, filters, favorites])

  const hasFilters =
    query !== '' ||
    filters.muscle !== 'Tümü' ||
    filters.difficulty !== 'Tümü' ||
    filters.equipment !== 'Tümü' ||
    filters.onlyFavorites

  return (
    <div className="space-y-6">
      <ExerciseSearch value={query} onChange={setQuery} />

      <ExerciseFilter
        filters={filters}
        onChange={updateFilters}
        onReset={resetAll}
        hasFilters={hasFilters}
      />

      <p className="text-sm text-muted" aria-live="polite">
        {filtered.length} egzersiz bulundu
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Sonuç bulunamadı"
          description="Aradığın kriterlere uyan egzersiz yok. Filtreleri değiştirmeyi dene."
          action={<Button onClick={resetAll}>Filtreleri temizle</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isFavorite={favorites.includes(exercise.id)}
              onToggleFavorite={toggleFavorite}
              onOpen={setSelected}
            />
          ))}
        </div>
      )}

      <ExerciseDetail
        exercise={selected}
        onClose={() => setSelected(null)}
        isFavorite={selected ? favorites.includes(selected.id) : false}
        onToggleFavorite={toggleFavorite}
        onAddToWorkout={addToWorkout}
      />
    </div>
  )
}
