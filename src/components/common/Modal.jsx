import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    // Açılırken arka planın kaymasını engelle
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidth} max-h-[92vh] flex flex-col bg-card border border-line rounded-t-3xl sm:rounded-2xl shadow-2xl`}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-line">
          <h2 className="text-lg font-bold truncate">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-ink hover:bg-surface"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  )
}