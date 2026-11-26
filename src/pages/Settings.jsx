import { Settings as SettingsIcon } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'

export default function Settings() {
  return (
    <EmptyState
      icon={SettingsIcon}
      title="Ayarlar"
      description="Kişisel bilgilerini ve tercihlerini burada düzenleyeceksin."
    />
  )
}