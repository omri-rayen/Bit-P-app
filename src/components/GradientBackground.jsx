import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export default function GradientBackground({ children, style }) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }, style]}>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
