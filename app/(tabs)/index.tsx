import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';

const RECENT_WORKOUTS = [
  { id: '1', name: 'HIIT Cardio', duration: '30 min' },
  { id: '2', name: 'Tabata Core', duration: '20 min' },
  { id: '3', name: 'Custom Workout', duration: '45 min' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <Link href="/workout-player" asChild>
          <Pressable style={styles.startButton}>
            <Text style={styles.startButtonText}>Start New Workout</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {RECENT_WORKOUTS.map((workout) => (
          <Pressable 
            key={workout.id} 
            style={styles.workoutCard}
            onPress={() => {}}
          >
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutDuration}>{workout.duration}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Templates</Text>
        <View style={styles.templateGrid}>
          <Pressable style={styles.templateCard} onPress={() => {}}>
            <Text style={styles.templateTitle}>Tabata</Text>
            <Text style={styles.templateDesc}>20s work / 10s rest</Text>
          </Pressable>
          <Pressable style={styles.templateCard} onPress={() => {}}>
            <Text style={styles.templateTitle}>HIIT</Text>
            <Text style={styles.templateDesc}>45s work / 15s rest</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutCard: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
  },
  workoutDuration: {
    color: '#666',
  },
  templateGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  templateCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  templateDesc: {
    color: '#666',
    fontSize: 14,
  },
});
