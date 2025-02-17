import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Workout, Exercise } from './types/workout';
import { WorkoutStorage } from './utils/storage';

export default function WorkoutEditor() {
  const { workoutId } = useLocalSearchParams<{ workoutId?: string }>();
  const existingWorkout = workoutId ? WorkoutStorage.getWorkout(workoutId) : undefined;
  
  const [workout, setWorkout] = useState<Partial<Workout>>(
    existingWorkout || {
      name: '',
      description: '',
      exercises: [],
      difficulty: 'beginner',
      category: 'strength',
    }
  );

  const [exercises, setExercises] = useState<Exercise[]>(
    existingWorkout?.exercises || []
  );

  const saveWorkout = () => {
    const newWorkout: Workout = {
      id: existingWorkout?.id || Date.now().toString(),
      name: workout.name || 'Untitled Workout',
      description: workout.description,
      exercises: exercises,
      difficulty: workout.difficulty || 'beginner',
      category: workout.category || 'strength',
      createdAt: existingWorkout?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (existingWorkout) {
      WorkoutStorage.updateWorkout(newWorkout);
    } else {
      WorkoutStorage.addWorkout(newWorkout);
    }

    router.back();
  };

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: 'New Exercise',
      duration: 30,
      type: 'exercise',
      description: '',
    };
    setExercises([...exercises, newExercise]);
  };

  const updateExercise = (index: number, updates: Partial<Exercise>) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], ...updates };
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: existingWorkout ? 'Edit Workout' : 'New Workout',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <FontAwesome name="close" size={24} color="#000" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={saveWorkout}>
              <Text style={styles.saveButton}>Save</Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Workout Name"
          value={workout.name}
          onChangeText={(text) => setWorkout({ ...workout, name: text })}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Workout Description"
          value={workout.description}
          onChangeText={(text) => setWorkout({ ...workout, description: text })}
          multiline
        />

        <Text style={styles.sectionTitle}>Exercises</Text>
        
        {exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={exercise.name}
              onChangeText={(text) => updateExercise(index, { name: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Duration (seconds)"
              value={exercise.duration.toString()}
              onChangeText={(text) => updateExercise(index, { duration: parseInt(text) || 0 })}
              keyboardType="number-pad"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Exercise Description"
              value={exercise.description}
              onChangeText={(text) => updateExercise(index, { description: text })}
              multiline
            />

            <Pressable
              style={styles.removeButton}
              onPress={() => removeExercise(index)}
            >
              <FontAwesome name="trash" size={20} color="#FF4444" />
            </Pressable>
          </View>
        ))}

        <Pressable style={styles.addButton} onPress={addExercise}>
          <FontAwesome name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Exercise</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  exerciseItem: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    alignSelf: 'flex-end',
  },
  saveButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
}); 