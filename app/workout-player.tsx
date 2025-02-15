import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

type WorkoutPhase = 'prepare' | 'work' | 'rest';

export default function WorkoutPlayer() {
  const [phase, setPhase] = useState<WorkoutPhase>('prepare');
  const [timeLeft, setTimeLeft] = useState(10); // Start with 10s preparation
  const [round, setRound] = useState(1);
  const [isActive, setIsActive] = useState(false);

  const totalRounds = 8;
  const workTime = 45;
  const restTime = 15;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Phase transition logic
      if (phase === 'prepare') {
        setPhase('work');
        setTimeLeft(workTime);
      } else if (phase === 'work') {
        if (round < totalRounds) {
          setPhase('rest');
          setTimeLeft(restTime);
        } else {
          setIsActive(false);
          // Workout complete
        }
      } else if (phase === 'rest') {
        setRound((r) => r + 1);
        setPhase('work');
        setTimeLeft(workTime);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, round]);

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
          headerTitle: 'Workout',
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <FontAwesome name="close" size={24} color="#000" />
            </Pressable>
          ),
        }}
      />

      <View style={styles.content}>
        <Text style={styles.phase}>
          {phase === 'prepare' ? 'Get Ready' : phase === 'work' ? 'Work' : 'Rest'}
        </Text>
        
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        
        <Text style={styles.rounds}>
          Round {round} of {totalRounds}
        </Text>

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
              setTimeLeft(10);
              setRound(1);
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
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rounds: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
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