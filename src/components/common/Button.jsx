const variants = {
  primary: 'bg-accent text-bg hover:opacity-90',
  secondary: 'bg-surface text-ink border border-line hover:border-accent',
  danger: 'bg-danger/15 text-danger border border-danger/30 hover:bg-danger/25',
  ghost: 'text-muted hover:text-ink hover:bg-surface',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
