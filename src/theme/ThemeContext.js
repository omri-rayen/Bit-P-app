import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Thème sombre - Simple et professionnel
export const darkTheme = {
  isDark: true,
  
  // Primary colors
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  secondary: '#6366F1',
  accent: '#10B981',
  
  // Background colors
  background: {
    primary: '#111827',
    secondary: '#1F2937',
    tertiary: '#374151',
    card: '#1F2937',
    glass: 'rgba(31, 41, 55, 0.8)',
  },
  
  // Text colors
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
    muted: '#9CA3AF',
    accent: '#3B82F6',
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
    primary: '#374151',
    secondary: '#4B5563',
    accent: '#3B82F6',
  },
  
  // Simple gradients
  gradients: {
    primary: ['#3B82F6', '#2563EB'],
    secondary: ['#6366F1', '#4F46E5'],
    accent: ['#10B981', '#059669'],
    dark: ['#111827', '#1F2937'],
    card: ['#1F2937', '#1F2937'],
    background: ['#111827', '#111827', '#111827'],
  },
  
  // Tab bar
  tabBar: {
    background: '#111827',
    active: '#3B82F6',
    inactive: '#6B7280',
  },
};

// Thème clair - Simple et professionnel
export const lightTheme = {
  isDark: false,
  
  // Primary colors
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  secondary: '#4F46E5',
  accent: '#059669',
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
    card: '#FFFFFF',
    glass: 'rgba(255, 255, 255, 0.9)',
  },
  
  // Text colors
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    muted: '#9CA3AF',
    accent: '#2563EB',
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
    primary: '#E5E7EB',
    secondary: '#D1D5DB',
    accent: '#2563EB',
  },
  
  // Simple gradients
  gradients: {
    primary: ['#2563EB', '#1D4ED8'],
    secondary: ['#4F46E5', '#4338CA'],
    accent: ['#059669', '#047857'],
    dark: ['#FFFFFF', '#F9FAFB'],
    card: ['#FFFFFF', '#FFFFFF'],
    background: ['#FFFFFF', '#FFFFFF', '#FFFFFF'],
  },
  
  // Tab bar
  tabBar: {
    background: '#FFFFFF',
    active: '#2563EB',
    inactive: '#9CA3AF',
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
