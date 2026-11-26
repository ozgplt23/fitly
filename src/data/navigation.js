import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  HeartPulse,
  TrendingUp,
  Settings,
} from 'lucide-react'

export const navItems = [
  { path: '/', label: 'Dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { path: '/workouts', label: 'Antrenmanlar', title: 'Antrenmanlar', icon: Dumbbell },
  { path: '/exercises', label: 'Egzersiz Kütüphanesi', title: 'Egzersiz Kütüphanesi', icon: BookOpen },
  { path: '/wellness', label: 'Wellness', title: 'Wellness Takipçisi', icon: HeartPulse },
  { path: '/progress', label: 'Gelişim', title: 'Gelişim Takibi', icon: TrendingUp },
  { path: '/settings', label: 'Ayarlar', title: 'Ayarlar', icon: Settings },
]