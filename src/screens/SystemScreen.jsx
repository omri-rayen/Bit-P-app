import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Log from '../components/log'; // adjust path if needed
import useLogs from '../hooks/useLogs';

export default function SystemScreen() {
  const { logs, loading, error, loadMore, hasMore } = useLogs(6);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.logsContainer}>
        {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}

        <FlatList
          data={logs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Log
              origin={item.origin}
              msg={item.msg}
              dName={item.dName}
              timestamp={item.timestamp}
            />
          )}
          contentContainerStyle={{ paddingBottom: 12 }}
        />
      </View>

      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : hasMore ? (
          <TouchableOpacity onPress={loadMore} accessibilityLabel="Load more">
            <Text style={styles.buttonText}>Load more</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.buttonText, { opacity: 0.6 }]}>No more logs</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logsContainer: {
    flex: 9.5,
    width: '100%',
    padding: 12
  },
  footer: {
    flex: 0.5,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '400'
  }
});