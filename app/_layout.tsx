import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";

import HabitContext from "@/context/HabitContext";
import { useColorScheme } from "@/components/UseColorScheme";
import AuthProvider from "@/context/AuthContext";
import { HabitCreateRequest } from "@/types/habitTypes";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/landing",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [habitData, setHabitData] = useState<HabitCreateRequest>(habitInfo);
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider>
        <HabitContext.Provider value={{ habitData, setHabitData }}>
          <Stack>
            <Stack.Screen
              name="(auth)/(tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(public)/landing"
              options={{ headerShown: false }}
            />
          </Stack>
        </HabitContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export const habitInfo = {
  name: "",
  habit_type_id: 0,
  color: "",
  tags: [],
  habit_metric: {
    unit: "",
    count: 0,
  },
  habit_duration: {
    // default case
    all_day: true,
  },
  habit_frequency: {
    frequency_type: "",
    interval: 0,
    start_date: "",
  },
  remind_at: { ten_min_before: true },
  subtasks: [],
};
