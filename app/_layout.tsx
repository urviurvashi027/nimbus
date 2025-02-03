import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { ThemeProvider } from "@/context/ThemeContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import HabitContext from "@/context/HabitContext";
import { useColorScheme } from "@/components/UseColorScheme";
import AuthProvider from "@/context/AuthContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "/login",
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
  const [habitData, setHabitData] = useState({ habitName: "", habitType: "" });
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
              name="(public)/login"
              options={{ headerShown: false }}
            />
          </Stack>
        </HabitContext.Provider>
      </ThemeProvider>
    </AuthProvider>
  );
}
