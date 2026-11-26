import { muscleGroups, difficultyLevels, equipmentTypes } from '../../data/exercises'

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-accent text-bg border-accent'
          : 'bg-card text-muted border-line hover:text-ink hover:border-accent'
      }`}
    >
      {children}
    </button>
  )
}

export default function ExerciseFilter({ filters, onChange, onReset, hasFilters }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          Kas grubu
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip
            active={filters.muscle === 'Tümü'}
            onClick={() => onChange({ muscle: 'Tümü' })}
          >
            Tümü
          </Chip>
          {muscleGroups.map((m) => (
            <Chip
              key={m}
              active={filters.muscle === m}
              onClick={() => onChange({ muscle: m })}
            >
              {m}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Zorluk
          </span>
          <select
            value={filters.difficulty}
            onChange={(e) => onChange({ difficulty: e.target.value })}
            className="mt-2 w-full bg-card border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          >
            <option value="Tümü">Tüm seviyeler</option>
            {difficultyLevels.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Ekipman
          </span>
          <select
            value={filters.equipment}
            onChange={(e) => onChange({ equipment: e.target.value })}
            className="mt-2 w-full bg-card border border-line rounded-xl px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
          >
            <option value="Tümü">Tüm ekipmanlar</option>
            {equipmentTypes.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip
          active={filters.onlyFavorites}
          onClick={() => onChange({ onlyFavorites: !filters.onlyFavorites })}
        >
          Sadece favoriler
        </Chip>
        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-accent hover:underline px-2"
          >
            Filtreleri temizle
          </button>
        )}
      </div>
    </div>
  )
}