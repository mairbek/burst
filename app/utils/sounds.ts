import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

class SoundManager {
  private static isInitialized = false;
  private static voiceId = Platform.OS === 'ios' ? 'com.apple.ttsbundle.Samantha-compact' : undefined;

  static async initialize(): Promise<void> {
    console.log('🎵 Initializing SoundManager');
    if (this.isInitialized) {
      console.log('🎵 Already initialized');
      return;
    }
    
    if (Platform.OS === 'ios') {
      const voices = await Speech.getAvailableVoicesAsync();
      const enVoice = voices.find(v => v.identifier === this.voiceId);
      if (enVoice) {
        this.voiceId = enVoice.identifier;
        console.log('🎵 Using voice:', this.voiceId);
      }
    }
    
    this.isInitialized = true;
    console.log('🎵 Initialization complete');
  }

  static async playSound(name: string, params?: { exerciseName?: string; timeLeft?: number }): Promise<void> {
    console.log(`🔊 Playing sound: ${name}`, params);
    if (!this.isInitialized) {
      console.log('🎵 Not initialized, initializing now...');
      await this.initialize();
    }

    const options = {
      voice: this.voiceId,
      pitch: 1.0,
      rate: 0.9
    };

    try {
      switch (name) {
        case 'countdown':
          if (params?.timeLeft && params.timeLeft <= 5) {
            const numberWords = ['five', 'four', 'three', 'two', 'one'];
            const word = numberWords[5 - params.timeLeft];
            console.log(`🔊 Countdown: ${word}`);
            await Speech.speak(word, options);
          }
          break;
        case 'start':
          const startText = params?.exerciseName 
            ? `Start ${params.exerciseName}`
            : "Start exercise";
          console.log(`🔊 Start: ${startText}`);
          await Speech.speak(startText, options);
          break;
        case 'rest':
          console.log('🔊 Rest');
          await Speech.speak("Rest", options);
          break;
        case 'complete':
          console.log('🔊 Complete');
          await Speech.speak("Workout complete!", options);
          break;
      }
    } catch (error) {
      console.error(`❌ Error playing sound ${name}:`, error);
    }
  }

  static async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up SoundManager');
    await Speech.stop();
    this.isInitialized = false;
  }
}

export default SoundManager; 