export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-card border border-dashed border-line rounded-2xl px-6 py-14">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-accent" aria-hidden="true" />
        </div>
      )}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && (
        <p className="text-muted text-sm mt-2 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}