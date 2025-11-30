import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thème sombre
export const darkTheme = {
  isDark: true,
  
  // Primary colors
  primary: '#00D9FF',
  primaryDark: '#0099CC',
  secondary: '#7C3AED',
  accent: '#10B981',
  
  // Background colors
  background: {
    primary: '#0A0E17',
    secondary: '#111827',
    tertiary: '#1F2937',
    card: 'rgba(31, 41, 55, 0.7)',
    glass: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Text colors
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    muted: '#6B7280',
    accent: '#00D9FF',
  },
  
  // Status colors
  status: {
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.15)',
  },
  
  // Border colors
  border: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    accent: 'rgba(0, 217, 255, 0.3)',
  },
  
  // Gradient presets
  gradients: {
    primary: ['#00D9FF', '#7C3AED'],
    secondary: ['#7C3AED', '#EC4899'],
    accent: ['#10B981', '#00D9FF'],
    dark: ['#0A0E17', '#111827'],
    card: ['rgba(31, 41, 55, 0.8)', 'rgba(17, 24, 39, 0.9)'],
    background: ['#0A0E17', '#0F1520', '#141C2B'],
  },
  
  // Tab bar
  tabBar: {
    background: 'rgba(10, 14, 23, 0.95)',
    active: '#00D9FF',
    inactive: '#6B7280',
  },
};

// Thème clair
export const lightTheme = {
  isDark: false,
  
  // Primary colors
  primary: '#0088CC',
  primaryDark: '#006699',
  secondary: '#6D28D9',
  accent: '#059669',
  
  // Background colors
  background: {
    primary: '#F8FAFC',
    secondary: '#F1F5F9',
    tertiary: '#E2E8F0',
    card: 'rgba(255, 255, 255, 0.9)',
    glass: 'rgba(0, 0, 0, 0.03)',
  },
  
  // Text colors
  text: {
    primary: '#1E293B',
    secondary: '#475569',
    muted: '#94A3B8',
    accent: '#0088CC',
  },
  
  // Status colors
  status: {
    success: '#059669',
    successBg: 'rgba(5, 150, 105, 0.1)',
    warning: '#D97706',
    warningBg: 'rgba(217, 119, 6, 0.1)',
    error: '#DC2626',
    errorBg: 'rgba(220, 38, 38, 0.1)',
    info: '#2563EB',
    infoBg: 'rgba(37, 99, 235, 0.1)',
  },
  
  // Border colors
  border: {
    primary: 'rgba(0, 0, 0, 0.1)',
    secondary: 'rgba(0, 0, 0, 0.05)',
    accent: 'rgba(0, 136, 204, 0.3)',
  },
  
  // Gradient presets
  gradients: {
    primary: ['#0088CC', '#6D28D9'],
    secondary: ['#6D28D9', '#DB2777'],
    accent: ['#059669', '#0088CC'],
    dark: ['#F8FAFC', '#F1F5F9'],
    card: ['rgba(255, 255, 255, 0.95)', 'rgba(241, 245, 249, 0.95)'],
    background: ['#F8FAFC', '#F1F5F9', '#E2E8F0'],
  },
  
  // Tab bar
  tabBar: {
    background: 'rgba(248, 250, 252, 0.95)',
    active: '#0088CC',
    inactive: '#94A3B8',
  },
};

const ThemeContext = createContext();

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le thème sauvegardé
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
