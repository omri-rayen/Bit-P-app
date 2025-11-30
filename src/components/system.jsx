import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import useSystemName from '../hooks/useSystemName';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import GlassCard from './GlassCard';
import { typography, spacing } from '../theme/colors';

export default function System() {
  const { sysName, loading, error } = useSystemName();
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <GlassCard style={styles.container}>
      {/* Status indicator */}
      <View style={styles.statusRow}>
        <View style={[styles.statusDot, { backgroundColor: theme.status.success }]} />
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
            <Ionicons name="warning-outline" size={28} color={theme.status.error} />
            <Text style={[styles.error, { color: theme.status.error }]}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
          <View style={styles.systemInfo}>
            <View style={[styles.iconContainer, { backgroundColor: theme.isDark ? theme.primary + '15' : '#FFFFFF', borderWidth: theme.isDark ? 0 : 1, borderColor: theme.border.primary }]}>
              <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
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
  },
  statusText: {
    ...typography.small,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.small,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h2,
    textAlign: 'center',
  },
});
