import type { ImageSourcePropType } from "react-native";

import type { TrackType } from "@/constants/data/soundtrack";

const FALLBACK_IMAGE = require("../../../assets/images/mt.jpg");
const FALLBACK_SOURCE = require("../../../assets/dump/lightRain.mp3");

type SoundscapeRawTrack = {
  id?: string;
  title?: string;
  name?: string;
  duration?: unknown;
  description?: string;
  image?: unknown;
  source?: unknown;
  category?: string;
  isLocked?: boolean;
};

export type SoundscapeTrack = TrackType & {
  durationLabel: string;
  tags: string[];
  filterTags: string[];
  frequencyHz: number | null;
};

const RAW_SOUNDSCAPES = [
  {
    id: "528-dna-integrity",
    title: "528Hz: DNA Integrity",
    duration: "6 min",
    description: "Alpha 10Hz | Solfeggio 528Hz",
    image: require("../../../assets/images/mt.jpg"),
    source: FALLBACK_SOURCE,
    category: "Frequency",
    isLocked: false,
  },
  {
    id: "432-earth-pulse",
    title: "432Hz: Earth Pulse",
    duration: "7 min",
    description: "Theta 6Hz | Pythagorean 432Hz",
    image: require("../../../assets/images/loginLatest.png"),
    source: FALLBACK_SOURCE,
    category: "Grounding",
    isLocked: false,
  },
  {
    id: "639-neural-bridge",
    title: "639Hz: Neural Bridge",
    duration: "8 min",
    description: "Gamma 40Hz | Solfeggio 639Hz",
    image: require("../../../assets/images/bodyShape/1.png"),
    source: FALLBACK_SOURCE,
    category: "Coherence",
    isLocked: false,
  },
  {
    id: "174-foundation",
    title: "174Hz: Foundation",
    duration: "5 min",
    description: "Delta 2Hz | Solfeggio 174Hz",
    image: require("../../../assets/images/bodyShape/2.png"),
    source: FALLBACK_SOURCE,
    category: "Release",
    isLocked: false,
  },
  {
    id: "rain-cedar",
    title: "Rain Over Cedar",
    duration: "10 min",
    description: "Late rain, cedar hush, and low-frequency calm.",
    image: require("../../../assets/images/mentalTest/childhoodTrauma.png"),
    source: FALLBACK_SOURCE,
    category: "Nature",
    isLocked: false,
  },
  {
    id: "ocean-drift",
    title: "Ocean Drift",
    duration: "12 min",
    description: "Slow surf texture for sleep and deep reset.",
    image: require("../../../assets/images/result.jpg"),
    source: FALLBACK_SOURCE,
    category: "Sleep",
    isLocked: false,
  },
] as const;

const normalizeKey = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

