const tintColorLight = "#f5bcdd";
const tintColorDark = "#f5bcdd";
export const primaryColor = "#f5bcdd";

type ColorSet = {
  [colorName: string]: string;
};

interface ThemeColors {
  basic: ColorSet;
  light: ColorSet;
  dark: ColorSet;
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
    text: "#fffdf7",
    background: "#2f2f2f",
    tint: tintColorDark,
    tabIconDefault: "#5f5f5f",
    tabIconSelected: tintColorDark,
  },
};

const commonColor = {
  commonWhite: "#FFFFFF",
  commonBlack: "#000000",
  activeColor: "#f5bcdd",
  deactiveColor: "#f6f8fc",
  boxActiveColor: "#f5bcdd",
};

export const themeColors: ThemeColors = {
  basic: {
    primaryColor: "#fffdf7",
    secondaryColor: "#f5bcdd",
    tertiaryColor: "#dfd9f9",
    success: "#b6c682",
    danger: "#fa8578",
    warning: "#f5d96e",
    lightGrey: "#f6f8fc",
    mediumGrey: "#5f5f5f",
    darkGrey: "#2f2f2f",
    commonWhite: "#FFFFFF",
    commonBlack: "#000000",
    activeColor: "#f5bcdd",
    deactiveColor: "#f6f8fc",
    boxActiveColor: "#f5bcdd",
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
    text: "#fffdf7",
    inputLabel: "#f6f8fc",
    background: "#2f2f2f",
    tint: "#f5bcdd",
    divider: "#727275",
    inpurBorderColor: "#5f5f5f",
    tabIconDefault: "#5f5f5f",
    boxShadowColor: "#f5f5f5",
    tabIconSelected: "#f5bcdd",
    ...commonColor,
  },
};
