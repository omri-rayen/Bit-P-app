import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useDevices from '../hooks/useDevices';

export default function Device() {
  const { currentDevice, loading, error } = useDevices();

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="small" color="#2f95dc" />}

      {!loading && error && <Text style={styles.error}>Error: {error}</Text>}

      {!loading && !error && currentDevice && (
        <View style={styles.info}>
          <Text style={styles.label}>Device:</Text>
          <Text style={styles.value}>{currentDevice.dName}</Text>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{currentDevice.dType}</Text>
        </View>
      )}

      {!loading && !error && !currentDevice && (
        <Text style={styles.placeholder}>No devices available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  placeholder: {
    color: '#666',
  },
  error: {
    color: '#c0392b',
  },
});
