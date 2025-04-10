export type Meditations = {
  id: string;
  title: string;
  duration: string;
  description?: string;
  image: any; // Replace with actual image
  source: any; // Replace with actual audio
  category: string;
  isLocked: boolean;
};

export const meditationsList: Meditations[] = [
  {
    id: "1",
    title: "Accept Yourself",
    duration: "10 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/meditation/acceptYourself.png"), // Replace with actual image
    source: require("../../assets/audio/meditation.mp3"),
    category: "All",
    isLocked: false,
  },
  {
    id: "2",
    title: "Anxiety release",
    duration: "10 min",
    image: require("../../assets/images/meditation/anxietyRelease.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/lightRain.mp3"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    category: "Stress & Anxiety",
    isLocked: true,
  },
  {
    id: "3",
    title: "🧘 Find Inner Strength in 5 minutes.",
    duration: "5 min",
    image: require("../../assets/images/meditation/innerStrength.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/lightRain.mp3"),
    category: "Self-Care",
    isLocked: true,
  },
  {
    id: "4",
    title: "Deal with work stress",
    duration: "10 min",
    // image: require("./assets/work_stress.jpg"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/meditation/stress.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/lightRain.mp3"),
    category: "All",
    isLocked: true,
  },
];

export const recommendations = [
  {
    id: "1",
    title: "Deal with work stress",
    duration: "10 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/meditation/stress.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/lightRain.mp3"),
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "3",
    title: "🧘 Find Inner Strength in 5 minutes.",
    duration: "5 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/meditation/innerStrength.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/lightRain.mp3"),
    category: "Self-Care",
    isLocked: true,
    color: {
      cardColor: "#C1D8C3",
      descriptionColor: "#6A9C89",
    },
  },
];
