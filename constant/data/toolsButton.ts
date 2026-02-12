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
    label: "Rituals",
    action: "navigate",
    screen: "/(auth)/tools/routineTemplate",
    iconName: "calendar-check",
  },
  {
    id: 2,
    label: "Nourish",
    action: "navigate",
    screen: "/(auth)/tools/recipe",
    iconName: "silverware-fork-knife",
  },
  {
    id: 3,
    label: "Insights",
    action: "navigate",
    screen: "/(auth)/tools/articleList",
    iconName: "newspaper-variant-outline",
  },
  {
    id: 4,
    label: "Energy",
    action: "navigate",
    screen: "/(auth)/tools/calorieCalculator",
    iconName: "fire",
  },
  {
    id: 5,
    label: "Fuel",
    action: "navigate",
    screen: "/(auth)/tools/proteinCalculator",
    iconName: "food-steak",
  },
  {
    id: 6,
    label: "Vitals",
    action: "navigate",
    screen: "/(auth)/tools/bodyShapeCalculator",
    iconName: "tape-measure",
  },
  {
    id: 7,
    label: "Mindset",
    action: "navigate",
    screen: "/(auth)/tools/AItherapy",
    iconName: "head-heart-outline",
  },
  {
    id: 8,
    label: "Shop",
    action: "navigate",
    screen: "/(auth)/tools/productList",
    iconName: "shopping-outline",
  },
  {
    id: 9,
    label: "Ask Nimbus",
    action: "navigate",
    screen: "/(auth)/coach/",
    iconName: "chat-processing-outline",
  },
  {
    id: 10,
    label: "Scribble",
    action: "navigate",
    screen: "/(auth)/tools/scribbleList",
    iconName: "pencil-outline",
  },
  {
    id: 11,
    label: "Nourish Plan",
    action: "navigate",
    screen: "/(auth)/tools/MealPlannerScreen",
    iconName: "calendar-heart",
  },
];
