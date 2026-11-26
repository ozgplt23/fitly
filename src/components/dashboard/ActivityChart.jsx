import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'
import { BarChart3 } from 'lucide-react'

export default function ActivityChart({ data }) {
  const hasData = data.some((d) => d.count > 0)

  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date + 'T00:00:00').toLocaleDateString('tr-TR', { weekday: 'short' }),
  }))

  return (
    <section className="bg-card border border-line rounded-2xl p-5" aria-labelledby="chart-title">
      <h2 id="chart-title" className="flex items-center gap-2 text-lg font-bold">
        <BarChart3 className="w-5 h-5 text-accent" aria-hidden="true" />
        Haftalık aktivite
      </h2>
      <p className="text-xs text-muted mt-1">Son 7 günde tamamlanan antrenmanlar</p>

      {hasData ? (
        <div className="h-60 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="#303835" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="#AAB3AD" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis
                stroke="#AAB3AD"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                cursor={{ fill: 'rgba(163,243,107,0.08)' }}
                contentStyle={{
                  background: '#252B29',
                  border: '1px solid #303835',
                  borderRadius: 12,
                  color: '#F1F3F0',
                }}
                formatter={(value) => [value, 'Antrenman']}
              />
              <Bar dataKey="count" fill="#A3F36B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-sm text-muted mt-6 py-10 text-center bg-surface rounded-xl">
          Son 7 günde tamamlanan antrenman yok. Bir antrenmanı tamamladığında grafik burada
          görünecek.
        </p>
      )}
    </section>
  )
}
