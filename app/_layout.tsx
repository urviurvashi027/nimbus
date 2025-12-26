// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import AuthProvider from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import HabitContext from "@/context/HabitContext";
import { HabitCreateRequest } from "@/types/habitTypes";
import { NimbusAlertProvider } from "@/components/common/alert/NimbusAlertProvider";
import { NimbusToastHost } from "@/components/common/toast/NimbusToast";

SplashScreen.preventAutoHideAsync();

// ✅ Force cold start to (public)
export const unstable_settings = {
  initialRouteName: "(public)",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({ ...FontAwesome.font });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [habitData, setHabitData] = React.useState<HabitCreateRequest>({
    name: "",
    habit_type_id: 0,
    color: "",
    tags: [],
    habit_metric: { unit: "", count: 0 },
    habit_duration: { all_day: true },
    habit_frequency: { frequency_type: "", interval: 0, start_date: "" },
    remind_at: { ten_min_before: true },
    subtasks: [],
  });

  return (
    <AuthProvider>
      <ThemeProvider>
        <NimbusAlertProvider>
          <HabitContext.Provider value={{ habitData, setHabitData }}>
            <Stack screenOptions={{ headerShown: false }}>
              {/* ✅ explicitly declare groups */}
              <Stack.Screen name="(public)" />
              <Stack.Screen name="(auth)" />
            </Stack>

            <NimbusToastHost />
          </HabitContext.Provider>
        </NimbusAlertProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
