// ThemeContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme as themeKit } from "@/constant/theme/Colors";
import { useColorScheme } from "react-native";
import { ColorSet, Spacing, Typography } from "@/types/themeTypes";

// 1. Define the shape of our context data
interface ThemeContextData {
  theme: "basic" | "light" | "dark";
  toggleTheme: (newTheme: "basic" | "light" | "dark") => void;
  useSystemTheme: () => void;
  newTheme: ColorSet;
  spacing: Spacing;
  typography: Typography;
}

// 2. Create the context with a default value (or undefined)
const ThemeContext = createContext<ThemeContextData>({
  toggleTheme: (newTheme: "basic" | "light" | "dark") => {},
  theme: "light",
  newTheme: themeKit.dark,
  spacing: themeKit.spacing,
  typography: themeKit.typography,
  useSystemTheme: () => {},
});

// 3. Define props for our provider
interface ThemeProviderProps {
  children: ReactNode;
}

// 4. Create the provider component
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  // const [themeValue, setThemeValue] = useState("");
  const [theme, setTheme] = useState<"basic" | "light" | "dark">(
    colorScheme || "light"
  );

  const mainTheme = themeKit.dark;

  useEffect(() => {
    // set theme to system selected theme
    if (colorScheme) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem("theme")) as
          | "basic"
          | "light"
          | "dark";
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {}
    };
    getTheme();
  }, []);

  const toggleTheme = (newTheme: "basic" | "light" | "dark") => {
    setTheme(newTheme);
    AsyncStorage.setItem("theme", newTheme).catch((error) =>
      console.log("Error saving theme:", error)
    );
  };

  const useSystemTheme = () => {
    if (colorScheme) setTheme(colorScheme);
    if (colorScheme) AsyncStorage.setItem("theme", colorScheme);
  };

  // 2. Create the full context value that matches the interface
  const contextValue: ThemeContextData = {
    theme,
    toggleTheme,
    useSystemTheme,
    newTheme: mainTheme, // Pass the colors from the current theme
    spacing: themeKit.spacing, // Pass the spacing object
    typography: themeKit.typography, // Pass the typography object
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

// import React, { createContext, useEffect, useMemo, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useColorScheme } from "react-native";
// import { getTheme } from "@/theme";
// import type { AppTheme, ThemeName } from "@/theme/types";

// type ThemeContextData = {
//   themeName: ThemeName;
//   theme: AppTheme;
//   setTheme: (t: ThemeName) => void;
//   useSystemTheme: () => void;
// };

// const STORAGE_KEY = "theme"; // keep same

// export const ThemeContext = createContext<ThemeContextData>({
//   themeName: "dark",
//   theme: getTheme("dark"),
//   setTheme: () => {},
//   useSystemTheme: () => {},
// });

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const system = useColorScheme(); // "dark" | "light" | null
//   const [themeName, setThemeName] = useState<ThemeName>("dark");

//   // load saved theme once
//   useEffect(() => {
//     (async () => {
//       const saved = (await AsyncStorage.getItem(
//         STORAGE_KEY
//       )) as ThemeName | null;
//       if (saved === "dark" || saved === "light") {
//         setThemeName(saved);
//       } else if (system === "light" || system === "dark") {
//         setThemeName(system);
//       }
//     })();
//   }, []);

//   // if you want: when OS changes AND user didn't pick manually, handle it later with a flag
//   // for now: keep it simple.

//   const setTheme = async (t: ThemeName) => {
//     setThemeName(t);
//     await AsyncStorage.setItem(STORAGE_KEY, t);
//   };

//   const useSystemTheme = async () => {
//     const next = system === "light" ? "light" : "dark";
//     setThemeName(next);
//     await AsyncStorage.setItem(STORAGE_KEY, next);
//   };

//   const theme = useMemo(() => getTheme(themeName), [themeName]);

//   const value = useMemo(
//     () => ({ themeName, theme, setTheme, useSystemTheme }),
//     [themeName, theme]
//   );

//   return (
//     <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
//   );
// }
