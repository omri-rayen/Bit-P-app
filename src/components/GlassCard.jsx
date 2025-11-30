import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { borderRadius } from '../theme/colors';

export default function GlassCard({ children, style }) {
  const { theme, isDark } = useTheme();
  
  const cardStyle = {
    backgroundColor: theme.background.card,
    borderColor: theme.border.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.08,
    shadowRadius: 8,
    elevation: 3,
  };

  return (
    <View style={[styles.card, cardStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: 16,
  },
});
