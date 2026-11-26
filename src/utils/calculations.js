// Benzersiz ID üretir
export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

// Bugünün tarihini YYYY-MM-DD formatında verir (yerel saate göre)
export const todayString = () => {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// YYYY-MM-DD tarihini "26 Kasım 2026" gibi okunur hale getirir
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const [y, m, d] = dateString.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// Tahmini antrenman süresi (dakika):
// her set için ~1 dakika çalışma + ~1.5 dakika dinlenme
export const estimateDuration = (exercises = []) => {
  const totalSets = exercises.reduce((sum, e) => sum + (Number(e.sets) || 0), 0)
  return Math.round(totalSets * 2.5)
}

// N gün önceki tarihi YYYY-MM-DD olarak verir (0 = bugün)
export const dateDaysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

// Belirli bir günün toplam su miktarı (ml)
export const waterTotalForDate = (waterLogs, date) =>
  waterLogs
    .filter((log) => log.date === date)
    .reduce((sum, log) => sum + Number(log.amount), 0)

// Belirli bir günün toplam kalorisi
export const caloriesForDate = (meals, date) =>
  meals
    .filter((meal) => meal.date === date)
    .reduce((sum, meal) => sum + Number(meal.calories), 0)

// Bir alışkanlığın belirli günde tamamlanıp tamamlanmadığı
export const isHabitDone = (habit, date) => habit.completedDates.includes(date)

// Belirli günde tamamlanan alışkanlık yüzdesi (0-100)
export const habitCompletionForDate = (habits, date) => {
  if (habits.length === 0) return 0
  const done = habits.filter((h) => isHabitDone(h, date)).length
  return Math.round((done / habits.length) * 100)
}
