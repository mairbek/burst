import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Workout, Exercise, workouts } from './types/workout';

type WorkoutPhase = 'prepare' | 'exercise' | 'rest';

export default function WorkoutPlayer() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const workout = workouts.find(w => w.id === workoutId) ?? workouts[0];
  const [phase, setPhase] = useState<WorkoutPhase>('prepare');
  const [timeLeft, setTimeLeft] = useState(3); // reduced from 10 to 3 seconds
  const [isActive, setIsActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = workout.exercises[currentExerciseIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Phase transition logic
      if (phase === 'prepare') {
        setPhase('exercise');
        setTimeLeft(currentExercise.duration);
      } else if (phase === 'exercise') {
        // Check if there are more exercises
        if (currentExerciseIndex < workout.exercises.length - 1) {
          const nextExercise = workout.exercises[currentExerciseIndex + 1];
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setTimeLeft(nextExercise.duration);
          setPhase(nextExercise.type === 'rest' ? 'rest' : 'exercise');
        } else {
          // Workout complete
          setIsActive(false);
          router.back(); // Navigate back when workout is complete
        }
      } else if (phase === 'rest') {
        // After rest, move to next exercise
        if (currentExerciseIndex < workout.exercises.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setTimeLeft(workout.exercises[currentExerciseIndex + 1].duration);
          setPhase('exercise');
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, currentExerciseIndex, workout.exercises]);

  const toggleWorkout = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: workout.name,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <FontAwesome name="close" size={24} color="#000" />
            </Pressable>
          ),
        }}
      />

      <View style={styles.content}>
        <Text style={styles.phase}>
          {phase === 'prepare' ? 'Get Ready' : currentExercise.name}
        </Text>
        
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        
        <Text style={styles.progress}>
          Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
        </Text>

        {currentExercise.description && (
          <Text style={styles.description}>
            {currentExercise.description}
          </Text>
        )}

        <View style={styles.controls}>
          <Pressable 
            style={[styles.button, styles.controlButton]} 
            onPress={toggleWorkout}
          >
            <FontAwesome 
              name={isActive ? "pause" : "play"} 
              size={24} 
              color="#fff" 
            />
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.resetButton]}
            onPress={() => {
              setIsActive(false);
              setPhase('prepare');
              setTimeLeft(3); // reduced from 10 to 3 seconds
              setCurrentExerciseIndex(0);
            }}
          >
            <FontAwesome name="refresh" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phase: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progress: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    backgroundColor: '#2563EB',
  },
  resetButton: {
    backgroundColor: '#666',
  },
}); 