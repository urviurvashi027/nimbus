import type { ReactNode } from "react";
import type { KeyboardTypeOptions } from "react-native";
import type { Ionicons } from "@expo/vector-icons";
import { ROUTES } from "@/constants/routes";

export type SomaticGender = "masculine" | "feminine";

export type SomaticInsightKey = "protein" | "calorie" | "architecture";

export type SomaticInsightRoute =
  | typeof ROUTES.TABS.HOME
  | typeof ROUTES.AUTH.SELF_CARE_PROTEIN
  | typeof ROUTES.AUTH.SELF_CARE_CALORIE_THRESHOLD
  | typeof ROUTES.AUTH.SELF_CARE_BODY_ARCHITECTURE
  | typeof ROUTES.AUTH.TOOLS_CALORIE_CALC
  | typeof ROUTES.AUTH.TOOLS_BODY_ARCHITECTURE;

export type SomaticInsight = {
  key: SomaticInsightKey;
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  route?: SomaticInsightRoute;
};

export type NumericMetricTileConfig = {
  label: string;
  value: string;
  unit?: string;
  trailingIcon?: keyof typeof Ionicons.glyphMap;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  footer?: ReactNode;
  accentTint?: string;
};
