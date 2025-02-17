import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Workout, Exercise } from './types/workout';
import { WorkoutStorage } from './utils/storage';

type IconName = keyof typeof FontAwesome.glyphMap;

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

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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
    const newId = Date.now().toString();
    const newExercise: Exercise = {
      id: newId,
      name: 'New Exercise',
      duration: 30,
      type: 'exercise' as const,
      description: '',
    };
    setExercises(prevExercises => [...prevExercises, newExercise]);
    setTimeout(() => {
      setExpandedItems(prev => ({
        ...prev,
        [newId]: true
      }));
    }, 0);
  };

  const addRestBetween = (index: number) => {
    const newId = Date.now().toString();
    const restPeriod: Exercise = {
      id: newId,
      name: 'Rest',
      duration: 30,
      type: 'rest' as const,
      description: '',
    };
    
    const updatedExercises = [
      ...exercises.slice(0, index + 1),
      restPeriod,
      ...exercises.slice(index + 1)
    ];
    setExercises(updatedExercises);
    setExpandedItems(prev => ({
      ...prev,
      [newId]: true
    }));
  };

  const updateExercise = (index: number, updates: Partial<Exercise>) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], ...updates };
    setExercises(updatedExercises);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const getExerciseStyles = (type: string) => ({
    backgroundColor: type === 'rest' ? '#F3F4F6' : '#f5f5f5',
    circle: {
      backgroundColor: type === 'rest' ? '#9CA3AF' : '#2563EB',
    },
    icon: (type === 'rest' ? 'clock-o' : 'dot-circle-o') as IconName,
  });

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
        
        {exercises.map((exercise, index) => {
          const exerciseStyles = getExerciseStyles(exercise.type);
          
          return (
            <View key={exercise.id}>
              <Pressable 
                style={[
                  styles.exerciseItem, 
                  { backgroundColor: exerciseStyles.backgroundColor },
                  expandedItems[exercise.id] && styles.exerciseItemExpanded,
                  exercise.type === 'rest' && styles.restItem
                ]}
                onPress={() => {
                  setExpandedItems(prev => ({
                    ...prev,
                    [exercise.id]: !prev[exercise.id]
                  }));
                }}
              >
                <View style={styles.exerciseHeader}>
                  <View style={[
                    styles.durationCircle, 
                    { backgroundColor: exerciseStyles.circle.backgroundColor },
                    exercise.type === 'rest' && styles.restDurationCircle
                  ]}>
                    <FontAwesome name={exerciseStyles.icon} size={16} color="#fff" />
                    <Text style={styles.durationText}>{exercise.duration}s</Text>
                  </View>
                  
                  <Text style={[
                    styles.exerciseName,
                    exercise.type === 'rest' && styles.restName
                  ]}>{exercise.name}</Text>
                  
                  <Pressable
                    style={styles.removeButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      removeExercise(index);
                    }}
                  >
                    <FontAwesome name="trash" size={20} color="#9CA3AF" />
                  </Pressable>
                </View>

                {expandedItems[exercise.id] && (
                  <View style={styles.exerciseDetails}>
                    <TextInput
                      style={styles.input}
                      placeholder="Exercise Name"
                      value={exercise.name}
                      onChangeText={(text) => updateExercise(index, { name: text })}
                    />
                    
                    <View style={styles.typeAndDuration}>
                      <Pressable 
                        style={styles.typeToggle}
                        onPress={() => updateExercise(index, { 
                          type: exercise.type === 'rest' ? 'exercise' : 'rest',
                          name: exercise.type === 'rest' ? 'New Exercise' : 'Rest'
                        })}
                      >
                        <Text style={styles.typeText}>
                          {exercise.type === 'rest' ? 'Rest' : 'Exercise'}
                        </Text>
                      </Pressable>

                      <TextInput
                        style={[styles.input, styles.durationInput]}
                        placeholder="Duration (seconds)"
                        value={exercise.duration.toString()}
                        onChangeText={(text) => updateExercise(index, { duration: parseInt(text) || 0 })}
                        keyboardType="number-pad"
                      />
                    </View>
                    
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Exercise Description"
                      value={exercise.description}
                      onChangeText={(text) => updateExercise(index, { description: text })}
                      multiline
                    />
                  </View>
                )}
              </Pressable>
              
              {index < exercises.length - 1 && 
               exercise.type !== 'rest' && 
               exercises[index + 1].type !== 'rest' && (
                <View style={styles.addRestButtonContainer}>
                  <View style={styles.addRestLine} />
                  <Pressable 
                    style={styles.addRestButton}
                    onPress={() => addRestBetween(index)}
                  >
                    <FontAwesome name="plus" size={12} color="#6B7280" />
                  </Pressable>
                  <View style={styles.addRestLine} />
                </View>
              )}
            </View>
          );
        })}

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
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  exerciseItemExpanded: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  durationCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  durationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  exerciseDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
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
    padding: 8,
  },
  saveButton: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 16,
  },
  typeAndDuration: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeToggle: {
    flex: 1,
    padding: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  durationInput: {
    flex: 1,
    marginBottom: 0,
  },
  addRestButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  addRestLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  addRestButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  restItem: {
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  restDurationCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
  },
  restName: {
    color: '#6B7280',
    fontSize: 14,
  },
}); 