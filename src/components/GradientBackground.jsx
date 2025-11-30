import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function GradientBackground({ children, style }) {
  const { theme, isDark } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }, style]}>
      {/* Fond principal avec dégradé subtil */}
      <LinearGradient
        colors={theme.gradients.background}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Effet de lueur subtile en haut */}
      <LinearGradient
        colors={[isDark ? 'rgba(0, 217, 255, 0.08)' : 'rgba(0, 122, 255, 0.08)', 'transparent']}
        style={styles.topGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Lignes de grille subtiles pour effet tech */}
      <View style={styles.gridOverlay}>
        <View style={[styles.gridLineH, { top: '25%', backgroundColor: isDark ? 'rgba(0, 217, 255, 0.03)' : 'rgba(0, 122, 255, 0.06)' }]} />
        <View style={[styles.gridLineH, { top: '75%', backgroundColor: isDark ? 'rgba(0, 217, 255, 0.03)' : 'rgba(0, 122, 255, 0.06)' }]} />
        <View style={[styles.gridLineV, { left: '25%', backgroundColor: isDark ? 'rgba(0, 217, 255, 0.02)' : 'rgba(0, 122, 255, 0.04)' }]} />
        <View style={[styles.gridLineV, { left: '75%', backgroundColor: isDark ? 'rgba(0, 217, 255, 0.02)' : 'rgba(0, 122, 255, 0.04)' }]} />
      </View>
      
      {/* Orbes de lumière subtils */}
      <View style={[
        styles.orb, 
        styles.orbPrimary,
        { 
          backgroundColor: isDark ? 'rgba(0, 217, 255, 0.04)' : 'rgba(0, 122, 255, 0.06)',
          shadowColor: isDark ? '#00D9FF' : '#007AFF',
        }
      ]} />
      <View style={[
        styles.orb, 
        styles.orbSecondary,
        { 
          backgroundColor: isDark ? 'rgba(124, 58, 237, 0.04)' : 'rgba(88, 86, 214, 0.06)',
          shadowColor: isDark ? '#7C3AED' : '#5856D6',
        }
      ]} />
      
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
  topGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  orbPrimary: {
    width: width * 0.7,
    height: width * 0.7,
    top: -width * 0.2,
    right: -width * 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 100,
  },
  orbSecondary: {
    width: width * 0.5,
    height: width * 0.5,
    bottom: height * 0.1,
    left: -width * 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 80,
  },
});
