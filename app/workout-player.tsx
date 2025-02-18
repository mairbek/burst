import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Workout, Exercise } from './types/workout';
import { WorkoutStorage } from './utils/storage';
import SoundManager from './utils/sounds';
import { WorkoutImages } from './utils/images';

type WorkoutPhase = 'prepare' | 'exercise' | 'rest' | 'complete';

export default function WorkoutPlayer() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const workout = workoutId ? WorkoutStorage.getWorkout(workoutId) : undefined;

  if (!workout) {
    router.back();
    return null;
  }

  const [phase, setPhase] = useState<WorkoutPhase>('prepare');
  const [timeLeft, setTimeLeft] = useState(3);
  const [isActive, setIsActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  // Refs to track current state for sound effects
  const phaseRef = useRef(phase);
  const timeLeftRef = useRef(timeLeft);
  const currentExerciseRef = useRef(currentExercise);
  
  // Update refs when state changes
  useEffect(() => { 
    console.log('📱 Phase changed:', phase);
    phaseRef.current = phase; 
  }, [phase]);
  
  useEffect(() => { 
    console.log('⏰ Time left:', timeLeft);
    timeLeftRef.current = timeLeft; 
  }, [timeLeft]);
  
  useEffect(() => { 
    console.log('🏋️ Exercise changed:', currentExercise.name);
    currentExerciseRef.current = currentExercise; 
  }, [currentExercise]);

  // Initialize sounds
  useEffect(() => {
    console.log('🎵 Initializing sounds');
    SoundManager.initialize();
    return () => {
      console.log('🎵 Cleaning up sounds');
      SoundManager.cleanup();
    };
  }, []);

  // Handle countdown sounds
  useEffect(() => {
    if (isActive && timeLeft <= 5 && timeLeft > 0) {
      console.log('⏰ Triggering countdown for time:', timeLeft);
      SoundManager.playSound('countdown', { timeLeft });
    }
  }, [isActive, timeLeft]);

  // Handle phase transition sounds
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      console.log('🔄 Phase transition:', { phase, currentExerciseIndex });
      const handlePhaseEnd = async () => {
        if (phase === 'prepare') {
          console.log('🎬 Starting first exercise:', currentExercise.name);
          await SoundManager.playSound('start', { exerciseName: currentExercise.name });
        } else if (phase === 'exercise') {
          if (currentExerciseIndex < workout.exercises.length - 1) {
            const nextExercise = workout.exercises[currentExerciseIndex + 1];
            console.log('➡️ Moving to next:', nextExercise.type === 'rest' ? 'rest' : nextExercise.name);
            if (nextExercise.type === 'rest') {
              await SoundManager.playSound('rest');
            } else {
              await SoundManager.playSound('start', { exerciseName: nextExercise.name });
            }
          } else {
            console.log('🏁 Workout complete');
            await SoundManager.playSound('complete');
            setPhase('complete');
          }
        } else if (phase === 'rest') {
          const nextExercise = workout.exercises[currentExerciseIndex + 1];
          console.log('💪 Starting after rest:', nextExercise.name);
          await SoundManager.playSound('start', { exerciseName: nextExercise.name });
        }
      };

      handlePhaseEnd();
    }
  }, [phase, timeLeft, isActive, currentExerciseIndex, workout.exercises, currentExercise.name]);

  // Main timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      console.log('⏰ Timer reached zero:', { phase, currentExerciseIndex });
      if (phase === 'prepare') {
        console.log('🔄 Moving from prepare to exercise');
        setPhase('exercise');
        setTimeLeft(currentExercise.duration);
      } else if (phase === 'exercise') {
        if (currentExerciseIndex < workout.exercises.length - 1) {
          const nextExercise = workout.exercises[currentExerciseIndex + 1];
          console.log('🔄 Moving to next exercise/rest:', nextExercise.type, nextExercise.name);
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setTimeLeft(nextExercise.duration);
          setPhase(nextExercise.type === 'rest' ? 'rest' : 'exercise');
        } else {
          console.log('🏁 Ending workout');
          setIsActive(false);
          setPhase('complete');
        }
      } else if (phase === 'rest') {
        if (currentExerciseIndex < workout.exercises.length - 1) {
          const nextExercise = workout.exercises[currentExerciseIndex + 1];
          console.log('🔄 Moving from rest to:', nextExercise.name);
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setTimeLeft(nextExercise.duration);
          setPhase('exercise');
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, currentExerciseIndex, workout.exercises, currentExercise.duration]);

  const toggleWorkout = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    if (phase === 'complete') {
      return (
        <View style={styles.content}>
          <Text style={styles.phase}>Workout Complete!</Text>
          <View style={styles.imageContainer}>
            <Image 
              source={WorkoutImages.complete}
              style={styles.phaseImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.description}>Great job! You've completed {workout.name}</Text>
          <View style={styles.controls}>
            <Pressable 
              style={[styles.button, styles.controlButton]} 
              onPress={() => router.back()}
            >
              <FontAwesome name="check" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <Text style={styles.phase}>
          {phase === 'prepare' ? 'Get Ready' : currentExercise.name}
        </Text>

        <View style={styles.imageContainer}>
          <Image 
            source={
              phase === 'prepare' ? WorkoutImages.prepare :
              phase === 'rest' ? WorkoutImages.rest :
              WorkoutImages.exercise
            }
            style={styles.phaseImage}
            resizeMode="contain"
          />
        </View>
        
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
              setTimeLeft(3);
              setCurrentExerciseIndex(0);
            }}
          >
            <FontAwesome name="refresh" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: phase === 'complete' ? 'Workout Complete' : workout.name,
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <FontAwesome name="close" size={24} color="#000" />
            </Pressable>
          ),
        }}
      />
      {renderContent()}
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
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  phaseImage: {
    width: '100%',
    height: '100%',
  },
}); 