import { SpacingTokens } from "./types";

export const SVASpacing: SpacingTokens = {
  scale: {
    px: 1,
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  layout: {
    screenPadding: 20,

    screenPaddingTop: {
      ios: 44,
      android: 24,
    },

    sectionGap: 48,
    contentGap: 32,
    stackGap: 16,
  },

  component: {
    inputHeight: 56,
    buttonHeight: 56,
    chipHeight: 36,
    headerHeight: 56,
    headerHeightLarge: 64,
  },

  icon: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 999,
  },

  borderWidth: {
    hairline: 0.5,
    thin: 1,
    medium: 2,
  },
};
