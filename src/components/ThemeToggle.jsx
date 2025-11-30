// components/ThemeToggle.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from '../theme/ThemeContext';
import { useLanguage } from '../i18n/LanguageContext';
import GlassCard from './GlassCard';
import { typography, spacing, borderRadius } from '../theme/colors';

export default function ThemeToggle() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <GlassCard style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconWrapper, { backgroundColor: theme.isDark ? theme.background.tertiary : '#FFFFFF', borderWidth: theme.isDark ? 0 : 1, borderColor: theme.border.primary }]}>
          <Ionicons 
            name={isDarkMode ? "moon" : "sunny"} 
            size={20} 
            color={theme.primary} 
          />
        </View>
        <Text style={[styles.title, { color: theme.text.secondary }]}>
          {t('settings.theme') || 'THÈME'}
        </Text>
      </View>

      <View style={styles.toggleContainer}>
        {/* Light Mode */}
        <TouchableOpacity
          style={[
            styles.toggleOption,
            !isDarkMode && styles.activeOption,
            { 
              backgroundColor: !isDarkMode ? theme.background.tertiary : 'transparent',
              borderColor: !isDarkMode ? theme.primary : theme.border.primary,
            }
          ]}
          onPress={() => isDarkMode && toggleTheme()}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="sunny" 
            size={22} 
            color={!isDarkMode ? theme.primary : theme.text.muted} 
          />
          <Text style={[
            styles.optionText, 
            { color: !isDarkMode ? theme.text.primary : theme.text.muted }
          ]}>
            {t('settings.lightMode') || 'Clair'}
          </Text>
        </TouchableOpacity>

        {/* Dark Mode */}
        <TouchableOpacity
          style={[
            styles.toggleOption,
            isDarkMode && styles.activeOption,
            { 
              backgroundColor: isDarkMode ? theme.background.tertiary : 'transparent',
              borderColor: isDarkMode ? theme.primary : theme.border.primary,
            }
          ]}
          onPress={() => !isDarkMode && toggleTheme()}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="moon" 
            size={22} 
            color={isDarkMode ? theme.primary : theme.text.muted} 
          />
          <Text style={[
            styles.optionText, 
            { color: isDarkMode ? theme.text.primary : theme.text.muted }
          ]}>
            {t('settings.darkMode') || 'Sombre'}
          </Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: spacing.sm,
  },
  activeOption: {
    borderWidth: 1.5,
  },
  optionText: {
    ...typography.body,
    fontWeight: '600',
  },
});
