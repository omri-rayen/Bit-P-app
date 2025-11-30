// screens/SettingsScreen.jsx
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import SystemMode from '../components/systemMode'; // adjust path if needed
import useSystemMode from '../hooks/useSystemMode';

export default function SettingsScreen () {
    const { isArmed, loading, error } = useSystemMode();

    return (
        <View style={styles.container} >
            {/* System mode component */}
            {loading && <ActivityIndicator size="small" color="#2f95dc" />}
            {error && <Text style={styles.placeholder}>Error: {error}</Text>}
            {isArmed !== null && <SystemMode initialIsArmed={isArmed} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
        paddingHorizontal: 16,
    },
    placeholder: {
        marginTop: 20,
        color: '#666',
    },
});
