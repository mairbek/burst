import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { router } from 'expo-router';
import { workouts } from '../types/workout';
import { FontAwesome } from '@expo/vector-icons';

export default function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item: workout }) => (
          <Pressable
            style={styles.workoutCard}
            onPress={() => router.push({
              pathname: '/workout-player',
              params: { workoutId: workout.id }
            })}
          >
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
                  {workout.exercises.reduce((acc, ex) => acc + ex.duration, 0)}s
                </Text>
              </View>
              <View style={styles.stat}>
                <FontAwesome name="tasks" size={16} color="#666" />
                <Text style={styles.statText}>
                  {workout.exercises.filter(ex => ex.type === 'exercise').length} exercises
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
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
}); 