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
    label: "Routine",
    action: "navigate",
    screen: "/(auth)/toolsScreen/RoutineScreen",
    iconName: "calendar-check", // perfect for routine
  },
  {
    id: 2,
    label: "Recipe",
    action: "navigate",
    screen: "/(auth)/toolsScreen/RecipeScreen",
    iconName: "silverware-fork-knife", // clear recipe/cooking icon
  },
  {
    id: 3,
    label: "Article",
    action: "navigate",
    screen: "/(auth)/toolsScreen/ArticleScreen",
    iconName: "newspaper-variant-outline", // article/news-style
  },
  {
    id: 4,
    label: "Calorie Cal",
    action: "navigate",
    screen: "/(auth)/toolsScreen/CalorieCalculatorScreen",
    iconName: "fire", // calorie-burning icon
  },
  {
    id: 5,
    label: "Protein Cal",
    action: "navigate",
    screen: "/(auth)/toolsScreen/ProteinCalculatorScreen",
    iconName: "food-steak", // protein-rich food
  },
  {
    id: 6,
    label: "Bodyshape",
    action: "navigate",
    screen: "/(auth)/toolsScreen/BodyShapeCalculatorScreen",
    iconName: "tape-measure", // body measurement
  },
  {
    id: 7,
    label: "Therapy",
    action: "navigate",
    screen: "/(auth)/toolsScreen/AItherapyScreen",
    iconName: "head-heart-outline", // therapy / mental wellbeing
  },
  {
    id: 8,
    label: "Products",
    action: "navigate",
    screen: "/(auth)/toolsScreen/ProductListScreen",
    iconName: "shopping-outline", // products/shop icon
  },
  {
    id: 9,
    label: "Ask Nimbus",
    action: "navigate",
    screen: "/(auth)/CoachScreen/CoachScreen",
    iconName: "chat-processing-outline", // AI chat assistant
  },
];
