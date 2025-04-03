export interface TrackType {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: any; // Replace with actual image
  source: any; // Replace with actual audio file
  category: string;
  isLocked: boolean;
  color: {
    cardColor: string;
    descriptionColor: string;
  };
}

const audioTracks: TrackType[] = [
  {
    id: "1",
    title: "Rainstorm",
    duration: "61 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/thunder.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/rainAndThunder.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "2",
    title: "Calm",
    duration: "23 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/calmMeditation.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/Calm.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "3",
    title: "Change & Spiritial Growth",
    duration: "30 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/growth.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/changeAndSpiritualGrowth.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "4",
    title: "Sea Waves",
    duration: "2 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/waves.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/seaWaves.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "5",
    title: "Emotional Healing",
    duration: "1 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/peace.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/emotionRelease.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "6",
    title: "Guilt Release & Healing Therapy",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    duration: "3 min",
    image: require("../../assets/images/soundscape/mindfulness.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/Guilt.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "7",
    title: "New Beginning Healing Sound",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    duration: "1 min",
    image: require("../../assets/images/soundscape/soundHealingCalm.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/healingNewBeginning.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "8",
    title: "333Hz Healing Sound",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    duration: "23 min",
    image: require("../../assets/images/soundscape/soundHealing.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/healingSound333Hz.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    // need to check
    id: "9",
    title: "639Hz Healing Sound",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    duration: "30 min",
    image: require("../../assets/images/soundscape/zen.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/healingSound333Hz.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "10",
    title: "Sea Waves",
    duration: "2 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/meditate.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/hopeful.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "11",
    title: "Light Rain",
    duration: "1 min",
    image: require("../../assets/images/soundscape/lightRain.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/hopeful.mp3"), // Replace with actual audio file
    category: "All",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "12",
    title: "Love & Spiritual Growth",
    duration: "3 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/mindfulness.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/loveAndSpiritualGrowth.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "13",
    title: "Medium Rain",
    duration: "1 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/thunder.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/mediumRain.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "14",
    title: "Pain And DNA Healing",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    duration: "2 min",
    image: require("../../assets/images/soundscape/repair.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/painAndDNArepair.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "15",
    title: "Rain And Thunder",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    duration: "1 min",
    image: require("../../assets/images/soundscape/thunder.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/rainAndThunder.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  {
    id: "16",
    title: "Seagul",
    duration: "3 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../assets/images/soundscape/bird.png"), // Replace with actual image
    source: require("../../assets/audio/soundscape/seagulls.mp3"), // Replace with actual audio file
    category: "All",
    isLocked: true,
    color: {
      cardColor: "#B5A8D5",
      descriptionColor: "#7A73D1",
    },
  },
  // {
  //   id: "17",
  //   title: "Tissue Healing And Self Expression",
  //   description:
  //     "Feeling unconditional love and acceptance towards yourself and the world",
  //   duration: "1 min",
  //   image: require("../../assets/images/soundscape/namaskar.png"), // Replace with actual image
  //   source: require("../../assets/audio/soundscape/tissueHealingAndSelfExpression.mp3"), // Replace with actual audio file
  //   category: "All",
  //   isLocked: true,
  //   color: {
  //     cardColor: "#B5A8D5",
  //     descriptionColor: "#7A73D1",
  //   },
  // },
];

export default audioTracks;
