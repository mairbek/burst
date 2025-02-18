import AsyncStorage from '@react-native-async-storage/async-storage'
import { Workout, getDefaultWorkouts } from '../types/workout'

const WORKOUTS_KEY = 'workouts'

export const WorkoutStorage = {
  saveWorkouts: async (workouts: Workout[]) => {
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts))
  },

  getWorkouts: async (): Promise<Workout[]> => {
    const workouts = await AsyncStorage.getItem(WORKOUTS_KEY)
    if (!workouts) return []
    
    // Convert date strings back to Date objects
    return JSON.parse(workouts, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value)
      }
      return value
    })
  },

  addWorkout: async (workout: Workout) => {
    const workouts = await WorkoutStorage.getWorkouts()
    workouts.push(workout)
    await WorkoutStorage.saveWorkouts(workouts)
  },

  updateWorkout: async (workout: Workout) => {
    const workouts = await WorkoutStorage.getWorkouts()
    const index = workouts.findIndex(w => w.id === workout.id)
    if (index !== -1) {
      workouts[index] = workout
      await WorkoutStorage.saveWorkouts(workouts)
    }
  },

  deleteWorkout: async (workoutId: string) => {
    const workouts = await WorkoutStorage.getWorkouts()
    const filtered = workouts.filter(w => w.id !== workoutId)
    await WorkoutStorage.saveWorkouts(filtered)
  },

  getWorkout: async (id: string): Promise<Workout | undefined> => {
    const workouts = await WorkoutStorage.getWorkouts()
    return workouts.find(w => w.id === id)
  },

  initialize: async () => {
    const existingWorkouts = await WorkoutStorage.getWorkouts()
    if (existingWorkouts.length === 0) {
      await WorkoutStorage.saveWorkouts(getDefaultWorkouts())
    }
    return WorkoutStorage.getWorkouts()
  }
} 