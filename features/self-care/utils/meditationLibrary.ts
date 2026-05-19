import type { ImageSourcePropType } from "react-native";

const FALLBACK_IMAGE = require("../../../assets/images/mt.jpg");

const MEDITATION_TAG_PRIORITY = [
  "breath",
  "calm",
  "focus",
  "sleep",
  "release",
  "beginner",
] as const;

export type MeditationTemplate = {
  id: string;
  title: string;
  description: string;
  tag: string;
  tags: string[];
  durationLabel: string;
  image: ImageSourcePropType;
  source?: string | null;
  isLocked: boolean;
  category?: string;
};

export type RawMeditationTemplate = {
  id?: number | string;
  title?: string;
  description?: string;
  image?: string | null;
  source?: string | null;
  category?: string;
  duration?: number | string;
  isLocked?: boolean;
  is_locked?: boolean;
};

const titleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const normalizeMeditationTag = (value: string) =>
  value
    .replace(/^#+/, "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const formatMeditationTagLabel = (value: string) =>
  titleCase(normalizeMeditationTag(value));

const tagMatchers: { pattern: RegExp; tag: string }[] = [
  { pattern: /\b(breath|breathwork|breathing|inhale|exhale)\b/i, tag: "breath" },
  { pattern: /\b(calm|ground|settle|stress|anxiety|soothe)\b/i, tag: "calm" },
  { pattern: /\b(focus|clarity|attention|steady)\b/i, tag: "focus" },
  { pattern: /\b(sleep|dream|rest|drift)\b/i, tag: "sleep" },
  { pattern: /\b(release|unwind|let go|soften)\b/i, tag: "release" },
  { pattern: /\b(beginner|starter|intro)\b/i, tag: "beginner" },
];

export const deriveMeditationTags = (
  item: RawMeditationTemplate,
  title: string,
  description: string
) => {
  const sourceText = [title, description, item.category ?? ""]
    .join(" ")
    .toLowerCase();

  const derived = tagMatchers
    .filter(({ pattern }) => pattern.test(sourceText))
    .map(({ tag }) => tag);

  const fallback = normalizeMeditationTag(item.category ?? "");
  const tags = derived.length ? derived : [fallback || "calm"];

  return Array.from(
    new Set(tags.map((tag) => normalizeMeditationTag(tag)).filter(Boolean))
  );
};

export const sortMeditationTags = (tags: string[]) => {
  const unique = Array.from(new Set(tags.map(normalizeMeditationTag))).filter(Boolean);

  return unique.sort((a, b) => {
    const aIndex = MEDITATION_TAG_PRIORITY.indexOf(a as any);
    const bIndex = MEDITATION_TAG_PRIORITY.indexOf(b as any);

    if (aIndex === -1 && bIndex === -1) {
      return a.localeCompare(b);
    }
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};

export const mapMeditationTemplate = (
  item: RawMeditationTemplate,
  index: number
): MeditationTemplate => {
  const title = item.title?.trim() || `Meditation ${index + 1}`;
  const description =
    item.description?.trim() ||
    "A quiet cadence for the body and the part of the mind that listens.";
  const tags = sortMeditationTags(deriveMeditationTags(item, title, description));
  const durationValue =
    typeof item.duration === "number"
      ? `${item.duration} min`
      : typeof item.duration === "string" && item.duration.trim()
        ? item.duration.includes("min")
          ? item.duration.trim()
          : `${item.duration.trim()} min`
        : "5 min";

  return {
    id: String(item.id ?? `${title}-${index}`),
    title,
    description,
    tag: tags[0] ?? "calm",
    tags,
    durationLabel: durationValue,
    image: item.image ? { uri: item.image } : FALLBACK_IMAGE,
    source: item.source ?? null,
    isLocked: Boolean(item.isLocked ?? item.is_locked),
    category: item.category?.trim() || tags[0] || "calm",
  };
};

export const buildMeditationFilterOptions = (templates: MeditationTemplate[]) => {
  const tags = sortMeditationTags(templates.flatMap((template) => template.tags));

  return [
    { label: "All Modes", value: "all" as const },
    ...tags.map((tag) => ({
      label: formatMeditationTagLabel(tag),
      value: tag,
    })),
  ];
};

export const filterMeditationTemplates = (
  templates: MeditationTemplate[],
  selectedTag: string
) => {
  if (selectedTag === "all") return templates;
  return templates.filter((template) => template.tags.includes(selectedTag));
};

export const fallbackMeditationTemplates: MeditationTemplate[] = [
  mapMeditationTemplate(
    {
      id: "stillness-anchor",
      title: "Stillness Anchor",
      description:
        "Use the breath to slow the edges of the day and settle the room.",
      category: "breath",
      duration: 5,
      source: "",
    },
    0
  ),
  mapMeditationTemplate(
    {
      id: "moonlit-reset",
      title: "Moonlit Reset",
      description:
        "A calm reset for the nervous system when the day has been too loud.",
      category: "calm",
      duration: 7,
      source: "",
    },
    1
  ),
  mapMeditationTemplate(
    {
      id: "focus-lantern",
      title: "Focus Lantern",
      description:
        "Return to one bright point at a time and let the edges soften.",
      category: "focus",
      duration: 6,
      source: "",
    },
    2
  ),
  mapMeditationTemplate(
    {
      id: "sleep-drift",
      title: "Sleep Drift",
      description:
        "Let the body grow heavier while the breath becomes quieter.",
      category: "sleep",
      duration: 8,
      source: "",
    },
    3
  ),
  mapMeditationTemplate(
    {
      id: "soft-release",
      title: "Soft Release",
      description:
        "Unwind tension and leave the shoulders somewhere gentler than before.",
      category: "release",
      duration: 4,
      source: "",
    },
    4
  ),
];

export const mockMeditationRecommendations = fallbackMeditationTemplates;
