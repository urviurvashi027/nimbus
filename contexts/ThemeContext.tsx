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
import { svaColors as defaultSvaColors } from "@/theme/palettes/nimbus";
import type {
  AppTheme,
  ThemeName,
  ColorSet,
  Spacing,
  Typography,
  NimbusTokens,
  SvaColorSet,
  TypographyTokens,
  SpacingTokens,
  ComponentTokens,
} from "@/theme/types";

// 1. Define the shape of our context data
interface ThemeContextData {
  theme: ThemeName;
  toggleTheme: (newTheme: ThemeName) => void;
  useSystemTheme: () => void;
  newTheme: ColorSet;
  svaColors: SvaColorSet;
  spacing: Spacing;
  typography: Typography;
  svaTypography?: TypographyTokens;
  svaSpacing?: SpacingTokens;
  svaComponents?: ComponentTokens;
  nimbusColors: SvaColorSet;
  nimbusTypography?: TypographyTokens;
  nimbusSpacing?: SpacingTokens;
  nimbusComponents?: ComponentTokens;
  tokens: NimbusTokens;
  activeTheme: AppTheme; // Allow access to full theme object if needed
}

// Default initial theme (fallback)
const defaultTheme = getTheme("dark");

const normalizeThemeName = (value: string | null): ThemeName | null => {
  if (value === "dark" || value === "light" || value === "sva") {
    return value;
  }

  if (value === "nimbus") {
    return "sva";
  }

  return null;
};

// 2. Create the context with a default value
const ThemeContext = createContext<ThemeContextData>({
  theme: "dark",
  toggleTheme: () => {},
  useSystemTheme: () => {},
  newTheme: defaultTheme.colors,
  svaColors: defaultTheme.svaColors ?? defaultSvaColors,
  spacing: defaultTheme.spacing,
  typography: defaultTheme.typography,
  svaTypography: defaultTheme.svaTypography,
  svaSpacing: defaultTheme.svaSpacing,
  svaComponents: defaultTheme.svaComponents,
  nimbusColors: defaultTheme.nimbusColors ?? defaultSvaColors,
  nimbusTypography: defaultTheme.nimbusTypography ?? defaultTheme.svaTypography,
  nimbusSpacing: defaultTheme.nimbusSpacing ?? defaultTheme.svaSpacing,
  nimbusComponents: defaultTheme.nimbusComponents ?? defaultTheme.svaComponents,
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
        const savedTheme = await AsyncStorage.getItem("theme");
        const normalizedTheme = normalizeThemeName(savedTheme);
        if (normalizedTheme) {
          setThemeName(normalizedTheme);
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
    svaColors:
      activeTheme.svaColors ||
      activeTheme.nimbusColors ||
      defaultSvaColors,
    spacing: activeTheme.spacing,
    typography: activeTheme.typography,
    svaTypography: activeTheme.svaTypography || activeTheme.nimbusTypography,
    svaSpacing: activeTheme.svaSpacing || activeTheme.nimbusSpacing,
    svaComponents: activeTheme.svaComponents || activeTheme.nimbusComponents,
    nimbusColors:
      activeTheme.nimbusColors ||
      activeTheme.svaColors ||
      defaultSvaColors,
    nimbusTypography: activeTheme.nimbusTypography,
    nimbusSpacing: activeTheme.nimbusSpacing,
    nimbusComponents: activeTheme.nimbusComponents,
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
