import React, { useContext } from "react";
import { Link, Tabs } from "expo-router";
import ThemeContext from "@/contexts/ThemeContext";
import CustomTabBar from "@/components/ui/CustomTabBar";

export default function TabLayout() {
  const { newTheme } = useContext(ThemeContext);

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Routine",
        }}
      />
      <Tabs.Screen
        name="self-care"
        options={{
          tabBarLabel: "Stats",
        }}
      />
      {/* Placeholder for the center plus button */}
      <Tabs.Screen
        name="plus-button-placeholder"
        options={{
          tabBarLabel: "Add",
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarLabel: "Tools",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
