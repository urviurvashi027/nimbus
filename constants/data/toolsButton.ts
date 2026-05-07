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
  {
    id: 1,
    label: "Rituals",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_ROUTINE_TEMPLATE,
    iconName: "calendar-check",
  },
  //done
  {
    id: 2,
    label: "Nourish",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_RECIPE,
    iconName: "silverware-fork-knife",
  },
  //done
  {
    id: 3,
    label: "Nourish Plan",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_MEAL_PLANNER,
    iconName: "calendar-heart",
  },
  //done
  {
    id: 4,
    label: "Insights",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_ARTICLE_LIST,
    iconName: "newspaper-variant-outline",
  },
  {
    id: 5,
    label: "Energy",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_CALORIE_CALC,
    iconName: "fire",
  },
  {
    id: 6,
    label: "Fuel",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_PROTEIN_CALC,
    iconName: "food-steak",
  },
  {
    id: 7,
    label: "Vitals",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_BODY_SHAPE_CALC,
    iconName: "tape-measure",
  },
  // done
  {
    id: 8,
    label: "Scribble",
    action: "navigate",
    screen: ROUTES.AUTH.TOOLS_SCRIBBLE_LIST,
    iconName: "pencil-outline",
  },
  // {
  //   id: 8,
  //   label: "Mindset",
  //   action: "navigate",
  //   screen: ROUTES.AUTH.TOOLS_AI_THERAPY,
  //   iconName: "head-heart-outline",
  // },
];
