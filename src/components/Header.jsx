import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography, spacing } from '../theme/colors';

export default function Header({ title, subtitle, loading = false }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text.primary }]}>{title}</Text>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={theme.primary} 
            style={styles.loader}
          />
        )}
      </View>
      {subtitle && <Text style={[styles.subtitle, { color: theme.text.secondary }]}>{subtitle}</Text>}
      
      {/* Simple accent line */}
      <View style={[styles.accentLine, { backgroundColor: theme.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  loader: {
    marginLeft: spacing.md,
  },
  accentLine: {
    height: 3,
    width: 40,
    borderRadius: 2,
    marginTop: spacing.sm,
  },
});
