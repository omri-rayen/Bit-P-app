// components/systemMode.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import useMQTT from '../hooks/useMQTT';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing, borderRadius } from '../theme/colors';

const MQTT_TOPIC_SET_MODE = 'system/cmd/setMode';

export default function SystemMode({ initialIsArmed = true }) {
  const [isArmed, setIsArmed] = useState(Boolean(initialIsArmed));
  const { isConnected, publish } = useMQTT();
  const { t } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    setIsArmed(Boolean(initialIsArmed));
  }, [initialIsArmed]);

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
    <GlassCard style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons 
          name="shield-checkmark" 
          size={18} 
          color={theme.text.secondary} 
        />
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>{t('mode.title')}</Text>
        {/* Indicateur de connexion MQTT */}
        <View style={[
          styles.mqttIndicator, 
          { backgroundColor: isConnected ? theme.status.success : theme.status.error }
        ]} />
      </View>

      {/* Status Display */}
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusCircle,
          { 
            backgroundColor: theme.isDark 
              ? (isArmed ? theme.status.success + '15' : theme.status.error + '15')
              : '#FFFFFF',
            borderWidth: theme.isDark ? 0 : 1,
            borderColor: isArmed ? theme.status.success : theme.status.error
          }
        ]}>
          <Ionicons 
            name={isArmed ? 'shield-checkmark' : 'shield-outline'} 
            size={40} 
            color={isArmed ? theme.status.success : theme.status.error} 
          />
        </View>
        
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
          style={[
            styles.toggleButton,
            { 
              backgroundColor: !isArmed ? theme.status.error : theme.background.tertiary,
              borderColor: !isArmed ? theme.status.error : theme.border.primary,
            }
          ]}
          onPress={() => setMode(false)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="lock-open-outline" 
            size={18} 
            color={!isArmed ? '#FFFFFF' : theme.text.muted} 
          />
          <Text style={[styles.buttonText, { color: !isArmed ? '#FFFFFF' : theme.text.muted }]}>
            {t('mode.disarm')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            { 
              backgroundColor: isArmed ? theme.status.success : theme.background.tertiary,
              borderColor: isArmed ? theme.status.success : theme.border.primary,
            }
          ]}
          onPress={() => setMode(true)}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isArmed ? 'lock-closed' : 'lock-closed-outline'} 
            size={18} 
            color={isArmed ? '#FFFFFF' : theme.text.muted} 
          />
          <Text style={[styles.buttonText, { color: isArmed ? '#FFFFFF' : theme.text.muted }]}>
            {t('mode.arm')}
          </Text>
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
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.body,
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
    marginBottom: spacing.lg,
  },
  statusCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  statusText: {
    ...typography.h3,
    fontWeight: '600',
    marginBottom: spacing.xs,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  buttonText: {
    ...typography.body,
    fontWeight: '500',
    marginLeft: spacing.sm,
  },
});