import { useMemo } from 'react'
import { Dumbbell, CheckCircle2, Droplets, Target, Sparkles, Activity, Utensils } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { defaultSettings } from '../data/defaultSettings'
import {
  todayString,
  formatDate,
  isDateInWeek,
  completedPerDay,
  waterTotalForDate,
  habitCompletionForDate,
  isHabitDone,
  formatWater,
} from '../utils/calculations'
import StatCard from '../components/dashboard/StatCard'
import ActivityChart from '../components/dashboard/ActivityChart'
import TodayWorkout from '../components/dashboard/TodayWorkout'

const motivations = [
  'Küçük adımlar büyük farklar yaratır.',
  'Bugünün antrenmanı yarının gücüdür.',
  'Düzenli olmak, mükemmel olmaktan önemlidir.',
  'Vücudun yapabildiklerine şaşıracaksın.',
  'Başlamak, yarı yolu bitirmektir.',
]

const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Günaydın'
  if (h < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

function GoalRow({ label, percent, note }) {
  return (
    <li>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-accent font-semibold">{note ?? `%${percent}`}</span>
      </div>
      <div
        className="h-2 bg-surface rounded-full mt-2 overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </li>
  )
}

const activityIcons = { workout: Dumbbell, water: Droplets, meal: Utensils }

export default function Dashboard() {
  const [workouts, setWorkouts] = useLocalStorage('fitly_workouts', [])
  const [water] = useLocalStorage('fitly_water', [])
  const [meals] = useLocalStorage('fitly_meals', [])
  const [habits] = useLocalStorage('fitly_habits', [])
  const [stored] = useLocalStorage('fitly_settings', defaultSettings)

  const settings = { ...defaultSettings, ...stored }
  const today = todayString()
  const goalMl = Number(settings.dailyWaterGoal) > 0 ? Number(settings.dailyWaterGoal) : 2500
  const weeklyGoal = Number(settings.weeklyWorkoutGoal) > 0 ? Number(settings.weeklyWorkoutGoal) : 4

  const data = useMemo(() => {
    const weekWorkouts = workouts.filter((w) => isDateInWeek(w.date))
    const weekCompleted = workouts.filter((w) => w.completed && isDateInWeek(w.completedAt))
    const totalCompleted = workouts.filter((w) => w.completed).length

    const waterToday = waterTotalForDate(water, today)
    const waterPct = Math.min(100, Math.round((waterToday / goalMl) * 100))

    const habitPct = habitCompletionForDate(habits, today)
    const habitsDone = habits.filter((h) => isHabitDone(h, today)).length

    const todayWorkouts = workouts.filter((w) => w.date === today)
    const workoutPct = todayWorkouts.length
      ? Math.round((todayWorkouts.filter((w) => w.completed).length / todayWorkouts.length) * 100)
      : null

    // Planlanmış antrenman ya da alışkanlık yoksa o hedef ortalamaya katılmaz
    const parts = [waterPct]
    if (workoutPct !== null) parts.push(workoutPct)
    if (habits.length > 0) parts.push(habitPct)
    const dailyPct = Math.round(parts.reduce((a, b) => a + b, 0) / parts.length)

    return {
      weekWorkouts,
      weekCompleted,
      totalCompleted,
      waterToday,
      waterPct,
      habitPct,
      habitsDone,
      todayWorkouts,
      workoutPct,
      dailyPct,
    }
  }, [workouts, water, habits, today, goalMl])

  const chartData = useMemo(() => completedPerDay(workouts, 7), [workouts])

  const recent = useMemo(() => {
    const items = []
    workouts
      .filter((w) => w.completed && w.completedAt)
      .forEach((w) =>
        items.push({
          key: `w-${w.id}`,
          type: 'workout',
          date: w.completedAt,
          sort: w.id,
          text: `${w.name} antrenmanı tamamlandı`,
        }),
      )
    water.forEach((l) =>
      items.push({
        key: `h-${l.id}`,
        type: 'water',
        date: l.date,
        sort: l.id,
        text: `${formatWater(l.amount, settings.waterUnit)} su eklendi`,
      }),
    )
    meals.forEach((m) =>
      items.push({
        key: `m-${m.id}`,
        type: 'meal',
        date: m.date,
        sort: m.id,
        text: `${m.name} (${m.calories} kcal)`,
      }),
    )
    return items
      .sort((a, b) =>
        a.date === b.date ? (a.sort < b.sort ? 1 : -1) : a.date < b.date ? 1 : -1,
      )
      .slice(0, 6)
  }, [workouts, water, meals, settings.waterUnit])

  const toggleComplete = (id) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, completed: !w.completed, completedAt: w.completed ? null : today }
          : w,
      ),
    )
  }

  const name = settings.displayName?.trim() || 'Sporcu'
  const motivation = motivations[new Date().getDate() % motivations.length]
  const todayLong = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="space-y-6">
      {/* Karşılama */}
      <section className="bg-card border border-line rounded-2xl p-5 sm:p-6">
        <p className="text-sm text-muted">{todayLong}</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
          {greeting()}, <span className="text-accent">{name}</span>
        </h2>
        <p className="flex items-center gap-2 text-sm text-muted mt-3">
          <Sparkles className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
          {motivation}
        </p>
        <p className="text-sm mt-3">
          Bugün: {formatWater(data.waterToday, settings.waterUnit)} su
          {habits.length > 0 && `, ${data.habitsDone}/${habits.length} alışkanlık`}
          {`, ${data.todayWorkouts.length} planlı antrenman.`}
        </p>
      </section>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Dumbbell}
          label="Haftalık antrenman"
          value={`${data.weekWorkouts.length}/${weeklyGoal}`}
          description="Bu hafta planlanan / haftalık hedef"
          percent={Math.min(100, Math.round((data.weekWorkouts.length / weeklyGoal) * 100))}
        />
        <StatCard
          icon={CheckCircle2}
          label="Tamamlanan antrenman"
          value={data.totalCompleted}
          description={`Bu hafta ${data.weekCompleted.length} tamamlandı`}
        />
        <StatCard
          icon={Droplets}
          label="Günlük su"
          value={formatWater(data.waterToday, settings.waterUnit)}
          description={`Hedef: ${formatWater(goalMl, settings.waterUnit)}`}
          percent={data.waterPct}
        />
        <StatCard
          icon={Target}
          label="Günlük hedef"
          value={`%${data.dailyPct}`}
          description="Antrenman, su ve alışkanlık ortalaması"
          percent={data.dailyPct}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <TodayWorkout workouts={data.todayWorkouts} onComplete={toggleComplete} />
        <ActivityChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Günlük hedefler */}
        <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="goals-title">
          <h2 id="goals-title" className="flex items-center gap-2 text-lg font-bold">
            <Target className="w-5 h-5 text-accent" aria-hidden="true" />
            Günlük hedefler
          </h2>
          <ul className="space-y-5 mt-5">
            {data.workoutPct === null ? (
              <li className="text-sm text-muted">
                Antrenmanı tamamla: bugün planlanmış antrenman yok.
              </li>
            ) : (
              <GoalRow label="Antrenmanı tamamla" percent={data.workoutPct} />
            )}
            <GoalRow label="Günlük su hedefine ulaş" percent={data.waterPct} />
            {habits.length === 0 ? (
              <li className="text-sm text-muted">
                Alışkanlıkları tamamla: Wellness sayfasından alışkanlık ekle.
              </li>
            ) : (
              <GoalRow label="Günlük alışkanlıkları tamamla" percent={data.habitPct} />
            )}
          </ul>
        </section>

        {/* Son aktiviteler */}
        <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="recent-title">
          <h2 id="recent-title" className="flex items-center gap-2 text-lg font-bold">
            <Activity className="w-5 h-5 text-accent" aria-hidden="true" />
            Son aktiviteler
          </h2>
          {recent.length === 0 ? (
            <p className="text-sm text-muted mt-5 py-8 text-center bg-surface rounded-xl">
              Henüz aktivite yok. Antrenman, su veya öğün ekledikçe burada görünecek.
            </p>
          ) : (
            <ul className="space-y-2 mt-5">
              {recent.map((item) => {
                const Icon = activityIcons[item.type]
                return (
                  <li key={item.key} className="flex items-center gap-3 bg-surface rounded-xl px-3 py-2.5">
                    <Icon className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                    <span className="text-sm flex-1 min-w-0 truncate">{item.text}</span>
                    <span className="text-xs text-muted shrink-0">{formatDate(item.date)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
