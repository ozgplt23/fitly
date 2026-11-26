import { NavLink } from 'react-router-dom'
import { Zap, X } from 'lucide-react'
import { navItems } from '../../data/navigation'

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobilde menü açıkken arka planı karartır; tıklayınca menü kapanır */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-bg-soft border-r border-line
          transition-transform duration-200 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Ana menü"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-bg" aria-hidden="true" />
            </div>
            <span className="text-xl font-extrabold tracking-wide">FITLY</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-muted hover:text-ink hover:bg-surface"
            aria-label="Menüyü kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menü bağlantıları */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-bg'
                    : 'text-muted hover:text-ink hover:bg-surface'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Slogan */}
        <div className="p-5 border-t border-line">
          <p className="text-xs text-muted">Train Smarter. Live Better.</p>
        </div>
      </aside>
    </>
  )
}