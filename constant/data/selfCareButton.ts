import { MaterialCommunityIcons } from "@expo/vector-icons";

export type NavigationButtonType = {
  id: number | string;
  label: string;
  action: string;
  screen: any;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const buttons: NavigationButtonType[] = [
  // {
  //   id: 1,
  //   label: "Assess",
  //   action: "navigate",
  //   screen: "/(auth)/self-care/MentalHealthTestScreen",
  //   iconName: "clipboard-text-outline",
  // },
  {
    id: 2,
    label: "Zen",
    action: "navigate",
    screen: "/(auth)/self-care/meditation",
    iconName: "meditation",
  },
  {
    id: 3,
    label: "Move",
    action: "navigate",
    screen: "/(auth)/self-care/workout",
    iconName: "dumbbell",
  },
  {
    id: 4,
    label: "Sonic",
    action: "navigate",
    screen: "/(auth)/self-care/soundscape",
    iconName: "music-circle-outline",
  },
  {
    id: 5,
    label: "Reflect",
    action: "navigate",
    screen: "/(auth)/self-care/reflection",
    iconName: "book-open-variant",
  },
  {
    id: 6,
    label: "Rest",
    action: "modal",
    screen: "Sleep",
    iconName: "weather-night",
  },
  {
    id: 7,
    label: "Action",
    action: "modal",
    screen: "thingsToDo",
    iconName: "check-circle-outline",
  },
];
