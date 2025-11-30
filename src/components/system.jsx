import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useSystemName from '../hooks/useSystemName';

export default function System() {
  const { sysName, loading, error } = useSystemName();

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="small" color="#2f95dc" />}
      {!loading && error && <Text style={styles.error}>Error: {error}</Text>}
      {!loading && !error && (
        <Text style={styles.name}>{sysName ?? 'Unknown System'}</Text>
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
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  error: {
    color: '#c0392b',
  },
});
