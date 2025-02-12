import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constant/Colors";
import { useColorScheme } from "@/components/UseColorScheme";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Routine",
          tabBarIcon: ({ color }) => (
            <Ionicons name="body-outline" size={24} color={color} />
            // <Ionicons name="location-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          tabBarLabel: "Tools",
          tabBarIcon: ({ color }) => (
            <Ionicons name="construct-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="self-care"
        options={{
          tabBarLabel: "Self Care",
          tabBarIcon: ({ color }) => (
            <Ionicons name="fitness-outline" size={24} color={color} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="setting"
        options={{
          tabBarLabel: "Setting",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={24} color={color} />
          ),
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}
