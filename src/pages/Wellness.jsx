import { HeartPulse } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'

export default function Wellness() {
  return (
    <EmptyState
      icon={HeartPulse}
      title="Wellness Takipçisi"
      description="Su, beslenme ve alışkanlıklarını burada takip edeceksin."
    />
  )
}