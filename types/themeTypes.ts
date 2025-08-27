/**
 * @interface ColorSet
 * @description Defines the structure for a single, complete color palette.
 * Each property represents a semantic color used throughout the app.
 */
export interface ColorSet {
  // Brand
  primary: string;
  secondary: string;

  // Accents & Status
  accent: string;
  success: string;
  warning: string;
  error: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  // UI
  background: string;
  surface: string; // For cards, modals, etc.
  border: string;
  overlay: string;
}

export interface Typography {
  h1: FontSet;
  h2: FontSet;
  h3: FontSet;
  body: FontSet;
  caption: FontSet;
  button: FontSet;
}

/**
 * @interface Spacing
 * @description Defines the spacing scale based on an 8-point grid system.
 */
export interface Spacing {
  xs: number; // Extra Small (4px)
  sm: number; // Small (8px)
  md: number; // Medium (16px)
  lg: number; // Large (24px)
  xl: number; // Extra Large (32px)
  xxl: number; // Extra Extra Large (48px)
}

/**
 * @interface ThemeColors
 * @description A collection of all available color themes for the application.
 */
export interface ThemeColors {
  basic: ColorSet; // A default or base theme
  light: ColorSet;
  dark: ColorSet;
  typography: Typography;
  spacing: Spacing;
}

// ... (your existing ColorSet and ThemeColors interfaces)

/**
 * @interface FontSet
 * @description Defines the properties for a single font style.
 */
export interface FontSet {
  fontSize: number;
  fontWeight:
    | "normal"
    | "bold"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  lineHeight?: number; // Optional, but highly recommended for consistency
}

/**
 * @interface Typography
 * @description Defines the typographic scale for the application.
 */

/**
 * @interface Theme
 * @description The complete theme interface for the application.
 */
export interface Theme {
  colors: ColorSet;
  typography: Typography;
  spacing: Spacing;
}
