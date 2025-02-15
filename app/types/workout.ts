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

// Example workout data structure
export const sampleWorkout: Workout = {
  id: '1',
  name: 'Full Body HIIT',
  description: '30-minute high intensity interval training',
  exercises: [
    {
      id: 'ex1',
      name: 'Jumping Jacks',
      duration: 30,
      type: 'exercise',
      description: 'Start with feet together and arms at sides, then jump and spread legs while raising arms'
    },
    {
      id: 'ex2',
      name: 'Rest',
      duration: 10,
      type: 'rest'
    },
    {
      id: 'ex3',
      name: 'Push-ups',
      duration: 30,
      type: 'exercise',
      description: 'Standard push-ups, modify on knees if needed'
    }
  ],
  difficulty: 'intermediate',
  category: 'hiit',
  createdAt: new Date(),
  updatedAt: new Date()
}; 