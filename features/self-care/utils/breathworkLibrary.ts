import type { ImageSourcePropType } from "react-native";

import {
  BREATH_PATTERNS,
  formatBreathCadence,
  formatBreathToneLabel,
  type BreathPattern,
} from "@/features/self-care/utils/mindPractices";

export type BreathRecommendationPalette = {
  colors: [string, string];
  accent: string;
  accentSoft: string;
  text: string;
  tagBg: string;
  tagBorder: string;
  tagText: string;
};

export type BreathRecommendation = {
  id: string;
  tone: BreathPattern["tone"];
  title: string;
  subtitle: string;
  mantra: string;
  tag: string;
  palette: BreathRecommendationPalette;
  icon: string;
};

export type BreathWorkDetail = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  context: string;
  steps: string[];
  benefits: string[];
  tips: string[];
  image: ImageSourcePropType;
  tone: BreathPattern["tone"];
  toneLabel: string;
  tag: string;
  mantra: string;
  palette: BreathRecommendationPalette;
  icon: string;
};

const BREATH_WORK_HERO_IMAGE = require("../../../assets/images/mt.jpg");

const BREATH_RECOMMENDATION_TITLES: Record<string, string> = {
  "box-breath": "4-4-4-4: Box Breath",
  "coherent-breath": "5-5: Coherent Flow",
  "release-breath": "4-6: Release Path",
  "sleep-breath": "4-2-6-2: Night Drift",
};

const BREATH_RECOMMENDATION_MANTRAS: Record<string, string> = {
  "box-breath": "Equal counts make the room feel steady again.",
  "coherent-breath": "A smooth rhythm gives the nervous system something simple to follow.",
  "release-breath": "Longer exhales loosen tension without asking for force.",
  "sleep-breath": "Let the count soften until the body can hand over the work.",
};

const BREATH_RECOMMENDATION_ICONS: Record<string, string> = {
  "box-breath": "square-rounded-outline",
  "coherent-breath": "waveform",
  "release-breath": "feather",
  "sleep-breath": "moon-waning-crescent",
};

const BREATH_RECOMMENDATION_PALETTES: BreathRecommendationPalette[] = [
  {
    colors: ["#1E231B", "#0F120E"],
    accent: "#C6D7A2",
    accentSoft: "rgba(198, 215, 162, 0.14)",
    text: "#E6E8D7",
    tagBg: "rgba(255, 255, 255, 0.06)",
    tagBorder: "rgba(255, 255, 255, 0.10)",
    tagText: "#D6E4B8",
  },
  {
    colors: ["#1D2627", "#101517"],
    accent: "#9CD4C8",
    accentSoft: "rgba(156, 212, 200, 0.16)",
    text: "#E5F2EE",
    tagBg: "rgba(255, 255, 255, 0.06)",
    tagBorder: "rgba(255, 255, 255, 0.10)",
    tagText: "#B6ECE2",
  },
  {
    colors: ["#241D18", "#120F0C"],
    accent: "#E8BF88",
    accentSoft: "rgba(232, 191, 136, 0.15)",
    text: "#F2E9DD",
    tagBg: "rgba(255, 255, 255, 0.06)",
    tagBorder: "rgba(255, 255, 255, 0.10)",
    tagText: "#F0D7B1",
  },
  {
    colors: ["#221E29", "#131118"],
    accent: "#C8B4F3",
    accentSoft: "rgba(200, 180, 243, 0.16)",
    text: "#ECE7FB",
    tagBg: "rgba(255, 255, 255, 0.06)",
    tagBorder: "rgba(255, 255, 255, 0.10)",
    tagText: "#DDD0FB",
  },
];

export const BREATH_RECOMMENDATIONS: BreathRecommendation[] = BREATH_PATTERNS.map(
  (pattern, index) => ({
    id: pattern.id,
    tone: pattern.tone,
    title: BREATH_RECOMMENDATION_TITLES[pattern.id] ?? pattern.title,
    subtitle: pattern.description,
    mantra: BREATH_RECOMMENDATION_MANTRAS[pattern.id] ?? pattern.benefit,
    tag: formatBreathToneLabel(pattern.tone),
    palette:
      BREATH_RECOMMENDATION_PALETTES[index % BREATH_RECOMMENDATION_PALETTES.length],
    icon:
      BREATH_RECOMMENDATION_ICONS[pattern.id] ??
      (pattern.tone === "sleep" ? "moon-waning-crescent" : "weather-windy"),
  })
);

export const BREATH_RECOMMENDATION_LOOKUP = Object.fromEntries(
  BREATH_RECOMMENDATIONS.map((item) => [item.id, item])
) as Record<string, BreathRecommendation>;

export const getBreathRecommendationById = (id: string) =>
  BREATH_RECOMMENDATION_LOOKUP[id] ?? BREATH_RECOMMENDATIONS[0];

export const getBreathRecommendationPaletteById = (id: string) =>
  getBreathRecommendationById(id).palette;

const BREATH_CONTEXT_COPY: Record<BreathPattern["tone"], string> = {
  grounding:
    "Use this when attention is scattered or the day feels too wide. The square count gives the body a clean edge to return to.",
  steady:
    "Use this when you want your pace to feel even before focus, writing, or a clear conversation.",
  release:
    "Use this when tension is parked in the jaw, chest, or shoulders and you want the exhale to carry more of the release.",
  sleep:
    "Use this in the evening when the room should soften and the nervous system can start handing the work back.",
};

