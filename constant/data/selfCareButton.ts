import { MaterialCommunityIcons } from "@expo/vector-icons";

export type NavigationButtonType = {
  id: number | string;
  label: string;
  action: string;
  screen: any;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
};

export const buttons: NavigationButtonType[] = [
  {
    id: 1,
    label: "Test",
    action: "navigate",
    // screen: "/(auth)/selfCareScreen/test",

    screen: "/(auth)/selfCareScreen/MentalHealthTestScreen",
    iconName: "clipboard-text-outline",
  },
  {
    id: 2,
    label: "Meditation",
    action: "navigate",
    screen: "/(auth)/selfCareScreen/MeditationScreen",
    iconName: "meditation",
  },
  {
    id: 3,
    label: "Workout",
    action: "navigate",
    screen: "/(auth)/selfCareScreen/WorkoutScreen",
    iconName: "dumbbell",
  },
  {
    id: 4,
    label: "Soundscape",
    action: "navigate",
    screen: "/(auth)/selfCareScreen/SoundscapeScreen",
    iconName: "music-circle-outline",
  },
  {
    id: 5,
    label: "Reflection",
    action: "navigate",
    screen: "/(auth)/selfCareScreen/ReflectionScreen",
    iconName: "book-open-variant",
  },
  {
    id: 6,
    label: "Sleep",
    action: "modal",
    screen: "Sleep",
    iconName: "weather-night",
  },
  {
    id: 7,
    label: "Things To Do",
    action: "modal",
    screen: "thingsToDo",
    iconName: "check-circle-outline",
  },
];
