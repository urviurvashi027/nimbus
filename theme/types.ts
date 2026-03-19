export type ThemeName = "dark" | "light"; // add "basic" later only if needed

/**
 * @interface FontSet
 * @description Defines the properties for a single font style.
 */
export interface FontSet {
  fontFamily?: string;
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
  lineHeight?: number;
}

/**
 * @interface Typography
 * @description Defines the typographic scale for the application.
 */
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
 * @type NimbusTokens
 * @description Design tokens for various UI elements.
 */
export type NimbusTokens = {
  radius: { input: number; button: number; card: number; chip: number };
  size: {
    inputHeight: number;
    buttonHeight: number;
    otpBox: number;
    progressHeight: number;
  };
  layout: {
    screenX: number;
    topPad: number;
    gap: number;
    gapLg: number;
    sectionGap: number;
  };
  border: { hairline: number; strong: number };
};

/**
 * @interface ColorSet
 * @description Defines the structure for a single, complete color palette.
 */
export interface ColorSet {
  // Brand
  primary: string;
  secondary: string;

  // Accents & Status
  accent: string;
  accentPressed: string;
  info: string;
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
  surfaceMuted: string; // list rows / chips
  card: string; // slightly lighter than background
  cardRaised: string; // for prominent cards
  divider: string;
  border: string;
  borderMuted: string;
  overlay: string;
  overlayStrong: string;
  shadow: string;

  // Focus
  focus: string; // soft outline
  focusRing: string;

  // Buttons
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonGhostBg: string;
  buttonGhostBorder: string;
  buttonGhostText: string;

  // Chart Accents
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  chart6: string;
  chartGrid: string;
  chartAreaFade: string;

  // Gradients
  gradAccent: string;
  gradLime: string;
  gradBlue: string;
  gradAmber: string;

  // States
  pressed: string;
  hovered: string;
  selected: string;
  disabled: string;
}

/**
 * @type AppTheme
 * @description The complete theme interface for the application.
 */
export type AppTheme = {
  name: ThemeName;
  colors: ColorSet;
  spacing: Spacing;
  typography: Typography;
  tokens: NimbusTokens;
};

/**
 * @interface ThemeColors
 * @description A collection of all available color themes and global configurations.
 * Used primarily in the theme context or palette definitions.
 */
export interface ThemeColors {
  light: ColorSet;
  dark: ColorSet;
  typography: Typography;
  spacing: Spacing;
  tokens: NimbusTokens;
}
