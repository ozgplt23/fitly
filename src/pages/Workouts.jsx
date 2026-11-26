import { Dumbbell } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'

export default function Workouts() {
  return (
    <EmptyState
      icon={Dumbbell}
      title="Antrenmanlar"
      description="Antrenman programlarını burada oluşturup yöneteceksin."
    />
  )
}