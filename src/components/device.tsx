import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import useDevices from '../hooks/useDevices';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import GlassCard from './GlassCard';
import { typography, spacing, borderRadius } from '../theme/colors';

// Mapping des types d'appareils vers des icônes et couleurs
const getDeviceConfig = (t, theme) => ({
  windowSensor: {
    icon: 'apps-outline',
    label: t('devices.windowSensor'),
    gradient: ['#3B82F6', '#1D4ED8'],
  },
  motionSensor: {
    icon: 'walk-outline',
    label: t('devices.motionSensor'),
    gradient: ['#8B5CF6', '#6D28D9'],
  },
  doorSensor: {
    icon: 'enter-outline',
    label: t('devices.doorSensor'),
    gradient: ['#10B981', '#059669'],
  },
  camera: {
    icon: 'videocam-outline',
    label: t('devices.camera'),
    gradient: ['#F59E0B', '#D97706'],
  },
  default: {
    icon: 'hardware-chip-outline',
    label: t('devices.device'),
    gradient: theme.gradients.secondary,
  },
});

function DeviceCard({ device, index, t, theme }) {
  const deviceConfig = getDeviceConfig(t, theme);
  const config = deviceConfig[device.dType] || deviceConfig.default;

  return (
    <View style={[styles.deviceCard, { backgroundColor: theme.background.glass, borderColor: theme.border.secondary }]}>
      <LinearGradient
        colors={config.gradient}
        style={styles.deviceIconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={config.icon} size={22} color={theme.text.primary} />
      </LinearGradient>
      
      <View style={styles.deviceInfo}>
        <Text style={[styles.deviceName, { color: theme.text.primary }]}>{device.dName}</Text>
        <Text style={[styles.deviceType, { color: theme.text.muted }]}>{config.label}</Text>
      </View>
      
      <View style={styles.statusIndicator}>
        <View style={[styles.statusDot, { backgroundColor: theme.status.success, shadowColor: theme.status.success }]} />
      </View>
    </View>
  );
}

export default function Device() {
  const { devices, loading, error } = useDevices();
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <GlassCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={theme.gradients.secondary}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="hardware-chip-outline" size={24} color={theme.text.primary} />
          </LinearGradient>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: theme.text.secondary }]}>{t('devices.connectedDevices')}</Text>
          {devices && devices.length > 0 && (
            <Text style={[styles.deviceCount, { color: theme.primary }]}>{devices.length} {t('devices.device')}{devices.length > 1 ? 's' : ''}</Text>
          )}
        </View>
      </View>

      {loading && (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text.secondary }]}>{t('devices.searching')}</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.centerContent}>
          <View style={styles.errorIconWrapper}>
            <Ionicons name="alert-circle" size={40} color={theme.status.error} />
          </View>
          <Text style={[styles.errorText, { color: theme.status.error }]}>{error}</Text>
        </View>
      )}

      {!loading && !error && devices && devices.length > 0 && (
        <View style={styles.devicesList}>
          {devices.map((device, index) => (
            <DeviceCard key={`${device.dName}-${index}`} device={device} index={index} t={t} theme={theme} />
          ))}
        </View>
      )}

      {!loading && !error && (!devices || devices.length === 0) && (
        <View style={styles.centerContent}>
          <Ionicons name="search-outline" size={40} color={theme.text.muted} />
          <Text style={[styles.placeholder, { color: theme.text.muted }]}>{t('devices.noDevices')}</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.small,
    letterSpacing: 2,
    fontWeight: '600' as const,
  },
  deviceCount: {
    ...typography.caption,
    marginTop: 2,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.caption,
    marginTop: spacing.md,
  },
  errorIconWrapper: {
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    textAlign: 'center' as const,
  },
  devicesList: {
    width: '100%',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
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
    fontWeight: '600' as const,
  },
  deviceType: {
    ...typography.small,
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  placeholder: {
    ...typography.body,
    marginTop: spacing.md,
  },
});
