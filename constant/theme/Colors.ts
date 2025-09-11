import {
  ThemeColors,
  ColorSet,
  Spacing,
  Typography,
} from "../../types/themeTypes";

const tintColorLight = "#f5bcdd";
const tintColorDark = "#f5bcdd";
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

    // text: "#fffdf7",
    // background: "#2f2f2f",
    // tint: tintColorDark,
    // tabIconDefault: "#5f5f5f",
    // tabIconSelected: tintColorDark,
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

    // dark theme color combination
    // primaryColor: "#f5bcdd",
    // text: "#fffdf7",
    // inputLabel: "#f6f8fc",
    // background: "#2f2f2f",
    // tint: "#f5bcdd",
    // divider: "#727275",
    // inpurBorderColor: "#5f5f5f",
    // tabIconDefault: "#5f5f5f",
    // boxShadowColor: "#f5f5f5",
    // tabIconSelected: "#f5bcdd",
    // ...commonColor,
  },
};

const colors = {
  placeholder: "",
  label: "",
  active: "",
  deactive: "",
  lable: "",
  inputBorder: "",
  btnBorder: "",
  text: "",
  itemDivider: "",
};

// latest theme color
// Define a base set of colors that might be shared or used as a default
const basicColors: any = {
  primary: "#007AFF",
  secondary: "#5856D6",
  border: "#D1D1D6",
  overlay: "rgba(0, 0, 0, 0.5)",

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
};

// Now, create the main theme object that adheres to the ThemeColors interface
export const theme: ThemeColors = {
  // The 'basic' theme can be the same as your default light theme
  basic: basicColors,

  // The 'light' theme can extend the basic one if they are similar
  dark: {
    ...basicColors,
    // You can override specific colors for light theme if needed
    // For example: background: '#FAFAFA',
  },

  // The 'dark' theme will have its own distinct color set
  light: {
    ...basicColors,
    // primary: "#0A84FF", // Often a brighter primary for dark backgrounds
    // secondary: "#5E5CE6",
    // accent: "#FF9F0A",
    // success: "#30D158",
    // warning: "#FFD60A",
    // error: "#FF453A",
    // textPrimary: "#FFFFFF",
    // textSecondary: "#8D8D93",
    // textDisabled: "#48484A",
    // background: "#000000",
    // surface: "#1C1C1E", // Dark cards, modals
    // border: "#38383A",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
  spacing: spacing,
  typography: typography,
};
