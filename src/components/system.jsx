import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import useSystemName from '../hooks/useSystemName';
import { useLanguage } from '../i18n/LanguageContext';
import GlassCard from './GlassCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/colors';

export default function System() {
  const { sysName, loading, error } = useSystemName();
  const { t } = useLanguage();

  return (
    <GlassCard style={styles.container} gradient>
      {/* Status indicator */}
      <View style={styles.statusRow}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>{t('system.active')}</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{t('common.connecting')}</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={32} color={colors.status.error} />
            <Text style={styles.error}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <View style={styles.systemInfo}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={colors.gradients.primary}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="shield-checkmark" size={28} color={colors.text.primary} />
              </LinearGradient>
            </View>
            <Text style={styles.label}>{t('system.systemName')}</Text>
            <Text style={styles.name}>{sysName ?? t('system.unknown')}</Text>
          </View>
        )}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
    marginRight: spacing.sm,
    ...shadows.glow,
    shadowColor: colors.status.success,
  },
  statusText: {
    ...typography.small,
    color: colors.status.success,
    letterSpacing: 2,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.sm,
  },
  errorContainer: {
    alignItems: 'center',
  },
  error: {
    ...typography.caption,
    color: colors.status.error,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  systemInfo: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.glow,
  },
  label: {
    ...typography.small,
    color: colors.text.muted,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
  },
});
