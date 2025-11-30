import React, { useRef, useEffect } from "react";
import PagerView from "react-native-pager-view";
import { View } from "react-native";
import HomeScreen from "../src/screens/HomeScreen";
import SystemScreen from "../src/screens/SystemScreen";
import SettingsScreen from "../src/screens/SettingsScreen";

export default function SwipeTabs({ navigation }) {
  const pagerRef = useRef(null);

  // Set pager to current tab index on mount
  useEffect(() => {
    const state = navigation.getState();
    const currentIndex = state.index;
    if (pagerRef.current) {
      pagerRef.current.setPageWithoutAnimation(currentIndex);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      const index = navigation.getState().index;
      if (pagerRef.current) {
        pagerRef.current.setPage(index);
      }
    });
    return unsubscribe;
  }, [navigation]);

  // When swiping, update the bottom tab
  const onPageSelected = ({ nativeEvent }) => {
    const index = nativeEvent.position;
    navigation.navigate(
      navigation.getState().routeNames[index]
    );
  };

  return (
    <PagerView
      ref={pagerRef}
      style={{ flex: 1 }}
      initialPage={0}
      onPageSelected={onPageSelected}
    >
      <View key="home">
        <HomeScreen />
      </View>
      <View key="system">
        <SystemScreen />
      </View>
      <View key="settings">
        <SettingsScreen />
      </View>
    </PagerView>
  );
}