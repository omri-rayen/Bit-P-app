// components/systemMode.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from './GlassCard';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/colors';

export default function SystemMode({ initialIsArmed = true }) {
  const [isArmed, setIsArmed] = useState(Boolean(initialIsArmed));
  const [pulseAnim] = useState(new Animated.Value(1));

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

  const toggleSwitch = () => setIsArmed(previousState => !previousState);

  return (
    <GlassCard style={styles.container} gradient>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons 
          name="shield-checkmark" 
          size={20} 
          color={colors.text.secondary} 
        />
        <Text style={styles.headerTitle}>MODE SYSTÈME</Text>
      </View>

      {/* Status Display */}
      <View style={styles.statusContainer}>
        <Animated.View 
          style={[
            styles.statusCircle,
            isArmed ? styles.armedCircle : styles.disarmedCircle,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <LinearGradient
            colors={isArmed ? colors.gradients.accent : [colors.status.error, '#B91C1C']}
            style={styles.statusGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons 
              name={isArmed ? 'shield-checkmark' : 'shield-outline'} 
              size={48} 
              color={colors.text.primary} 
            />
          </LinearGradient>
        </Animated.View>
        
        <Text style={[styles.statusText, isArmed ? styles.armedText : styles.disarmedText]}>
          {isArmed ? 'ARMÉ' : 'DÉSARMÉ'}
        </Text>
        <Text style={styles.statusDescription}>
          {isArmed 
            ? 'Le système est actif et surveille votre propriété' 
            : 'Le système est en veille - surveillance désactivée'}
        </Text>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, !isArmed && styles.activeButton]}
          onPress={() => setIsArmed(false)}
          activeOpacity={0.7}
        >
          <View style={[styles.buttonInner, !isArmed && styles.disarmedButtonActive]}>
            <Ionicons 
              name="lock-open-outline" 
              size={20} 
              color={!isArmed ? colors.text.primary : colors.text.muted} 
            />
            <Text style={[styles.buttonText, !isArmed && styles.activeButtonText]}>
              Désarmer
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, isArmed && styles.activeButton]}
          onPress={() => setIsArmed(true)}
          activeOpacity={0.7}
        >
          {isArmed ? (
            <LinearGradient
              colors={colors.gradients.accent}
              style={styles.buttonInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="lock-closed" size={20} color={colors.text.primary} />
              <Text style={[styles.buttonText, styles.activeButtonText]}>Armer</Text>
            </LinearGradient>
          ) : (
            <View style={styles.buttonInner}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.text.muted} />
              <Text style={styles.buttonText}>Armer</Text>
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
    color: colors.text.secondary,
    letterSpacing: 2,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusCircle: {
    marginBottom: spacing.lg,
  },
  armedCircle: {
    ...shadows.glow,
    shadowColor: colors.status.success,
  },
  disarmedCircle: {
    ...shadows.glow,
    shadowColor: colors.status.error,
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
  armedText: {
    color: colors.status.success,
  },
  disarmedText: {
    color: colors.status.error,
  },
  statusDescription: {
    ...typography.caption,
    color: colors.text.muted,
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
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.primary,
  },
  disarmedButtonActive: {
    backgroundColor: colors.status.error,
    borderColor: colors.status.error,
  },
  buttonText: {
    ...typography.body,
    color: colors.text.muted,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  activeButtonText: {
    color: colors.text.primary,
  },
});