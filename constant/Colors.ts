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
  activeColor: "#DE5E69",
  deactiveColor: "#DE5E6950",
  boxActiveColor: "#DE5E6940",
};

export const themeColors: ThemeColors = {
  basic: {
    WHITE: "#FFFFFF",
    PRIMARY: "#3d55db",
    GRAY: "#808080",
    LIGHT_GRAY: "#aaa",
  },
  light: {
    primaryColor: "#f5bcdd",
    text: "#2f2f2f",
    background: "#fffdf7",
    tint: tintColorLight,
    tabIconDefault: "#5f5f5f",
    tabIconSelected: tintColorLight,
    ...commonColor,
  },
  dark: {
    primaryColor: "#f5bcdd",
    text: "#fffdf7",
    background: "#2f2f2f",
    tint: tintColorDark,
    tabIconDefault: "#5f5f5f",
    tabIconSelected: tintColorDark,
    ...commonColor,
  },
};
