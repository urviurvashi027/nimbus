import React, { useContext } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors, { theme as newThemeKit } from "@/constant/theme/Colors";
import { useColorScheme } from "@/components/UseColorScheme";
import ThemeContext from "@/context/ThemeContext";

// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>["name"];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { theme, toggleTheme, newTheme, useSystemTheme } =
    useContext(ThemeContext);

  // const styles = styling(theme);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:
          newThemeKit[colorScheme ?? "light"].accentPressed,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: newThemeKit[colorScheme ?? "light"].background, // White background
          borderTopWidth: 1,
          // borderTopColor: "#E5E5E5",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Routine",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="body-outline"
              size={24}
              color={newThemeKit[colorScheme ?? "light"].accentPressed}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="self-care"
        options={{
          tabBarLabel: "Self Care",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="fitness-outline"
              size={24}
              color={newThemeKit[colorScheme ?? "light"].accentPressed}
            />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="tools"
        options={{
          tabBarLabel: "Tools",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="construct-outline"
              size={24}
              color={newThemeKit[colorScheme ?? "light"].accentPressed}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="people-outline"
              size={24}
              color={newThemeKit[colorScheme ?? "light"].accentPressed}
            />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
