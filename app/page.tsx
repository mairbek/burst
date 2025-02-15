import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Master Your Intervals</Text>
        <Text style={styles.subtitle}>
          The perfect tool for HIIT, Tabata, and custom interval workouts
        </Text>
        <Link href="/workouts" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Start Training</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>HIIT Workouts</Text>
          <Text style={styles.cardText}>High-intensity interval training for maximum results</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tabata Timer</Text>
          <Text style={styles.cardText}>20 seconds on, 10 seconds off - classic Tabata intervals</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Custom Intervals</Text>
          <Text style={styles.cardText}>Create your own interval patterns for any workout</Text>
        </View>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureGrid}>
          {[
            {
              title: 'Customizable Timers',
              description: 'Set work and rest intervals to match your training needs'
            },
            {
              title: 'Voice Prompts',
              description: 'Stay focused with audio cues for interval changes'
            },
            {
              title: 'Workout History',
              description: 'Track your progress and review past sessions'
            },
            {
              title: 'Preset Workouts',
              description: 'Choose from popular interval training templates'
            }
          ].map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureText}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    marginVertical: 24,
  },
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    color: '#666',
  },
  features: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureGrid: {
    gap: 16,
  },
  featureCard: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureText: {
    color: '#666',
  },
}); 