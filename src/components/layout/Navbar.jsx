import { Link, useLocation } from 'react-router-dom'
import { Menu, CalendarDays } from 'lucide-react'
import { navItems } from '../../data/navigation'
import useLocalStorage from '../../hooks/useLocalStorage'
import { defaultSettings } from '../../data/defaultSettings'

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const [settings] = useLocalStorage('fitly_settings', defaultSettings)

  const currentPage = navItems.find((item) => item.path === pathname)
  const pageTitle = currentPage ? currentPage.title : 'FITLY'

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const name = settings.displayName?.trim() || 'Sporcu'
  const initial = name.charAt(0).toLocaleUpperCase('tr-TR')

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 bg-bg/90 backdrop-blur border-b border-line">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-muted hover:text-ink hover:bg-surface"
          aria-label="Menüyü aç"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">{pageTitle}</h1>
          <p className="hidden sm:flex items-center gap-1.5 text-xs text-muted">
            <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
            {today}
          </p>
        </div>
      </div>

      {/* Profil alanı: tıklayınca Ayarlar sayfasına gider */}
      <Link
        to="/settings"
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-surface transition-colors"
        aria-label="Profil ve ayarlar"
      >
        <span className="w-9 h-9 rounded-full bg-accent text-bg font-bold flex items-center justify-center">
          {initial}
        </span>
        <span className="hidden sm:block text-sm font-medium max-w-32 truncate">
          {name}
        </span>
      </Link>
    </header>
  )
}