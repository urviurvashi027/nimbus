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
    screen: "/(auth)/toolsScreen/RoutineScreen",
    iconName: "calendar-check",
  },
  {
    id: 2,
    label: "Nourish",
    action: "navigate",
    screen: "/(auth)/toolsScreen/RecipeScreen",
    iconName: "silverware-fork-knife",
  },
  {
    id: 3,
    label: "Insights",
    action: "navigate",
    screen: "/(auth)/toolsScreen/ArticleScreen",
    iconName: "newspaper-variant-outline",
  },
  {
    id: 4,
    label: "Energy",
    action: "navigate",
    screen: "/(auth)/toolsScreen/CalorieCalculatorScreen",
    iconName: "fire",
  },
  {
    id: 5,
    label: "Fuel",
    action: "navigate",
    screen: "/(auth)/toolsScreen/ProteinCalculatorScreen",
    iconName: "food-steak",
  },
  {
    id: 6,
    label: "Vitals",
    action: "navigate",
    screen: "/(auth)/toolsScreen/BodyShapeCalculatorScreen",
    iconName: "tape-measure",
  },
  {
    id: 7,
    label: "Mindset",
    action: "navigate",
    screen: "/(auth)/toolsScreen/AItherapyScreen",
    iconName: "head-heart-outline",
  },
  {
    id: 8,
    label: "Shop",
    action: "navigate",
    screen: "/(auth)/toolsScreen/ProductListScreen",
    iconName: "shopping-outline",
  },
  {
    id: 9,
    label: "Ask Nimbus",
    action: "navigate",
    screen: "/(auth)/CoachScreen/CoachScreen",
    iconName: "chat-processing-outline",
  },
  {
    id: 10,
    label: "Scribble",
    action: "navigate",
    screen: "/(auth)/toolsScreen/ScribbleListScreen",
    iconName: "pencil-outline",
  },
  {
    id: 11,
    label: "Nourish Plan",
    action: "navigate",
    screen: "/(auth)/toolsScreen/MealPlannerScreen",
    iconName: "calendar-heart",
  },
];
