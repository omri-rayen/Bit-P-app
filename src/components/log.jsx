import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, borderRadius } from '../theme/colors';

export default function Log({ origin, msg, dName, timestamp, deviceId, isOpen, isRealtime }) {
  const { theme } = useTheme();
  const isSystem = origin === 'system';
  const isDevice = origin === 'device';
  
  // Déterminer le type de capteur basé sur deviceId
  const isDoorSensor = deviceId === 'd239';
  const isMotionDetector = deviceId === 'd254';

  const config = {
    system: {
      icon: 'server-outline',
      accentColor: theme.status.success,
      bgColor: theme.status.successBg,
      label: 'SYSTÈME',
    },
    device: {
      icon: 'hardware-chip-outline',
      accentColor: theme.status.info,
      bgColor: theme.status.infoBg,
      label: 'APPAREIL',
    },
    default: {
      icon: 'document-text-outline',
      accentColor: theme.text.muted,
      bgColor: theme.background.tertiary,
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
    <View style={[styles.wrapper, { backgroundColor: theme.background.card, borderColor: theme.border.primary }]}>
      {/* Accent line on the left */}
      <View style={[styles.accentLine, { backgroundColor: currentConfig.accentColor }]} />
      
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

        {/* Statut spécifique pour door sensor */}
        {isDoorSensor && isOpen !== null && (
          <View style={styles.statusRow}>
            <Ionicons 
              name={isOpen ? "lock-open" : "lock-closed"} 
              size={14} 
              color={isOpen ? theme.status.warning : theme.status.success} 
            />
            <Text style={[styles.statusText, { 
              color: isOpen ? theme.status.warning : theme.status.success 
            }]}>
              {isOpen ? 'Porte ouverte' : 'Porte fermée'}
            </Text>
          </View>
        )}

        {/* Indicateur de mouvement détecté */}
        {isMotionDetector && (
          <View style={styles.statusRow}>
            <Ionicons 
              name="walk" 
              size={14} 
              color={theme.status.info} 
            />
            <Text style={[styles.statusText, { color: theme.status.info }]}>
              Mouvement détecté
            </Text>
          </View>
        )}

        {/* Badge temps réel */}
        {isRealtime && (
          <View style={[styles.realtimeBadge, { backgroundColor: theme.status.successBg }]}>
            <View style={[styles.realtimeDot, { backgroundColor: theme.status.success }]} />
            <Text style={[styles.realtimeText, { color: theme.status.success }]}>Temps réel</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentLine: {
    width: 3,
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
  },
  timestamp: {
    ...typography.small,
  },
  msg: {
    ...typography.body,
    lineHeight: 22,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  dname: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusText: {
    ...typography.caption,
    marginLeft: spacing.xs,
    fontWeight: '600',
  },
  realtimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  realtimeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing.xs,
  },
  realtimeText: {
    ...typography.small,
    fontWeight: '600',
  },
});