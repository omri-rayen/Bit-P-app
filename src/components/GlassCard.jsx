import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius, shadows } from '../theme/colors';

export default function GlassCard({ children, style, gradient = false }) {
  if (gradient) {
    return (
      <LinearGradient
        colors={colors.gradients.card}
        style={[styles.card, shadows.card, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.innerGlow} />
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, shadows.card, style]}>
      <View style={styles.innerGlow} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.primary,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  innerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
