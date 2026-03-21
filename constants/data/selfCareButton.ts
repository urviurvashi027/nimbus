import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ROUTES } from "../routes";

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
  //   screen: ROUTES.AUTH.SELF_CARE_MENTAL_TEST,
  //   iconName: "clipboard-text-outline",
  // },
  {
    id: 2,
    label: "Zen",
    action: "navigate",
    screen: ROUTES.AUTH.SELF_CARE_MEDITATION,
    iconName: "meditation",
  },
  {
    id: 3,
    label: "Move",
    action: "navigate",
    screen: ROUTES.AUTH.SELF_CARE_WORKOUT,
    iconName: "dumbbell",
  },
  {
    id: 4,
    label: "Sonic",
    action: "navigate",
    screen: ROUTES.AUTH.SELF_CARE_SOUNDSCAPE,
    iconName: "music-circle-outline",
  },
  {
    id: 5,
    label: "Reflect",
    action: "navigate",
    screen: ROUTES.AUTH.SELF_CARE_REFLECTION,
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
