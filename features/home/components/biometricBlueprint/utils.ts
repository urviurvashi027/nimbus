import type { ColorSet } from "@/theme/types";
import { resolveUnit, routeFor } from "@/features/check-in/utils/dailyCheckin";

import type {
  BlueprintCard,
  BlueprintKey,
  BlueprintTemplate,
  CheckInRoute,
  LoadedCheckin,
} from "./types";

type BlueprintRawCheckin = {
  id?: unknown;
  name?: unknown;
  target_unit?: unknown;
  goal?: unknown;
  metric_count?: unknown;
  completed_unit?: unknown;
  completed?: unknown;
  metric_unit?: string | null;
};

const normalize = (value?: string) => (value || "").toLowerCase();

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) return "0";
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded)
    ? `${rounded.toFixed(0)}`
    : `${rounded.toFixed(1)}`;
};

export const getBlueprintItems = (value: unknown): LoadedCheckin[] => {
  const source =
    Array.isArray(value)
      ? value
      : value && typeof value === "object" && Array.isArray((value as { data?: unknown }).data)
      ? ((value as { data: unknown[] }).data ?? [])
      : [];

  return source
    .map((item) => toLoadedCheckin(item))
    .filter((item): item is LoadedCheckin => Boolean(item));
};

export const toLoadedCheckin = (value: unknown): LoadedCheckin | null => {
  if (!value || typeof value !== "object") return null;

  const candidate = value as BlueprintRawCheckin;
  const name = typeof candidate.name === "string" && candidate.name.trim()
    ? candidate.name
    : "Habit";

  return {
    id: Number(candidate.id ?? 0),
    name,
    goalQuantity: Number(
      candidate.target_unit ?? candidate.goal ?? candidate.metric_count ?? 0
    ),
    completedQuantity: Number(candidate.completed_unit ?? 0),
    unit: resolveUnit({
      metric_unit: typeof candidate.metric_unit === "string" ? candidate.metric_unit : null,
      name,
    }),
    route: routeFor(name) as CheckInRoute,
    completed: Boolean(candidate.completed),
  };
};

export const buildMetric = (key: BlueprintKey, item?: LoadedCheckin) => {
  if (!item) {
    return key === "water" ? "0%" : key === "sleep" ? "0 HR" : "0 min";
  }

  const goal = Number(item.goalQuantity ?? 0);
  const completed = Number(item.completedQuantity ?? 0);
  const effectiveGoal = goal > 0 ? goal : completed;

  if (key === "water") {
    const pct =
      effectiveGoal > 0 ? Math.min((completed / effectiveGoal) * 100, 100) : 0;
    return `${Math.round(pct)}%`;
  }

  if (key === "sleep") {
    return `${formatNumber(effectiveGoal || completed)} HR`;
  }

  return `${Math.round(effectiveGoal || completed)} min`;
};

export const getProgress = (item?: LoadedCheckin) => {
  if (!item) return 0;
  const goal = Number(item.goalQuantity ?? 0);
  const completed = Number(item.completedQuantity ?? 0);
  const effectiveGoal = goal > 0 ? goal : completed;
  if (effectiveGoal <= 0) return 0;
  return Math.max(0, Math.min(completed / effectiveGoal, 1));
};

export const buildTemplates = (theme: ColorSet): BlueprintTemplate[] => [
  {
    key: "water",
    title: "Hydration",
    kicker: "JALA",
    icon: "water-outline",
    route: "/(auth)/check-in/water",
    accent: theme.chart1 ?? theme.accent ?? "#CFE86C",
    gradientEnd: theme.gradLime ?? theme.accentPressed ?? "#D6F083",
    tint: theme.selected ?? "rgba(163,190,140,0.12)",
    previewMetric: "68%",
    previewProgress: 0.68,
    searchTerms: ["water"],
    layout: "compact",
  },
  {
    key: "sleep",
    title: "Deep Sleep",
    kicker: "NIDRA",
    icon: "moon-outline",
    route: "/(auth)/check-in/sleep",
    accent: theme.chart2 ?? theme.info ?? "#5E81AC",
    gradientEnd: theme.gradBlue ?? theme.chart2 ?? "#A9C7F7",
    tint: "rgba(94,129,172,0.12)",
    previewMetric: "7 HR",
    previewProgress: 0.58,
    searchTerms: ["sleep"],
    layout: "compact",
  },
  {
    key: "meditation",
    title: "Meditation",
    kicker: "Dhyana",
    icon: "leaf-outline",
    route: "/(auth)/check-in/meditation",
    accent: theme.accent ?? theme.chart1 ?? "#A3BE8C",
    gradientEnd: theme.gradAccent ?? theme.gradLime ?? "#B8D39B",
    tint: theme.selected ?? "rgba(163,190,140,0.12)",
    previewMetric: "18 min",
    previewProgress: 0.74,
    searchTerms: ["medit"],
    layout: "wide",
  },
];

export const buildBlueprintCards = (
  items: LoadedCheckin[],
  templates: BlueprintTemplate[]
): BlueprintCard[] =>
  templates.map((template) => {
    const item = items.find((entry) =>
      template.searchTerms.some((term) => normalize(entry.name).includes(term))
    );
    const actualProgress = getProgress(item);
    const hasMeaningfulProgress = actualProgress > 0;

    return {
      ...template,
      item,
      progress: hasMeaningfulProgress ? actualProgress : template.previewProgress,
      metric: hasMeaningfulProgress
        ? buildMetric(template.key, item)
        : template.previewMetric,
      disabled: !item?.id,
    };
  });
