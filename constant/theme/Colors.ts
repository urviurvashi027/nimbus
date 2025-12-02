import { ThemeColors, Spacing, Typography } from "../../types/themeTypes";

const tintColorLight = "#f5bcdd";
// const tintColorDark = "#f5bcdd";
export const primaryColor = "#f5bcdd";

type ColorSetEx = {
  [colorName: string]: string;
};

interface ThemeColorsEx {
  basic: ColorSetEx;
  light: ColorSetEx;
  dark: ColorSetEx;
}

export default {
  light: {
    text: "#2f2f2f",
    background: "#fffdf7",
    tint: tintColorLight,
    tabIconDefault: "#5f5f5f",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#2f2f2f",
    background: "#fffdf7",
    tint: tintColorLight,
    tabIconDefault: "#5f5f5f",
    tabIconSelected: tintColorLight,
  },
};

const commonColor = {
  commonWhite: "#FFFFFF",
  commonBlack: "#000000",
  activeColor: "#f5bcdd",
  deactiveColor: "#f6f8fc",
  boxActiveColor: "#f5bcdd",
};

export const themeColors: ThemeColorsEx = {
  basic: {
    primaryColor: "#fffdf7",
    secondaryColor: "#f5bcdd",
    tertiaryColor: "#dfd9f9",
    success: "#32B744",
    danger: "#fa8578",
    warning: "#f5d96e",
    lightGrey: "#C0C0C0",
    mediumGrey: "#5f5f5f",
    darkGrey: "#2f2f2f",
    commonWhite: "#FFFFFF",
    commonBlack: "#000000",
    activeColor: "#f5bcdd",
    deactiveColor: "#f6f8fc",
    boxActiveColor: "#f5bcdd",
    subheader: "#5f5f5f",
    deactiveText: "",
    text: "#2f2f2f",
    activeText: "#5f5f5f",
    // done:#32B744
  },
  light: {
    primaryColor: "#f5bcdd",
    text: "#2f2f2f",
    background: "#fffdf7",
    tint: "#f5bcdd",
    inpurBorderColor: "#d7d9de",
    tabIconDefault: "#5f5f5f",
    tabIconSelected: "#f5bcdd",
    boxShadowColor: "#c6c2c2",
    inputLabel: "#f6f8fc",
    divider: "#e6e7eb",
    ...commonColor,
  },
  dark: {
    primaryColor: "#f5bcdd",
    text: "#2f2f2f",
    background: "#fffdf7",
    tint: "#f5bcdd",
    inpurBorderColor: "#d7d9de",
    tabIconDefault: "#5f5f5f",
    tabIconSelected: "#f5bcdd",
    boxShadowColor: "#c6c2c2",
    inputLabel: "#f6f8fc",
    divider: "#e6e7eb",
    ...commonColor,
  },
};

// latest theme color
// Define a base set of colors that might be shared or used as a default
const basicColors: any = {
  primary: "#007AFF",
  secondary: "#5856D6",
  // border: "#D1D1D6",
  // overlay: "rgba(0, 0, 0, 0.5)",

  // new property value
  background: "#1C1E1A",
  divider: "#242721",
  surface: "#2A2D24",
  textPrimary: "#ECEFF4",
  textSecondary: "#A1A69B",
  disabled: "#5C6157",
  accent: "#A3BE8C",
  accentPressed: "#8FAD78",
  info: "#5E81AC",
  success: "#90B47A",
  warning: "#EBCB8B",
  error: "#BF616A",
  // NEW — neutrals for elevation/borders
  card: "#22251E", // slightly lighter than background
  cardRaised: "#262A22", // for prominent cards
  surfaceMuted: "#23261F", // list rows / chips
  border: "#3A3E33", // hairline borders
  borderMuted: "#2D3028",

  // NEW — overlays / scrims
  overlay: "rgba(12,14,11,0.6)", // modal backdrop
  overlayStrong: "rgba(12,14,11,0.75)",
  shadow: "rgba(0,0,0,0.35)", // card shadow

  // NEW — focus / outline
  focus: "#D7E3C8", // soft light-green outline
  focusRing: "rgba(163,190,140,0.35)",

  // NEW — buttons
  buttonPrimary: "#A3BE8C", // = accent
  buttonPrimaryText: "#10120E",
  buttonGhostBg: "#262A22",
  buttonGhostBorder: "#3A3E33",
  buttonGhostText: "#ECEFF4",

  // NEW — chart accents (brighter but cohesive)
  // Use these for lines, bars, and categorical series.
  chart1: "#CFE86C", // fresh lime (pairs with accent)
  chart2: "#79A9F2", // softened blue (fits info family)
  chart3: "#F2B36E", // warm amber (fits warning family)
  chart4: "#E48FA3", // muted rose (ties to error family)
  chart5: "#9DD2C5", // seafoam (secondary success)
  chart6: "#C8B8F4", // lavender (for variety)
  chartGrid: "#35382E", // subtle grid/rules
  chartAreaFade: "rgba(163,190,140,0.10)",

  // NEW — gradients (for charts/headers)
  gradAccent: ["#B8D39B", "#8FAD78"], // light -> base accent
  gradLime: ["#D6F083", "#A3C94D"], // for progress arcs
  gradBlue: ["#A9C7F7", "#6F97D3"],
  gradAmber: ["#F6C889", "#DFA154"],

  // NEW — states
  pressed: "rgba(255,255,255,0.04)",
  hovered: "rgba(255,255,255,0.03)",
  selected: "rgba(163,190,140,0.12)",
};

const typography: Typography = {
  h1: { fontSize: 32, fontWeight: "bold", lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: "bold", lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: "600", lineHeight: 28 },
  body: { fontSize: 16, fontWeight: "normal", lineHeight: 24 },
  caption: { fontSize: 12, fontWeight: "normal", lineHeight: 16 },
  button: { fontSize: 16, fontWeight: "bold" },
};

// 2. Define your standard spacing
const spacing: Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  "2xl": 32,
};

// Now, create the main theme object that adheres to the ThemeColors interface
export const theme: ThemeColors = {
  // The 'basic' theme can be the same as your default light theme
  basic: basicColors,

  // The 'dark' theme can extend the basic one if they are similar
  dark: {
    ...basicColors,
    // You can override specific colors for light theme if needed
    // For example: background: '#FAFAFA',
  },

  // The 'light' theme will have its own distinct color set
  light: {
    ...basicColors,
    overlay: "rgba(0, 0, 0, 0.6)",
  },
  spacing: spacing,
  typography: typography,
};
