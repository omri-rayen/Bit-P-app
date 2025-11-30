import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Log from '../components/log'; // adjust path if needed

export default function SystemScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logsContainer}>
        {/* Example logs (rendered twice as requested) */}
        <Log
          origin="system"
          msg="System rebooted successfully."
          dName={null}
          timestamp={Date.now() - 1000 * 60 * 5} // 5 minutes ago
        />

        <Log
          origin="device"
          msg="Motion detected in living room."
          dName="Device-42"
          timestamp={Date.now()}
        />
        
        <Log
          origin="device"
          msg="Motion detected in living room."
          dName="Device-42"
          timestamp={Date.now()}
        />
        
        <Log
          origin="device"
          msg="Motion detected in living room."
          dName="Device-42"
          timestamp={Date.now()}
        />
        
        <Log
          origin="device"
          msg="Motion detected in living room."
          dName="Device-42"
          timestamp={Date.now()}
        />
        
        <Log
          origin="device"
          msg="Motion detected in living room."
          dName="Device-42"
          timestamp={Date.now()}
        />
        
      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => { /* nothing for now */ }} accessibilityLabel="Load more">
          <Text style={styles.buttonText}>Load more</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40
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
