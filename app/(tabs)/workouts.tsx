import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const WORKOUTS = [
  {
    id: '1',
    name: 'HIIT Cardio',
    intervals: '45s work / 15s rest',
    rounds: 8,
  },
  {
    id: '2',
    name: 'Tabata Core',
    intervals: '20s work / 10s rest',
    rounds: 8,
  },
  {
    id: '3',
    name: 'Endurance',
    intervals: '60s work / 30s rest',
    rounds: 10,
  },
];

export default function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.createButton} onPress={() => {}}>
        <FontAwesome name="plus" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create New Workout</Text>
      </Pressable>

      <ScrollView>
        {WORKOUTS.map((workout) => (
          <Pressable key={workout.id} style={styles.workoutCard}>
            <View>
              <Text style={styles.workoutName}>{workout.name}</Text>
              <Text style={styles.workoutDetails}>
                {workout.intervals} • {workout.rounds} rounds
              </Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={styles.actionButton}>
                <FontAwesome name="play" size={20} color="#2563EB" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <FontAwesome name="edit" size={20} color="#2563EB" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutDetails: {
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
}); 