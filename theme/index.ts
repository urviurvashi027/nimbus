import type { AppTheme, Spacing, Typography, ThemeName } from "./types";
import { tokens } from "./tokens";
import { darkColors } from "./palettes/dark";
import { lightColors } from "./palettes/light";

export const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  "2xl": 32,
};

export const typography: Typography = {
  h1: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },
  h2: {
    fontFamily: "Urbanist_700Bold",
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  },
  h3: {
    fontFamily: "Urbanist_600SemiBold",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  },
  body: {
    fontFamily: "Outfit_400Regular",
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  caption: {
    fontFamily: "Outfit_400Regular",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  },
  button: {
    fontFamily: "Outfit_600SemiBold",
    fontSize: 16,
    fontWeight: "600",
  },
};

const themes = {
  dark: {
    name: "dark" as const,
    colors: darkColors,
    spacing,
    typography,
    tokens,
  },
  light: {
    name: "light" as const,
    colors: lightColors,
    spacing,
    typography,
    tokens,
  },
};

export function getTheme(name: ThemeName): AppTheme {
  return themes[name] ?? themes.dark;
}
