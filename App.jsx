import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from '@expo/vector-icons/Entypo';

import SwipeTabs from "./src/SwipeTabs";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2f95dc",
          tabBarInactiveTintColor: "#8e8e93"
        }}
      >
        <Tab.Screen
          name="Home"
          component={SwipeTabs}
          options={{
            tabBarIcon: ({ color, size }) =>
              <Entypo name="home" color={color} size={size} />
          }}
        />
        <Tab.Screen
          name="System"
          component={SwipeTabs}
          options={{
            tabBarIcon: ({ color, size }) =>
              <Entypo name="bookmarks" color={color} size={size} />
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SwipeTabs}
          options={{
            tabBarIcon: ({ color, size }) =>
              <Ionicons name="settings-outline" color={color} size={size} />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}