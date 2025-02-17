import { MMKV } from 'react-native-mmkv'
import { Workout } from '../types/workout'

const storage = new MMKV()
const WORKOUTS_KEY = 'workouts'

export const WorkoutStorage = {
  saveWorkouts: (workouts: Workout[]) => {
    storage.set(WORKOUTS_KEY, JSON.stringify(workouts))
  },

  getWorkouts: (): Workout[] => {
    const workouts = storage.getString(WORKOUTS_KEY)
    if (!workouts) return []
    
    // Convert date strings back to Date objects
    return JSON.parse(workouts, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value)
      }
      return value
    })
  },

  addWorkout: (workout: Workout) => {
    const workouts = WorkoutStorage.getWorkouts()
    workouts.push(workout)
    WorkoutStorage.saveWorkouts(workouts)
  },

  updateWorkout: (workout: Workout) => {
    const workouts = WorkoutStorage.getWorkouts()
    const index = workouts.findIndex(w => w.id === workout.id)
    if (index !== -1) {
      workouts[index] = workout
      WorkoutStorage.saveWorkouts(workouts)
    }
  },

  deleteWorkout: (workoutId: string) => {
    const workouts = WorkoutStorage.getWorkouts()
    const filtered = workouts.filter(w => w.id !== workoutId)
    WorkoutStorage.saveWorkouts(filtered)
  },

  getWorkout: (id: string): Workout | undefined => {
    const workouts = WorkoutStorage.getWorkouts()
    return workouts.find(w => w.id === id)
  },

  initialize: () => {
    const existingWorkouts = WorkoutStorage.getWorkouts()
    if (existingWorkouts.length === 0) {
      WorkoutStorage.saveWorkouts(getDefaultWorkouts())
    }
    return WorkoutStorage.getWorkouts()
  }
} 