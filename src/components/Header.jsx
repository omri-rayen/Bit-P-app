import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme/colors';

export default function Header({ title, subtitle, loading = false }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={colors.primary} 
            style={styles.loader}
          />
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      
      {/* Decorative line */}
      <View style={styles.lineContainer}>
        <LinearGradient
          colors={colors.gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentLine}
        />
        <View style={styles.dotContainer}>
          <View style={styles.dot} />
        </View>
      </View>
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
    color: colors.text.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
  loader: {
    marginLeft: spacing.md,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  accentLine: {
    height: 2,
    width: 60,
    borderRadius: 1,
  },
  dotContainer: {
    marginLeft: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
