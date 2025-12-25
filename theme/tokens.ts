import { StyleSheet } from "react-native";
import type { NimbusTokens } from "./types";

export const tokens: NimbusTokens = {
  radius: { input: 16, button: 18, card: 20, chip: 999 },
  size: { inputHeight: 56, buttonHeight: 56, otpBox: 52, progressHeight: 6 },
  layout: { screenX: 20, topPad: 95, gap: 12, gapLg: 20, sectionGap: 28 },
  border: { hairline: StyleSheet.hairlineWidth, strong: 2 },
};
