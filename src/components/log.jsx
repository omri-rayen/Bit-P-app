import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, typography, spacing, borderRadius, shadows } from '../theme/colors';

export default function Log({ origin, msg, dName, timestamp }) {
  const isSystem = origin === 'system';
  const isDevice = origin === 'device';

  const config = {
    system: {
      icon: 'server-outline',
      gradient: colors.gradients.accent,
      accentColor: colors.status.success,
      bgColor: colors.status.successBg,
      label: 'SYSTÈME',
    },
    device: {
      icon: 'hardware-chip-outline',
      gradient: colors.gradients.primary,
      accentColor: colors.status.info,
      bgColor: colors.status.infoBg,
      label: 'APPAREIL',
    },
    default: {
      icon: 'document-text-outline',
      gradient: colors.gradients.secondary,
      accentColor: colors.text.muted,
      bgColor: 'rgba(107, 114, 128, 0.15)',
      label: 'LOG',
    },
  };

  const currentConfig = isSystem ? config.system : isDevice ? config.device : config.default;

  const formattedTime = (() => {
    if (!timestamp && timestamp !== 0) return '';
    try {
      const t = typeof timestamp === 'number' || /^\d+$/.test(String(timestamp))
        ? new Date(Number(timestamp))
        : new Date(timestamp);
      if (isNaN(t)) return String(timestamp);
      return t.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(timestamp);
    }
  })();

  return (
    <View style={styles.wrapper}>
      {/* Accent line on the left */}
      <LinearGradient
        colors={currentConfig.gradient}
        style={styles.accentLine}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={[styles.badge, { backgroundColor: currentConfig.bgColor }]}>
            <Ionicons 
              name={currentConfig.icon} 
              size={12} 
              color={currentConfig.accentColor} 
            />
            <Text style={[styles.badgeText, { color: currentConfig.accentColor }]}>
              {currentConfig.label}
            </Text>
          </View>
          <Text style={styles.timestamp}>{formattedTime}</Text>
        </View>

        {/* Message */}
        <Text style={styles.msg} numberOfLines={0}>{msg}</Text>

        {/* Device name if available */}
        {dName && (
          <View style={styles.deviceRow}>
            <Ionicons name="link-outline" size={14} color={colors.text.muted} />
            <Text style={styles.dname}>{dName}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.secondary,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  accentLine: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.small,
    fontWeight: '600',
    marginLeft: spacing.xs,
    letterSpacing: 1,
  },
  timestamp: {
    ...typography.small,
    color: colors.text.muted,
  },
  msg: {
    ...typography.body,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dname: {
    ...typography.caption,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
});