import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import useDevices from '../hooks/useDevices';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import GlassCard from './GlassCard';
import { spacing, borderRadius } from '../theme/colors';

// Mapping des types d'appareils vers des icônes et couleurs
const getDeviceConfig = (t) => ({
  windowSensor: {
    icon: 'apps-outline',
    label: t('devices.windowSensor'),
    color: '#3B82F6',
  },
  motionSensor: {
    icon: 'walk-outline',
    label: t('devices.motionSensor'),
    color: '#8B5CF6',
  },
  doorSensor: {
    icon: 'enter-outline',
    label: t('devices.doorSensor'),
    color: '#10B981',
  },
  camera: {
    icon: 'videocam-outline',
    label: t('devices.camera'),
    color: '#F59E0B',
  },
  default: {
    icon: 'hardware-chip-outline',
    label: t('devices.device'),
    color: '#6366F1',
  },
});

function DeviceCard({ device, t, theme }) {
  const deviceConfig = getDeviceConfig(t);
  const config = deviceConfig[device.dType] || deviceConfig.default;

  return (
    <View style={[styles.deviceCard, { backgroundColor: theme.background.secondary, borderColor: theme.border.primary }]}>
      <View style={[styles.deviceIconContainer, { backgroundColor: theme.isDark ? config.color + '15' : '#FFFFFF', borderWidth: theme.isDark ? 0 : 1, borderColor: theme.border.primary }]}>
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>
      
      <View style={styles.deviceInfo}>
        <Text style={[styles.deviceName, { color: theme.text.primary }]}>{device.dName}</Text>
        <Text style={[styles.deviceType, { color: theme.text.muted }]}>{config.label}</Text>
      </View>
      
      <View style={[styles.statusDot, { backgroundColor: theme.status.success }]} />
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
        <View style={[styles.headerIcon, { backgroundColor: theme.isDark ? theme.primary + '15' : '#FFFFFF', borderWidth: theme.isDark ? 0 : 1, borderColor: theme.border.primary }]}>
          <Ionicons name="hardware-chip-outline" size={22} color={theme.primary} />
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, { color: theme.text.primary }]}>{t('devices.connectedDevices')}</Text>
          {devices && devices.length > 0 && (
            <Text style={[styles.deviceCount, { color: theme.text.muted }]}>{devices.length} {t('devices.device')}{devices.length > 1 ? 's' : ''}</Text>
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
            <DeviceCard key={`${device.dName}-${index}`} device={device} t={t} theme={theme} />
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
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  deviceCount: {
    fontSize: 12,
    fontWeight: '400' as const,
    marginTop: 2,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '400' as const,
    marginTop: spacing.md,
  },
  errorIconWrapper: {
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400' as const,
    textAlign: 'center' as const,
  },
  devicesList: {
    width: '100%',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  deviceIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  deviceType: {
    fontSize: 12,
    fontWeight: '400' as const,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '400' as const,
    marginTop: spacing.md,
  },
});