const BREATH_STEPS_COPY: Record<string, string[]> = {
  "box-breath": [
    "Settle into a tall, comfortable seat and let both feet find the floor.",
    "Follow the 4-4-4-4 cadence: inhale, hold, exhale, and hold with equal count.",
    "Repeat for 4 to 6 rounds, keeping the rhythm even rather than forceful.",
    "Finish with one longer exhale and notice how the room feels more organized.",
  ],
  "coherent-breath": [
    "Sit upright with the ribs free so the breath can move without effort.",
    "Inhale for 5 and exhale for 5, letting both sides feel balanced.",
    "Continue for 5 to 8 rounds and keep the count quiet and smooth.",
    "Let the breath return to a natural pace and hold the steadier mood you created.",
  ],
  "release-breath": [
    "Unclench the jaw, soften the shoulders, and give the chest a little room.",
    "Inhale for 4 and exhale for 6, allowing the longer out-breath to do the heavy lifting.",
    "Repeat for 6 to 8 rounds and keep the exhale smooth rather than pushed.",
    "End with two easy breaths and notice where the body has already loosened.",
  ],
  "sleep-breath": [
    "Dim the lights or settle into a position that feels supported and safe.",
    "Inhale for 4, hold for 2, exhale for 6, and hold for 2 with a gentle count.",
    "Repeat for 6 to 8 rounds and let the rhythm get quieter as you continue.",
    "Let the final exhale fade and stay with the stillness for a moment.",
  ],
};

const BREATH_BENEFITS_COPY: Record<string, string[]> = {
  "box-breath": [
    "Reorients attention when the mind feels pulled in too many directions.",
    "Creates a clean reset you can repeat quickly before the next task.",
    "Helps the body feel organized without needing extra effort.",
  ],
  "coherent-breath": [
    "Builds a measured internal tempo that feels calm and deliberate.",
    "Supports focus for work, reading, or planning sessions.",
    "Gives the nervous system a simple beat to follow.",
  ],
  "release-breath": [
    "Softens held tension in the chest, jaw, and shoulders.",
    "Lets the exhale carry more of the calming work.",
    "Creates a cleaner downshift after a demanding stretch of the day.",
  ],
  "sleep-breath": [
    "Slows the evening without asking for a full meditation practice.",
    "Signals that the day can start letting go.",
    "Supports a quieter transition toward rest.",
  ],
};

const BREATH_TIPS_COPY: Record<string, string[]> = {
  "box-breath": [
    "Keep the gaze soft so the count stays steady.",
    "If a hold feels tense, shorten it before forcing the cadence.",
    "Practice with your back supported if you want more physical stability.",
  ],
  "coherent-breath": [
    "Count silently if the room is noisy or distracting.",
    "Relax the forehead so the rhythm stays light.",
    "Return to the same pace after every interruption.",
  ],
  "release-breath": [
    "Let the air leave naturally instead of pushing it out.",
    "Pair the practice with a shoulder roll between rounds.",
    "If the exhale feels shaky, ease the pace before increasing the count.",
  ],
  "sleep-breath": [
    "Only hold the breath if it feels comfortable in the body.",
    "Practice lying down or sitting on the bed when you want a softer landing.",
    "Let the count get quieter as the practice comes to an end.",
  ],
};

const buildBreathSteps = (pattern: BreathPattern) =>
  BREATH_STEPS_COPY[pattern.id] ?? [
    "Settle into a comfortable seat and let the body land before you begin.",
    `Follow the ${formatBreathCadence(pattern)} cadence with a smooth count.`,
    "Repeat for several rounds and keep the transitions calm and unforced.",
    "Finish with a quiet breath and notice the shift in pace.",
  ];

const buildBreathBenefits = (pattern: BreathPattern) =>
  BREATH_BENEFITS_COPY[pattern.id]
    ? [pattern.benefit, ...BREATH_BENEFITS_COPY[pattern.id].slice(0, 2)]
    : [
        pattern.benefit,
        "Creates a repeatable reset that is easy to return to later.",
        "Helps the body remember a steadier pace.",
      ];

const buildBreathTips = (pattern: BreathPattern) =>
  BREATH_TIPS_COPY[pattern.id] ?? [
    "Keep the count gentle and consistent.",
    "Return to the breath if your attention drifts.",
    "Stop if any part of the practice feels strained.",
  ];

export const BREATH_WORK_DETAILS: BreathWorkDetail[] = BREATH_PATTERNS.map(
  (pattern, index) => {
    const recommendation = BREATH_RECOMMENDATIONS[index] ?? getBreathRecommendationById(pattern.id);

    return {
      id: pattern.id,
      title: recommendation.title,
      subtitle: recommendation.subtitle,
      description: pattern.description,
      context: BREATH_CONTEXT_COPY[pattern.tone],
      steps: buildBreathSteps(pattern),
      benefits: buildBreathBenefits(pattern),
      tips: buildBreathTips(pattern),
      image: BREATH_WORK_HERO_IMAGE,
      tone: pattern.tone,
      toneLabel: formatBreathToneLabel(pattern.tone),
      tag: recommendation.tag,
      mantra: recommendation.mantra,
      palette: recommendation.palette,
      icon: recommendation.icon,
    };
  }
);

export const BREATH_WORK_DETAIL_LOOKUP = Object.fromEntries(
  BREATH_WORK_DETAILS.map((item) => [item.id, item])
) as Record<string, BreathWorkDetail>;

export const getBreathWorkDetailById = (id: string) =>
  BREATH_WORK_DETAIL_LOOKUP[id] ?? BREATH_WORK_DETAILS[0];
