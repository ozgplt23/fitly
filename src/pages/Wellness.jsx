import useLocalStorage from '../hooks/useLocalStorage'
import { defaultSettings } from '../data/defaultSettings'
import { generateId } from '../utils/calculations'
import WaterTracker from '../components/wellness/WaterTracker'
import MealTracker from '../components/wellness/MealTracker'
import HabitTracker from '../components/wellness/HabitTracker'

export default function Wellness() {
  const [water, setWater] = useLocalStorage('fitly_water', [])
  const [meals, setMeals] = useLocalStorage('fitly_meals', [])
  const [habits, setHabits] = useLocalStorage('fitly_habits', [])
  const [settings] = useLocalStorage('fitly_settings', defaultSettings)

  const goal = Number(settings.dailyWaterGoal) > 0 ? Number(settings.dailyWaterGoal) : 2500

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      <WaterTracker logs={water} setLogs={setWater} goal={goal} generateId={generateId} />
      <HabitTracker habits={habits} setHabits={setHabits} generateId={generateId} />
      <div className="xl:col-span-2">
        <MealTracker meals={meals} setMeals={setMeals} generateId={generateId} />
      </div>
    </div>
  )
}
