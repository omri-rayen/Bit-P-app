// components/RealtimeNotification.jsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  TouchableOpacity 
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, borderRadius } from '../theme/colors';

export default function RealtimeNotification({ log, onDismiss }) {
  const { theme } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (log) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss après 5 secondes
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [log]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!log) return null;

  // Déterminer l'icône et la couleur selon le type
  const getNotificationStyle = () => {
    if (log.deviceId === 'd239') {
      // Door sensor
      return {
        icon: log.isOpen ? 'lock-open' : 'lock-closed',
        color: log.isOpen ? theme.status.warning : theme.status.success,
        bgColor: log.isOpen ? theme.status.warningBg : theme.status.successBg,
        title: log.isOpen ? 'Porte ouverte' : 'Porte fermée',
      };
    } else if (log.deviceId === 'd254') {
      // Motion detector
      return {
        icon: 'walk',
        color: theme.status.info,
        bgColor: theme.status.infoBg,
        title: 'Mouvement détecté',
      };
    } else {
      // System log
      return {
        icon: 'notifications',
        color: theme.primary,
        bgColor: theme.isDark ? theme.primary + '15' : '#FFFFFF',
        title: 'Nouveau log système',
      };
    }
  };

  const style = getNotificationStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.notification, { 
        backgroundColor: theme.background.card,
        borderColor: style.color,
        shadowColor: style.color,
      }]}>
        <View style={[styles.iconContainer, { 
          backgroundColor: style.bgColor,
          borderWidth: theme.isDark ? 0 : 1,
          borderColor: theme.border.primary,
        }]}>
          <Ionicons name={style.icon} size={24} color={style.color} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text.primary }]}>
            {style.title}
          </Text>
          <Text style={[styles.message, { color: theme.text.secondary }]} numberOfLines={2}>
            {log.msg}
          </Text>
          {log.dName && (
            <Text style={[styles.device, { color: theme.text.muted }]}>
              {log.dName}
            </Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleDismiss}
        >
          <Ionicons name="close" size={20} color={theme.text.muted} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.caption,
    lineHeight: 18,
  },
  device: {
    ...typography.small,
    marginTop: spacing.xs,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
});
