export interface Exercise {
  id: string;
  name: string;
  duration: number; // in seconds
  description?: string;
  type: 'exercise' | 'rest';
  // Optional fields that could be added later:
  // intensity?: 'low' | 'medium' | 'high';
  // imageUrl?: string;
  // videoUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  totalDuration?: number; // Can be calculated from exercises
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  category?: 'strength' | 'cardio' | 'flexibility' | 'hiit';
  createdAt: Date;
  updatedAt: Date;
}

export const getDefaultWorkouts = (): Workout[] => [
  {
    id: '1',
    name: 'Boxing HIIT',
    description: 'High-intensity boxing workout combining punches and footwork',
    exercises: [
      {
        id: 'box1',
        name: 'Jab-Cross',
        duration: 5,
        type: 'exercise',
        description: 'Alternate between left jab and right cross punches'
      },
      {
        id: 'box2',
        name: 'Rest',
        duration: 3,
        type: 'rest'
      },
      {
        id: 'box3',
        name: 'Hook Combinations',
        duration: 5,
        type: 'exercise',
        description: 'Left hook followed by right hook'
      }
    ],
    difficulty: 'intermediate',
    category: 'hiit',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Bodyweight HIIT',
    description: 'No equipment needed full body workout',
    exercises: [
      {
        id: 'bw1',
        name: 'Burpees',
        duration: 5,
        type: 'exercise',
        description: 'Full body exercise: squat, push-up, and jump'
      },
      {
        id: 'bw2',
        name: 'Rest',
        duration: 3,
        type: 'rest'
      },
      {
        id: 'bw3',
        name: 'Mountain Climbers',
        duration: 5,
        type: 'exercise',
        description: 'Alternate bringing knees to chest in plank position'
      }
    ],
    difficulty: 'advanced',
    category: 'hiit',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Core Express',
    description: 'Quick core-focused workout',
    exercises: [
      {
        id: 'core1',
        name: 'Plank Hold',
        duration: 5,
        type: 'exercise',
        description: 'Hold a straight plank position'
      },
      {
        id: 'core2',
        name: 'Rest',
        duration: 3,
        type: 'rest'
      },
      {
        id: 'core3',
        name: 'Russian Twists',
        duration: 5,
        type: 'exercise',
        description: 'Seated, twist torso side to side'
      }
    ],
    difficulty: 'beginner',
    category: 'strength',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 