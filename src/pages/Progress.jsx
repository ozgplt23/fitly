import { TrendingUp } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'

export default function Progress() {
  return (
    <EmptyState
      icon={TrendingUp}
      title="Gelişim Takibi"
      description="İstatistiklerin ve grafiklerin burada görünecek."
    />
  )
}