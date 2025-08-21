export interface TrackType {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: any; // Replace with actual image
  source: any; // Replace with actual audio file
  category: string;
  isLocked: boolean;
  // color: {
  //   cardColor: string;
  //   descriptionColor: string;
  // };
}

export const forYouTracks: TrackType[] = [
  {
    id: "1",
    title: "Rainstorm",
    duration: "61 min",
    image: require("../../assets/images/mentalTest/childhoodTrauma.png"), // Replace with actual image
    source: require("../../assets/dump/lightRain.mp3"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    category: "All",
    isLocked: true,
    // color: {
    //   cardColor: "#B5A8D5",
    //   descriptionColor: "#7A73D1",
    // },
  },
  {
    id: "16",
    title: "Seagul",
    duration: "3 min",
    image: require("../../assets/images/mentalTest/childhoodTrauma.png"), // Replace with actual image
    source: require("../../assets/dump/lightRain.mp3"), // Replace with actual audio file
    category: "All",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    isLocked: true,
    // color: {
    //   cardColor: "#C1D8C3",
    //   descriptionColor: "#6A9C89",
    // },
  },
];
