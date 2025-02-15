import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voicePrompts, setVoicePrompts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Settings</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch 
            value={soundEnabled}
            onValueChange={setSoundEnabled}
          />
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Voice Prompts</Text>
          <Switch 
            value={voicePrompts}
            onValueChange={setVoicePrompts}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.setting}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch 
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Pressable style={styles.aboutItem}>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
        </Pressable>
        <Pressable style={styles.aboutItem}>
          <Text style={styles.aboutText}>Privacy Policy</Text>
        </Pressable>
        <Pressable style={styles.aboutItem}>
          <Text style={styles.aboutText}>Terms of Service</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666',
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  aboutItem: {
    paddingVertical: 12,
  },
  aboutText: {
    fontSize: 16,
  },
}); 