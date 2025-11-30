import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, borderRadius } from '../theme/colors';

export default function Log({ origin, msg, dName, timestamp }) {
  const { theme } = useTheme();
  const isSystem = origin === 'system';
  const isDevice = origin === 'device';

  const config = {
    system: {
      icon: 'server-outline',
      gradient: theme.gradients.accent,
      accentColor: theme.status.success,
      bgColor: theme.status.successBg,
      label: 'SYSTÈME',
    },
    device: {
      icon: 'hardware-chip-outline',
      gradient: theme.gradients.primary,
      accentColor: theme.status.info,
      bgColor: theme.status.infoBg,
      label: 'APPAREIL',
    },
    default: {
      icon: 'document-text-outline',
      gradient: theme.gradients.secondary,
      accentColor: theme.text.muted,
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
    <View style={[styles.wrapper, { backgroundColor: theme.background.card, borderColor: theme.border.secondary }]}>
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
          <Text style={[styles.timestamp, { color: theme.text.muted }]}>{formattedTime}</Text>
        </View>

        {/* Message */}
        <Text style={[styles.msg, { color: theme.text.primary }]} numberOfLines={0}>{msg}</Text>

        {/* Device name if available */}
        {dName && (
          <View style={styles.deviceRow}>
            <Ionicons name="link-outline" size={14} color={theme.text.muted} />
            <Text style={[styles.dname, { color: theme.text.secondary }]}>{dName}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  },
  msg: {
    ...typography.body,
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
    marginLeft: spacing.xs,
  },
});