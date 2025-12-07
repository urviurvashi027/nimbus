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

  // new property value
  divider: string;
  disabled: string;
  accentPressed: string;
  info: string;

  // NEW — neutrals for elevation/borders
  card: string; // slightly lighter than background
  cardRaised: string; // for prominent cards
  surfaceMuted: string; // list rows / chips
  // border: "#3A3E33"; // hairline borders
  borderMuted: string;

  // NEW — overlays / scrims
  // overlay: "rgba(12,14,11,0.6)"; // modal backdrop
  overlayStrong: string;
  shadow: string;

  // NEW — focus / outline
  focus: string; // soft light-green outline
  focusRing: string;

  // NEW — buttons
  buttonPrimary: string; // = accent
  buttonPrimaryText: string;
  buttonGhostBg: string;
  buttonGhostBorder: string;
  buttonGhostText: string;

  // NEW — chart accents (brighter but cohesive)
  // Use these for lines, bars, and categorical series.
  chart1: string; // fresh lime (pairs with accent)
  chart2: string; // softened blue (fits info family)
  chart3: string; // warm amber (fits warning family)
  chart4: string; // muted rose (ties to error family)
  chart5: string; // seafoam (secondary success)
  chart6: string; // lavender (for variety)
  chartGrid: string; // subtle grid/rules
  chartAreaFade: string;

  // NEW — gradients (for charts/headers)
  gradAccent: string; // light -> base accent
  gradLime: string; // for progress arcs
  gradBlue: string;
  gradAmber: string;

  // NEW — states
  pressed: string;
  hovered: string;
  selected: string;
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
  "2xl": number;
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
