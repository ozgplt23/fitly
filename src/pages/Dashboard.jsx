import { LayoutDashboard } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'

export default function Dashboard() {
  return (
    <EmptyState
      icon={LayoutDashboard}
      title="Dashboard"
      description="Günlük ve haftalık fitness özetin burada görünecek."
    />
  )
}