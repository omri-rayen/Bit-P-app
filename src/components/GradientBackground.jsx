import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function GradientBackground({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[colors.background.primary, colors.background.secondary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Decorative orbs for futuristic effect */}
      <View style={[styles.orb, styles.orb1]} />
      <View style={[styles.orb, styles.orb2]} />
      <View style={[styles.orb, styles.orb3]} />
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.15,
  },
  orb1: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: colors.primary,
    top: -width * 0.3,
    right: -width * 0.3,
  },
  orb2: {
    width: width * 0.6,
    height: width * 0.6,
    backgroundColor: colors.secondary,
    bottom: height * 0.2,
    left: -width * 0.3,
  },
  orb3: {
    width: width * 0.4,
    height: width * 0.4,
    backgroundColor: colors.accent,
    bottom: -width * 0.1,
    right: width * 0.1,
  },
});
