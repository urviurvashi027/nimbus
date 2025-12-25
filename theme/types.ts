export type ThemeName = "dark" | "light"; // add "basic" later only if needed

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
  lineHeight?: number;
}

export interface Typography {
  h1: FontSet;
  h2: FontSet;
  h3: FontSet;
  body: FontSet;
  caption: FontSet;
  button: FontSet;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  "2xl": number;
}

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

export interface ColorSet {
  primary: string;
  secondary: string;

  background: string;
  surface: string;
  surfaceMuted: string;
  card: string;
  cardRaised: string;

  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  accent: string;
  accentPressed: string;

  info: string;
  success: string;
  warning: string;
  error: string;

  divider: string;
  border: string;
  borderMuted: string;

  overlay: string;
  overlayStrong: string;
  shadow: string;

  focus: string;
  focusRing: string;

  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonGhostBg: string;
  buttonGhostBorder: string;
  buttonGhostText: string;

  pressed: string;
  hovered: string;
  selected: string;
}

export type AppTheme = {
  name: ThemeName;
  colors: ColorSet;
  spacing: Spacing;
  typography: Typography;
  tokens: NimbusTokens;
};
