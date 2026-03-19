// ThemeContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";
import { getTheme } from "@/theme";
import type { AppTheme, ThemeName, ColorSet, Spacing, Typography, NimbusTokens } from "@/theme/types";

// 1. Define the shape of our context data
interface ThemeContextData {
  theme: ThemeName;
  toggleTheme: (newTheme: ThemeName) => void;
  useSystemTheme: () => void;
  newTheme: ColorSet;
  spacing: Spacing;
  typography: Typography;
  tokens: NimbusTokens;
  activeTheme: AppTheme; // Allow access to full theme object if needed
}

// Default initial theme (fallback)
const defaultTheme = getTheme("dark");

// 2. Create the context with a default value
const ThemeContext = createContext<ThemeContextData>({
  theme: "dark",
  toggleTheme: () => {},
  useSystemTheme: () => {},
  newTheme: defaultTheme.colors,
  spacing: defaultTheme.spacing,
  typography: defaultTheme.typography,
  tokens: defaultTheme.tokens,
  activeTheme: defaultTheme,
});

// 3. Define props for our provider
interface ThemeProviderProps {
  children: ReactNode;
}

// 4. Create the provider component
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  // State tracks the *name* of the current theme
  const [themeName, setThemeName] = useState<ThemeName>(
    (colorScheme === "dark" || colorScheme === "light") ? colorScheme : "dark"
  );

  // Derive the full theme object from the name
  const activeTheme = getTheme(themeName);

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem("theme")) as ThemeName;
        if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
          setThemeName(savedTheme);
        }
      } catch (error) {
        console.warn("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  // Sync with system changes IF the user hasn't explicitly overridden (logic can vary)
  // For now, let's keep it simple: if colorScheme changes, we update ONLY if we are in "system" mode?
  // Or just update local state if that's the desired behavior.
  // The original code reset it on change, so we'll mimic that pattern but safely.
  useEffect(() => {
    if (colorScheme === "dark" || colorScheme === "light") {
     // Optional: You might not want to override user preference automatically. 
     // But following previous logic:
     // setThemeName(colorScheme);
    }
  }, [colorScheme]);

  const toggleTheme = (newTheme: ThemeName) => {
    setThemeName(newTheme);
    AsyncStorage.setItem("theme", newTheme).catch((error) =>
      console.log("Error saving theme:", error)
    );
  };

  const useSystemTheme = () => {
    const systemTheme = colorScheme === "light" ? "light" : "dark";
    setThemeName(systemTheme);
    AsyncStorage.removeItem("theme"); // clear override
  };

  const contextValue: ThemeContextData = {
    theme: themeName,
    toggleTheme,
    useSystemTheme,
    newTheme: activeTheme.colors,
    spacing: activeTheme.spacing,
    typography: activeTheme.typography,
    tokens: activeTheme.tokens,
    activeTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
