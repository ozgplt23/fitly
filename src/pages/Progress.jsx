import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Dumbbell, CheckCircle2, CalendarDays, CalendarRange, Droplets, GlassWater, ListChecks, BarChart3 } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage'
import { defaultSettings } from '../data/defaultSettings'
import {
  completedPerDay,
  dateDaysAgo,
  waterTotalForDate,
  isHabitDone,
  isDateInWeek,
  fromMl,
  formatWater,
  todayString,
} from '../utils/calculations'
import StatCard from '../components/dashboard/StatCard'
import WeightTracker from '../components/progress/WeightTracker'

const tooltipStyle = {
  background: '#252B29',
  border: '1px solid #303835',
  borderRadius: 12,
  color: '#F1F3F0',
}

const dayLabel = (date) =>
  new Date(date + 'T00:00:00').toLocaleDateString('tr-TR', { weekday: 'short' })

function ChartCard({ title, subtitle, icon: Icon, hasData, emptyText, children }) {
  return (
    <section className="bg-card border border-line rounded-2xl p-5">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
        {title}
      </h2>
      <p className="text-xs text-muted mt-1">{subtitle}</p>
      {hasData ? (
        <div className="h-60 mt-4">{children}</div>
      ) : (
        <p className="text-sm text-muted mt-6 py-10 text-center bg-surface rounded-xl">{emptyText}</p>
      )}
    </section>
  )
}

function SimpleBar({ data, dataKey, name, formatter }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="#303835" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke="#AAB3AD" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis stroke="#AAB3AD" allowDecimals tickLine={false} axisLine={false} fontSize={12} />
        <Tooltip
          cursor={{ fill: 'rgba(163,243,107,0.08)' }}
          contentStyle={tooltipStyle}
          formatter={(value) => [formatter ? formatter(value) : value, name]}
        />
        <Bar dataKey={dataKey} fill="#A3F36B" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function Progress() {
  const [workouts] = useLocalStorage('fitly_workouts', [])
  const [water] = useLocalStorage('fitly_water', [])
  const [habits] = useLocalStorage('fitly_habits', [])
  const [weights, setWeights] = useLocalStorage('fitly_weight_records', [])
  const [stored] = useLocalStorage('fitly_settings', defaultSettings)

  const settings = { ...defaultSettings, ...stored }
  const unit = settings.waterUnit
  const weeklyGoal = Number(settings.weeklyWorkoutGoal) > 0 ? Number(settings.weeklyWorkoutGoal) : 4

  const stats = useMemo(() => {
    const completed = workouts.filter((w) => w.completed)
    const thisMonth = todayString().slice(0, 7)

    const weekDone = completed.filter((w) => isDateInWeek(w.completedAt)).length
    const monthDone = completed.filter((w) => (w.completedAt || '').startsWith(thisMonth)).length

    const totalWater = water.reduce((sum, l) => sum + Number(l.amount), 0)
    const waterDays = new Set(water.map((l) => l.date)).size
    const avgWater = waterDays > 0 ? Math.round(totalWater / waterDays) : 0

    // Son 7 günde, tüm alışkanlıkların tamamlanma oranı
    let habitRate = null
    if (habits.length > 0) {
      let done = 0
      for (let i = 0; i < 7; i++) {
        const date = dateDaysAgo(i)
        done += habits.filter((h) => isHabitDone(h, date)).length
      }
      habitRate = Math.round((done / (habits.length * 7)) * 100)
    }

    return { total: workouts.length, completed: completed.length, weekDone, monthDone, totalWater, avgWater, habitRate }
  }, [workouts, water, habits])

  // 1. Haftalık antrenman aktivitesi (son 7 gün)
  const weeklyData = useMemo(
    () => completedPerDay(workouts, 7).map((d) => ({ ...d, label: dayLabel(d.date) })),
    [workouts],
  )

  // 2. Aylık antrenman istatistikleri (son 6 ay)
  const monthlyData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return {
        label: d.toLocaleDateString('tr-TR', { month: 'short' }),
        count: workouts.filter((w) => w.completed && (w.completedAt || '').startsWith(key)).length,
      }
    })
  }, [workouts])

  // 3. Su tüketimi (son 7 gün, seçili birimde)
  const waterData = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = dateDaysAgo(6 - i)
        const ml = waterTotalForDate(water, date)
        return { label: dayLabel(date), amount: Number(fromMl(ml, unit).toFixed(2)) }
      }),
    [water, unit],
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Dumbbell}
          label="Toplam antrenman"
          value={stats.total}
          description="Oluşturulan tüm antrenmanlar"
        />
        <StatCard
          icon={CheckCircle2}
          label="Tamamlanan"
          value={stats.completed}
          description={
            stats.total > 0
              ? `Tamamlama oranı %${Math.round((stats.completed / stats.total) * 100)}`
              : 'Henüz antrenman yok'
          }
          percent={stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}
        />
        <StatCard
          icon={CalendarDays}
          label="Haftalık sıklık"
          value={`${stats.weekDone}/${weeklyGoal}`}
          description="Bu hafta tamamlanan / hedef"
          percent={Math.min(100, Math.round((stats.weekDone / weeklyGoal) * 100))}
        />
        <StatCard
          icon={CalendarRange}
          label="Aylık sıklık"
          value={stats.monthDone}
          description="Bu ay tamamlanan antrenman"
        />
        <StatCard
          icon={Droplets}
          label="Toplam su"
          value={formatWater(stats.totalWater, unit)}
          description="Kayıtlı tüm günlerin toplamı"
        />
        <StatCard
          icon={GlassWater}
          label="Ortalama günlük su"
          value={formatWater(stats.avgWater, unit)}
          description="Su kaydı olan günlerin ortalaması"
        />
        <StatCard
          icon={ListChecks}
          label="Alışkanlık oranı"
          value={stats.habitRate === null ? '-' : `%${stats.habitRate}`}
          description={stats.habitRate === null ? 'Henüz alışkanlık yok' : 'Son 7 günün ortalaması'}
          percent={stats.habitRate === null ? undefined : stats.habitRate}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <ChartCard
          title="Haftalık antrenman aktivitesi"
          subtitle="Son 7 günde tamamlanan antrenmanlar"
          icon={BarChart3}
          hasData={weeklyData.some((d) => d.count > 0)}
          emptyText="Son 7 günde tamamlanan antrenman yok."
        >
          <SimpleBar data={weeklyData} dataKey="count" name="Antrenman" />
        </ChartCard>

        <ChartCard
          title="Aylık antrenman istatistikleri"
          subtitle="Son 6 ayda tamamlanan antrenmanlar"
          icon={CalendarRange}
          hasData={monthlyData.some((d) => d.count > 0)}
          emptyText="Henüz tamamlanmış antrenman yok. Antrenman tamamladıkça aylık grafik oluşur."
        >
          <SimpleBar data={monthlyData} dataKey="count" name="Antrenman" />
        </ChartCard>

        <ChartCard
          title="Su tüketimi"
          subtitle={`Son 7 gün (${unit})`}
          icon={Droplets}
          hasData={waterData.some((d) => d.amount > 0)}
          emptyText="Son 7 günde su kaydı yok. Wellness sayfasından su ekleyebilirsin."
        >
          <SimpleBar data={waterData} dataKey="amount" name="Su" formatter={(v) => `${v} ${unit}`} />
        </ChartCard>

        <WeightTracker records={weights} setRecords={setWeights} unit={settings.weightUnit} />
      </div>
    </div>
  )
}
