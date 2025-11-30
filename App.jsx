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
import { colors, borderRadius, shadows, typography, spacing } from './src/theme/colors';

function TabBarIcon({ name, color, focused }) {
  return (
    <View style={styles.iconContainer}>
      {focused && (
        <LinearGradient
          colors={colors.gradients.primary}
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
  
  const tabs = [
    { key: 'home', label: t('nav.home'), icon: 'home', iconOutline: 'home-outline' },
    { key: 'system', label: t('nav.system'), icon: 'layers', iconOutline: 'layers-outline' },
    { key: 'settings', label: t('nav.settings'), icon: 'settings', iconOutline: 'settings-outline' },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
      {tabs.map((tab, index) => {
        const isFocused = currentPage === index;
        const iconName = isFocused ? tab.icon : tab.iconOutline;
        const color = isFocused ? colors.tabBar.active : colors.tabBar.inactive;
        
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabBarItem}
            onPress={() => onTabPress(index)}
            activeOpacity={0.7}
          >
            <TabBarIcon name={iconName} color={color} focused={isFocused} />
            <Text style={[styles.tabBarLabel, { color }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AppNavigator() {
  const { t } = useLanguage();
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleTabPress = (index) => {
    pagerRef.current?.setPage(index);
  };

  const handlePageSelected = (e) => {
    setCurrentPage(e.nativeEvent.position);
  };

  return (
    <View style={styles.container}>
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
    <LanguageProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBar.background,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    paddingTop: 8,
    ...shadows.subtle,
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