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
  h1: { fontSize: 32, fontWeight: "800", lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: "800", lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: "700", lineHeight: 28 },
  body: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
  button: { fontSize: 16, fontWeight: "700" },
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
