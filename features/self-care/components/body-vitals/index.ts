export { ActivityLevelCard } from "./ActivityLevelCard";
export { GenderTile } from "./GenderTile";
export { HeightSlider } from "./HeightSlider";
export { InsightCard } from "./InsightCard";
export { MetricTileShell } from "./MetricTileShell";
export { NumericMetricTile, NumericMetricTileFooter } from "./NumericMetricTile";
export type {
  NumericMetricTileConfig,
  SomaticGender,
  SomaticInsight,
  SomaticInsightKey,
} from "./types";
export {
  calculateMaintenanceCalories,
  calculateProteinTarget,
  clampHeightCm,
  deriveArchitecture,
  formatFlexibleDecimal,
  parseMetricNumber,
  sanitizeDecimalInput,
  sanitizeIntegerInput,
  stepWeight,
} from "./utils";
