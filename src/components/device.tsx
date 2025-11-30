import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import useDevices from '../hooks/useDevices';
import GlassCard from './GlassCard';
import { colors, typography, spacing, shadows, borderRadius } from '../theme/colors';

// Mapping des types d'appareils vers des icônes et couleurs
const deviceConfig = {
  windowSensor: {
    icon: 'apps-outline',
    label: 'Capteur Fenêtre',
    gradient: ['#3B82F6', '#1D4ED8'],
  },
  motionSensor: {
    icon: 'walk-outline',
    label: 'Capteur Mouvement',
    gradient: ['#8B5CF6', '#6D28D9'],
  },
  doorSensor: {
    icon: 'enter-outline',
    label: 'Capteur Porte',
    gradient: ['#10B981', '#059669'],
  },
  camera: {
    icon: 'videocam-outline',
    label: 'Caméra',
    gradient: ['#F59E0B', '#D97706'],
  },
  default: {
    icon: 'hardware-chip-outline',
    label: 'Appareil',
    gradient: colors.gradients.secondary,
  },
};

function DeviceCard({ device, index }) {
  const config = deviceConfig[device.dType] || deviceConfig.default;

  return (
    <View style={styles.deviceCard}>
      <LinearGradient
        colors={config.gradient}
        style={styles.deviceIconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={config.icon} size={22} color={colors.text.primary} />
      </LinearGradient>
      
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.dName}</Text>
        <Text style={styles.deviceType}>{config.label}</Text>
      </View>
      
      <View style={styles.statusIndicator}>
        <View style={styles.statusDot} />
      </View>
    </View>
  );
}

export default function Device() {
  const { devices, loading, error } = useDevices();

  return (
    <GlassCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={colors.gradients.secondary}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="hardware-chip-outline" size={24} color={colors.text.primary} />
          </LinearGradient>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>APPAREILS CONNECTÉS</Text>
          {devices && devices.length > 0 && (
            <Text style={styles.deviceCount}>{devices.length} appareil{devices.length > 1 ? 's' : ''}</Text>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Recherche d'appareils...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerContent}>
          <View style={styles.errorIconWrapper}>
            <Ionicons name="alert-circle" size={40} color={colors.status.error} />
          </View>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {!loading && !error && devices && devices.length > 0 && (
        <View style={styles.devicesList}>
          {devices.map((device, index) => (
            <DeviceCard key={`${device.dName}-${index}`} device={device} index={index} />
          ))}
        </View>
      )}

      {!loading && !error && (!devices || devices.length === 0) && (
        <View style={styles.centerContent}>
          <Ionicons name="search-outline" size={40} color={colors.text.muted} />
          <Text style={styles.placeholder}>Aucun appareil disponible</Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconWrapper: {
    marginRight: spacing.md,
  },
  iconGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.small,
    color: colors.text.secondary,
    letterSpacing: 2,
    fontWeight: '600',
  },
  deviceCount: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 2,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorIconWrapper: {
    marginBottom: spacing.sm,
  },
  error: {
    ...typography.caption,
    color: colors.status.error,
    textAlign: 'center',
  },
  devicesList: {
    width: '100%',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.secondary,
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  deviceType: {
    ...typography.small,
    color: colors.text.muted,
    marginTop: 2,
  },
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.status.success,
    ...shadows.glow,
    shadowColor: colors.status.success,
  },
  placeholder: {
    ...typography.body,
    color: colors.text.muted,
    marginTop: spacing.md,
  },
});
