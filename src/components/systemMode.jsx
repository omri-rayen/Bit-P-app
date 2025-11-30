// components/systemMode.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import useMQTT from '../hooks/useMQTT';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, borderRadius } from '../theme/colors';

const MQTT_TOPIC_SET_MODE = 'system/cmd/setMode';

export default function SystemMode({ initialIsArmed = true }) {
  const [isArmed, setIsArmed] = useState(Boolean(initialIsArmed));
  const [pulseAnim] = useState(new Animated.Value(1));
  const { isConnected, publish } = useMQTT();
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    setIsArmed(Boolean(initialIsArmed));
  }, [initialIsArmed]);

  useEffect(() => {
    // Pulse animation for armed state
    if (isArmed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isArmed]);

  // Fonction pour changer le mode et publier sur MQTT
  const setMode = (newMode) => {
    setIsArmed(newMode);
    
    // Publier le nouveau mode sur MQTT
    const payload = { isArmed: newMode };
    const success = publish(MQTT_TOPIC_SET_MODE, payload);
    
    if (success) {
      console.log(`[SystemMode] Mode publié: ${newMode ? 'Armé' : 'Désarmé'}`);
    } else {
      console.warn('[SystemMode] Échec de publication MQTT - non connecté');
    }
  };

  return (
    <GlassCard style={styles.container} gradient>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons 
          name="shield-checkmark" 
          size={20} 
          color={theme.text.secondary} 
        />
        <Text style={[styles.headerTitle, { color: theme.text.secondary }]}>{t('mode.title')}</Text>
        {/* Indicateur de connexion MQTT */}
        <View style={[
          styles.mqttIndicator, 
          { backgroundColor: isConnected ? theme.status.success : theme.status.error }
        ]} />
      </View>

      {/* Status Display */}
      <View style={styles.statusContainer}>
        <Animated.View 
          style={[
            styles.statusCircle,
            { 
              shadowColor: isArmed ? theme.status.success : theme.status.error,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
            },
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={isArmed ? theme.gradients.accent : [theme.status.error, '#B91C1C']}
            style={styles.statusGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons 
              name={isArmed ? 'shield-checkmark' : 'shield-outline'} 
              size={48} 
              color={theme.text.primary} 
            />
          </LinearGradient>
        </Animated.View>
        
        <Text style={[styles.statusText, { color: isArmed ? theme.status.success : theme.status.error }]}>
          {isArmed ? t('mode.armed') : t('mode.disarmed')}
        </Text>
        <Text style={[styles.statusDescription, { color: theme.text.muted }]}>
          {isArmed 
            ? t('mode.armedDesc') 
            : t('mode.disarmedDesc')}
        </Text>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setMode(false)}
          activeOpacity={0.7}
        >
          <View style={[
            styles.buttonInner, 
            { 
              backgroundColor: !isArmed ? theme.status.error : theme.background.tertiary,
              borderColor: !isArmed ? theme.status.error : theme.border.primary,
            }
          ]}>
            <Ionicons 
              name="lock-open-outline" 
              size={20} 
              color={!isArmed ? theme.text.primary : theme.text.muted} 
            />
            <Text style={[styles.buttonText, { color: !isArmed ? theme.text.primary : theme.text.muted }]}>
              {t('mode.disarm')}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setMode(true)}
          activeOpacity={0.7}
        >
          {isArmed ? (
            <LinearGradient
              colors={theme.gradients.accent}
              style={styles.buttonInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="lock-closed" size={20} color={theme.text.primary} />
              <Text style={[styles.buttonText, { color: theme.text.primary }]}>{t('mode.arm')}</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.buttonInner, { backgroundColor: theme.background.tertiary, borderColor: theme.border.primary }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.text.muted} />
              <Text style={[styles.buttonText, { color: theme.text.muted }]}>{t('mode.arm')}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
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
    marginBottom: spacing.xl,
  },
  headerTitle: {
    ...typography.small,
    letterSpacing: 2,
    fontWeight: '600',
    marginLeft: spacing.sm,
    flex: 1,
  },
  mqttIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusCircle: {
    marginBottom: spacing.lg,
  },
  statusGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    ...typography.h2,
    letterSpacing: 4,
    marginBottom: spacing.sm,
  },
  statusDescription: {
    ...typography.caption,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toggleButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});