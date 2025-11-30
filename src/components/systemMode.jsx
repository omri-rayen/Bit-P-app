// components/systemMode.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SystemMode({ initialIsArmed = true }) {
  const [isArmed, setIsArmed] = useState(Boolean(initialIsArmed)); // true = armed, false = disarmed

  useEffect(() => {
    setIsArmed(Boolean(initialIsArmed));
  }, [initialIsArmed]);

  const toggleSwitch = () => setIsArmed(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>System mode :</Text>

      <Text style={[styles.modeText, !isArmed && styles.inactive]}>Disarmed</Text>

      <Switch
        onValueChange={toggleSwitch}
        value={isArmed}
        trackColor={{ false: '#ccc', true: '#2f95dc' }}
        thumbColor={isArmed ? '#fff' : '#fff'}
      />

      <Text style={[styles.modeText, isArmed && styles.active]}>Armed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  label: {
    fontWeight: '600',
    marginRight: 8,
  },
  modeText: {
    fontWeight: '500',
    marginHorizontal: 8,
    color: '#555',
  },
  active: {
    color: '#2f95dc',
  },
  inactive: {
    color: '#c0392b',
  },
});