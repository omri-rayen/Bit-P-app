import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';
import { borderRadius } from '../theme/colors';

export default function GlassCard({ children, style, gradient = false }) {
  const { theme, isDark } = useTheme();
  
  const cardShadow = {
    shadowColor: isDark ? '#000' : '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 12,
    elevation: 8,
  };

  if (gradient) {
    return (
      <LinearGradient
        colors={theme.gradients.card}
        style={[styles.card, cardShadow, { borderColor: theme.border.primary }, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.innerGlow, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)' }]} />
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, cardShadow, { backgroundColor: theme.background.card, borderColor: theme.border.primary }, style]}>
      <View style={[styles.innerGlow, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)' }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
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
  },
});
