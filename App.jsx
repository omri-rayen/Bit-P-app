import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import PagerView from 'react-native-pager-view';
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SystemScreen from './src/screens/SystemScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function TabBarIcon({ name, color, focused, gradientColors }) {
  return (
    <View style={styles.iconContainer}>
      {focused && (
        <LinearGradient
          colors={gradientColors}
          style={styles.activeIndicator}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      )}
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

function CustomTabBar({ currentPage, onTabPress, t }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const tabs = [
    { key: 'home', label: t('nav.home'), icon: 'home', iconOutline: 'home-outline' },
    { key: 'system', label: t('nav.system'), icon: 'layers', iconOutline: 'layers-outline' },
    { key: 'settings', label: t('nav.settings'), icon: 'settings', iconOutline: 'settings-outline' },
  ];

  return (
    <View style={[
      styles.tabBar, 
      { 
        paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
        backgroundColor: theme.tabBar.background,
        borderTopColor: theme.border.primary,
      }
    ]}>
      {tabs.map((tab, index) => {
        const isFocused = currentPage === index;
        const iconName = isFocused ? tab.icon : tab.iconOutline;
        const color = isFocused ? theme.tabBar.active : theme.tabBar.inactive;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabBarItem}
            onPress={() => onTabPress(index)}
            activeOpacity={0.7}
          >
            <TabBarIcon 
              name={iconName} 
              color={color} 
              focused={isFocused} 
              gradientColors={theme.gradients.primary}
            />
            <Text style={[styles.tabBarLabel, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AppNavigator() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleTabPress = (index) => {
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e) => {
    setCurrentPage(e.nativeEvent.position);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        <View key="1" style={styles.page}>
          <HomeScreen />
        </View>
        <View key="2" style={styles.page}>
          <SystemScreen />
        </View>
        <View key="3" style={styles.page}>
          <SettingsScreen />
        </View>
      </PagerView>
      
      <CustomTabBar 
        currentPage={currentPage} 
        onTabPress={handleTabPress}
        t={t}
      />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -12,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
});