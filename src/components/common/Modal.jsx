import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const FOCUSABLE =
  'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  // onClose her render'da değişebilir. Ref'te tutarak effect'in
  // yeniden çalışmasını ve odağın sıfırlanmasını engelliyoruz.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Yalnızca modal açılıp kapandığında çalışır
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
        return
      }
      // Tab ile odak modalın dışına çıkmasın
      if (e.key === 'Tab' && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll(FOCUSABLE)
        if (items.length === 0) return
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    // Açılışta bir kez: önce içerikteki ilk form alanına, yoksa X butonuna odaklan
    const body = dialogRef.current?.querySelector(
      'input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
    )
    ;(body || closeRef.current)?.focus()

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
      // Kapanınca odağı modalı açan elemana geri ver
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
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
