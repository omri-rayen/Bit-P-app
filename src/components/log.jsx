import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Log({ origin, msg, dName, timestamp }) {
  const backgroundColor =
    origin === 'system' ? '#DFF7E6' :
    origin === 'device' ? '#E8F0FF' :
    '#F5F5F5';

  const borderColor =
    origin === 'system' ? '#22c55e' :        // green border
    origin === 'device' ? '#3b82f6' :        // blue border
    '#94a3b8';                               // grey border

  const formattedTime = (() => {
    if (!timestamp && timestamp !== 0) return '';
    try {
      const t = typeof timestamp === 'number' || /^\d+$/.test(String(timestamp))
        ? new Date(Number(timestamp))
        : new Date(timestamp);
      if (isNaN(t)) return String(timestamp);
      return t.toLocaleString();
    } catch {
      return String(timestamp);
    }
  })();

  return (
    <View style={[styles.wrapper, { backgroundColor, borderColor }]}>
      <Text style={styles.msg} numberOfLines={0}>{msg}</Text>
      {dName ? <Text style={styles.dname}>{dName}</Text> : null}
      <Text style={styles.timestamp}>{formattedTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1
  },
  msg: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#0f172a'
  },
  dname: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 4,
    color: '#334155'
  },
  timestamp: {
    fontSize: 12,
    color: '#475569',
    alignSelf: 'flex-end'
  }
});