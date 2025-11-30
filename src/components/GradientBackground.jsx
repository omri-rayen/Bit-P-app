import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export default function GradientBackground({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      {/* Fond principal avec dégradé subtil */}
      <LinearGradient
        colors={['#0A0E17', '#0F1520', '#141C2B']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Effet de lueur subtile en haut */}
      <LinearGradient
        colors={['rgba(0, 217, 255, 0.08)', 'transparent']}
        style={styles.topGlow}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      
      {/* Lignes de grille subtiles pour effet tech */}
      <View style={styles.gridOverlay}>
        <View style={styles.gridLineH1} />
        <View style={styles.gridLineH2} />
        <View style={styles.gridLineV1} />
        <View style={styles.gridLineV2} />
      </View>
      
      {/* Orbes de lumière subtils */}
      <View style={[styles.orb, styles.orbPrimary]} />
      <View style={[styles.orb, styles.orbSecondary]} />
      
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
    backgroundColor: '#0A0E17',
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
  gridLineH1: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 217, 255, 0.03)',
  },
  gridLineH2: {
    position: 'absolute',
    top: '75%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0, 217, 255, 0.03)',
  },
  gridLineV1: {
    position: 'absolute',
    left: '25%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 217, 255, 0.02)',
  },
  gridLineV2: {
    position: 'absolute',
    left: '75%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0, 217, 255, 0.02)',
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
    backgroundColor: 'rgba(0, 217, 255, 0.04)',
    top: -width * 0.2,
    right: -width * 0.2,
    shadowColor: '#00D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 100,
  },
  orbSecondary: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
    bottom: height * 0.1,
    left: -width * 0.2,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 80,
  },
});
