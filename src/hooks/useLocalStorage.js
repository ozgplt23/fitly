import { useState, useEffect, useRef } from 'react'

// Aynı sekmedeki farklı component'lerin birbirini güncellemesi için özel olay
const SYNC_EVENT = 'fitly-storage-sync'

// LocalStorage'dan güvenli okuma. Veri yoksa veya JSON bozuksa başlangıç değeri döner.
function readValue(key, initialValue) {
  try {
    const item = window.localStorage.getItem(key)
    return item !== null ? JSON.parse(item) : initialValue
  } catch (error) {
    console.warn(`"${key}" okunamadı, başlangıç değeri kullanılıyor.`, error)
    return initialValue
  }
}

export default function useLocalStorage(key, initialValue) {
  // Başlangıç değerini ref'te tutuyoruz ki her render'da değişmesin
  const initialRef = useRef(initialValue)
  const [value, setValue] = useState(() => readValue(key, initialRef.current))

  // State değişince LocalStorage'a yaz (değişmediyse tekrar yazma)
  useEffect(() => {
    try {
      const serialized = JSON.stringify(value)
      if (window.localStorage.getItem(key) !== serialized) {
        window.localStorage.setItem(key, serialized)
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }))
      }
    } catch (error) {
      console.warn(`"${key}" kaydedilemedi.`, error)
    }
  }, [key, value])

  // Başka bir component veya sekme aynı anahtarı değiştirirse state'i güncelle
  useEffect(() => {
    const handleSync = (event) => {
      const changedKey = event.type === SYNC_EVENT ? event.detail?.key : event.key
      // storage olayında key null ise tüm veri temizlenmiştir
      if (changedKey !== null && changedKey !== key) return

      const fresh = readValue(key, initialRef.current)
      setValue((prev) =>
        JSON.stringify(prev) === JSON.stringify(fresh) ? prev : fresh,
      )
    }

    window.addEventListener(SYNC_EVENT, handleSync)
    window.addEventListener('storage', handleSync)
    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync)
      window.removeEventListener('storage', handleSync)
    }
  }, [key])

  return [value, setValue]
}