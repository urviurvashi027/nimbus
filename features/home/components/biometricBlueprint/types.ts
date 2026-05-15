export type BlueprintKey = "water" | "sleep" | "meditation";

export type BlueprintLayout = "compact" | "wide";

export type BlueprintIcon = "water-outline" | "moon-outline" | "leaf-outline";

export type CheckInRoute =
  | "/(auth)/check-in/water"
  | "/(auth)/check-in/sleep"
  | "/(auth)/check-in/meditation"
  | "/(auth)/check-in/reading"
  | "/(auth)/check-in/meditation-anchor";

export type LoadedCheckin = {
  id: number;
  name: string;
  goalQuantity: number;
  completedQuantity: number;
  unit: string;
  route: CheckInRoute;
  completed: boolean;
};

export type BlueprintTemplate = {
  key: BlueprintKey;
  title: string;
  kicker: string;
  icon: BlueprintIcon;
  route: CheckInRoute;
  accent: string;
  gradientEnd: string;
  tint: string;
  previewMetric: string;
  previewProgress: number;
  searchTerms: string[];
  layout: BlueprintLayout;
};

export type BlueprintCard = BlueprintTemplate & {
  item?: LoadedCheckin;
  progress: number;
  metric: string;
  disabled: boolean;
};

export type BiometricBlueprintPanelProps = {
  date: string;
};
