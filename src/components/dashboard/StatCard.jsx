export default function StatCard({ icon: Icon, label, value, description, percent }) {
  return (
    <div className="bg-card border border-line rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
        </div>
      </div>
      <p className="text-3xl font-extrabold mt-3">{value}</p>
      <p className="text-xs text-muted mt-1">{description}</p>
      {percent !== undefined && (
        <div
          className="h-2 bg-surface rounded-full mt-4 overflow-hidden"
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
      )}
    </div>
  )
}
