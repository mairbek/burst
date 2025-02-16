import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { router } from 'expo-router';
import { workouts, Workout } from '../types/workout';
import { FontAwesome } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { useRef, useCallback, useEffect } from 'react';

const LeftActions = ({ onStart }: { onStart: () => void }) => {
  return (
    <Pressable 
      style={[styles.swipeAction, styles.startAction]}
      onPress={onStart}
    >
      <FontAwesome name="play" size={24} color="#fff" />
      <Text style={styles.swipeActionText}>Start</Text>
    </Pressable>
  );
};

const RightActions = ({ onEdit }: { onEdit: () => void }) => {
  return (
    <Pressable 
      style={[styles.swipeAction, styles.editAction]}
      onPress={onEdit}
    >
      <FontAwesome name="edit" size={24} color="#fff" />
      <Text style={styles.swipeActionText}>Edit</Text>
    </Pressable>
  );
};

export default function WorkoutsScreen() {
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});
  
  // Close all open swipeables
  const closeAll = useCallback(() => {
    Object.values(swipeableRefs.current).forEach(ref => {
      ref?.close();
    });
  }, []);

  // Clean up swipe states when leaving the screen
  useEffect(() => {
    return () => {
      closeAll();
    };
  }, [closeAll]);

  const renderWorkoutItem = ({ item: workout }: { item: Workout }) => {
    const handleEdit = () => {
      closeAll();
      router.push({
        pathname: '/workout-editor',
        params: { workoutId: workout.id }
      });
    };

    const handleStart = () => {
      closeAll();
      router.push({
        pathname: '/workout-player',
        params: { workoutId: workout.id }
      });
    };

    return (
      <Swipeable
        ref={(ref) => {
          if (ref) {
            swipeableRefs.current[workout.id] = ref;
          }
        }}
        renderLeftActions={() => <LeftActions onStart={handleStart} />}
        renderRightActions={() => <RightActions onEdit={handleEdit} />}
        overshootLeft={false}
        overshootRight={false}
        onSwipeableWillOpen={() => {
          // Close all other swipeables when this one opens
          Object.entries(swipeableRefs.current).forEach(([id, ref]) => {
            if (id !== workout.id) {
              ref?.close();
            }
          });
        }}
      >
        <View style={styles.workoutCard}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{workout.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.description}>{workout.description}</Text>
          
          <View style={styles.workoutFooter}>
            <View style={styles.stat}>
              <FontAwesome name="clock-o" size={16} color="#666" />
              <Text style={styles.statText}>
                {workout.exercises.reduce((acc: number, ex) => acc + ex.duration, 0)}s
              </Text>
            </View>
            <View style={styles.stat}>
              <FontAwesome name="tasks" size={16} color="#666" />
              <Text style={styles.statText}>
                {workout.exercises.filter(ex => ex.type === 'exercise').length} exercises
              </Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={closeAll}
    >
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={renderWorkoutItem}
        contentContainerStyle={styles.list}
        onScrollBeginDrag={closeAll}
        ListHeaderComponent={
          <Pressable
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation(); // Prevent container's onPress from firing
              closeAll();
              router.push('/workout-editor');
            }}
          >
            <FontAwesome name="plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add Workout</Text>
          </Pressable>
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
    gap: 16,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  description: {
    color: '#666',
    fontSize: 14,
  },
  workoutFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#666',
    fontSize: 14,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: '100%',
  },
  startAction: {
    backgroundColor: '#22C55E', // green
  },
  editAction: {
    backgroundColor: '#2563EB', // blue
  },
  swipeActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
}); 