const formatTagLabel = (value?: string | null) => {
  if (!value) return "Curated";

  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((part) =>
      part && part === part.toUpperCase()
        ? part
        : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(" ");
};

const formatDurationLabel = (duration: unknown) => {
  if (typeof duration === "number" && Number.isFinite(duration)) {
    return `${duration} min`;
  }

  if (typeof duration === "string") {
    const trimmed = duration.trim();
    if (!trimmed) return "3 min";
    if (/\d/.test(trimmed)) return trimmed;
    return `${trimmed} min`;
  }

  return "3 min";
};

const detectMoodTag = (title: string, description: string, category: string) => {
  const blob = `${title} ${description} ${category}`.toLowerCase();

  if (/(rain|storm|wave|ocean|river|stream|brook|water|sea)/.test(blob)) {
    return "Nature";
  }
  if (/(sleep|dream|night|rest|nap|lullaby)/.test(blob)) {
    return "Sleep";
  }
  if (/(focus|study|work|clarity|concentr|productiv|brain)/.test(blob)) {
    return "Focus";
  }
  if (/(binaural|frequency|hz|resonance|pulse|alpha|beta|theta|delta|gamma)/.test(blob)) {
    return "Frequency";
  }
  if (/(breath|breathing|meditat|calm|relax|soothe)/.test(blob)) {
    return "Calm";
  }

  return "Curated";
};

const uniqueStrings = (values: string[]) =>
  Array.from(new Set(values.filter(Boolean)));

const extractFrequencyHz = (title: string) => {
  const match = title.match(/(\d+(?:\.\d+)?)\s*hz/i);
  return match ? Number(match[1]) : null;
};

const resolveImageSource = (image: unknown): ImageSourcePropType => {
  if (!image) return FALLBACK_IMAGE;
  if (typeof image === "string") return { uri: image };
  if (typeof image === "number") return image;
  if (typeof image === "object") {
    const maybeImage = image as { uri?: unknown; url?: unknown };
    if (typeof maybeImage.uri === "string") return { uri: maybeImage.uri };
    if (typeof maybeImage.url === "string") return { uri: maybeImage.url };
    return image as ImageSourcePropType;
  }

  return FALLBACK_IMAGE;
};

const resolveAudioSource = (source: unknown) => {
  if (!source) return FALLBACK_SOURCE;
  if (typeof source === "string") return { uri: source };
  return source;
};

export const toSoundscapeTrack = (
  item: SoundscapeRawTrack | unknown,
  index: number
): SoundscapeTrack => {
  const record = item && typeof item === "object" ? (item as SoundscapeRawTrack) : {};
  const title = String(record.title ?? `Soundscape ${index + 1}`);
  const description = String(record.description ?? "");
  const category = formatTagLabel(String(record.category ?? "Curated"));
  const durationLabel = formatDurationLabel(record.duration);
  const moodTag = detectMoodTag(title, description, category);
  const tags = uniqueStrings([category, moodTag]);

  return {
    ...(record ?? {}),
    id: String(record.id ?? `${normalizeKey(title)}-${index}`),
    title,
    name: record.name ?? title,
    duration: durationLabel,
    durationLabel,
    description,
    image: resolveImageSource(record.image),
    source: resolveAudioSource(record.source),
    category,
    isLocked: Boolean(record.isLocked),
    tags,
    filterTags: tags,
    frequencyHz: extractFrequencyHz(title),
  };
};

export const mockSoundscapeSessions = RAW_SOUNDSCAPES.map((item, index) =>
  toSoundscapeTrack(item, index)
);

export const getSoundscapeById = (soundscapeId?: string | null) =>
  mockSoundscapeSessions.find((item) => item.id === soundscapeId) ??
  mockSoundscapeSessions[0];

export const buildSoundscapeSubtitle = (soundscape: SoundscapeTrack) =>
  `${soundscape.durationLabel} · ${soundscape.category}`;

export const buildSoundscapeBenefits = (soundscape: SoundscapeTrack) => {
  const blob = `${soundscape.title} ${soundscape.description} ${soundscape.category}`.toLowerCase();

  if (/(sleep|dream|night|rest|nap|lullaby)/.test(blob)) {
    return [
      "Lower the pace before the night settles in.",
      "Let the room feel softer without asking for effort.",
      "Move the body toward a slower, quieter reset.",
    ];
  }

  if (/(rain|storm|wave|ocean|river|stream|brook|water|sea)/.test(blob)) {
    return [
      "Wrap the session in an organic, grounded texture.",
      "Keep attention anchored in a calm natural rhythm.",
      "Build a quiet background for restoration.",
    ];
  }

  if (/(focus|study|work|clarity|concentr|productiv|brain)/.test(blob)) {
    return [
      "Clear a small corridor for concentration.",
      "Give the mind one steady cadence to return to.",
      "Reduce friction before deep work or study.",
    ];
  }

  if (/(release|soften|relax|calm|breath|meditat)/.test(blob)) {
    return [
      "Let tension soften without needing to be solved.",
      "Create a slower internal tempo for the body.",
      "Support a more spacious exhale through the session.",
    ];
  }

  return [
    "Keep the session simple and premium.",
    "Support a steadier internal rhythm.",
    "Create a quiet backdrop for presence.",
  ];
};

export const formatSoundscapeTagLabel = (value: string) => formatTagLabel(value);

export const buildSoundscapeResonanceLabel = (soundscape: SoundscapeTrack) =>
  soundscape.frequencyHz
    ? `RESONATING AT ${soundscape.frequencyHz.toFixed(2)} HZ`
    : `RESONATING IN ${soundscape.category.toUpperCase()}`;

export const resolveSoundscapePlaybackSource = (soundscapeId?: string | null) =>
  getSoundscapeById(soundscapeId)?.source ?? FALLBACK_SOURCE;

