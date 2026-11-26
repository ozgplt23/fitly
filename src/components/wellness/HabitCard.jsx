import { useState } from 'react'
import { Check, Pencil, Trash2, X } from 'lucide-react'
import { isHabitDone, dateDaysAgo } from '../../utils/calculations'

export default function HabitCard({ habit, today, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(habit.name)
  const done = isHabitDone(habit, today)

  const save = () => {
    if (!value.trim()) return
    onRename(habit.id, value.trim())
    setEditing(false)
  }

  // Son 7 günün durumu (en eskiden bugüne)
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = dateDaysAgo(6 - i)
    return { date, done: isHabitDone(habit, date) }
  })

  return (
    <li className="bg-surface rounded-xl p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onToggle(habit.id)}
          aria-pressed={done}
          aria-label={`${habit.name} bugün ${done ? 'tamamlandı, geri al' : 'tamamla'}`}
          className={`shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
            done ? 'bg-accent border-accent text-bg' : 'border-line hover:border-accent'
          }`}
        >
          {done && <Check className="w-5 h-5" />}
        </button>

        {editing ? (
          <>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Alışkanlık adı"
              className="flex-1 min-w-0 bg-bg border border-line rounded-lg px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={save}
              className="p-1.5 rounded-lg text-accent hover:bg-accent/10"
              aria-label="Kaydet"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setValue(habit.name)
                setEditing(false)
              }}
              className="p-1.5 rounded-lg text-muted hover:bg-line"
              aria-label="Vazgeç"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <span
              className={`flex-1 min-w-0 text-sm font-medium truncate ${
                done ? 'line-through text-muted' : ''
              }`}
            >
              {habit.name}
            </span>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-line"
              aria-label={`${habit.name} alışkanlığını düzenle`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(habit)}
              className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10"
              aria-label={`${habit.name} alışkanlığını sil`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      <div className="flex gap-1.5 mt-3 pl-11" aria-label="Son 7 gün geçmişi">
        {week.map((d) => (
          <span
            key={d.date}
            title={d.date}
            className={`w-4 h-4 rounded ${d.done ? 'bg-accent' : 'bg-line'}`}
          />
        ))}
      </div>
    </li>
  )
}
