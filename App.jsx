import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import SystemScreen from './src/screens/SystemScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { LanguageProvider, useLanguage } from './src/i18n/LanguageContext';
import { colors, borderRadius, shadows } from './src/theme/colors';

const Tab = createBottomTabNavigator();

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

function AppNavigator() {
  const { t } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabBar.active,
        tabBarInactiveTintColor: colors.tabBar.inactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t('nav.home'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "home" : "home-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="System"
        component={SystemScreen}
        options={{
          tabBarLabel: t('nav.system'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "layers" : "layers-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t('nav.settings'),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "settings" : "settings-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
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
  tabBar: {
    backgroundColor: colors.tabBar.background,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
    height: 70,
    paddingTop: 8,
    paddingBottom: 12,
    ...shadows.subtle,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  tabBarItem: {
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