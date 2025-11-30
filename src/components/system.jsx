import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import useSystemName from '../hooks/useSystemName';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import GlassCard from './GlassCard';
import { typography, spacing, borderRadius } from '../theme/colors';

export default function System() {
  const { sysName, loading, error } = useSystemName();
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <GlassCard style={styles.container} gradient>
      {/* Status indicator */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: theme.status.success, shadowColor: theme.status.success }]} />
        <Text style={[styles.statusText, { color: theme.status.success }]}>{t('system.active')}</Text>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text.secondary }]}>{t('common.connecting')}</Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={32} color={theme.status.error} />
            <Text style={[styles.error, { color: theme.status.error }]}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <View style={styles.systemInfo}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="shield-checkmark" size={28} color={theme.text.primary} />
              </LinearGradient>
            </View>
            <Text style={[styles.label, { color: theme.text.muted }]}>{t('system.systemName')}</Text>
            <Text style={[styles.name, { color: theme.text.primary }]}>{sysName ?? t('system.unknown')}</Text>
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
    marginRight: spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  statusText: {
    ...typography.small,
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
    marginTop: spacing.sm,
  },
  errorContainer: {
    alignItems: 'center',
  },
  error: {
    ...typography.caption,
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
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    ...typography.small,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h2,
    textAlign: 'center',
  },
});
