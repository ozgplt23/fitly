import { Search, X } from 'lucide-react'

export default function ExerciseSearch({ value, onChange }) {
  return (
    <div className="relative">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Egzersiz ara... (Squat, Hip Thrust, Bench Press)"
        aria-label="Egzersiz ara"
        className="w-full bg-card border border-line rounded-2xl pl-12 pr-12 py-3.5 text-base placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface"
          aria-label="Aramayı temizle"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}