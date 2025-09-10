import { SvgProps } from "react-native-svg";

import ArticleIcon from "../../assets/images/buttonLogo/tool/article.svg";
import BodyShapeIcon from "../../assets/images/buttonLogo/tool/bodyShape.svg";
import CalorieIcon from "../../assets/images/buttonLogo/tool/kcal.svg";
import MoodIcon from "../../assets/images/buttonLogo/tool/mood.svg";
import ProteinIntakeIcon from "../../assets/images/buttonLogo/tool/protein.svg";
import RecipeIcon from "../../assets/images/buttonLogo/tool/recipe.svg";
import RoutineIcon from "../../assets/images/buttonLogo/tool/routine.svg";
import TherapyIcon from "../../assets/images/buttonLogo/tool/therapy.svg";

export type NavigationButtonType = {
  id: number | string;
  label: string;
  action: string;
  screen: any;
  icon: React.FC<SvgProps>;
};

export const buttons: NavigationButtonType[] = [
  {
    id: 1,
    label: "Routine",
    action: "navigate",
    screen: "/(auth)/Tools/Routine/Routine",
    icon: RoutineIcon,
  },
  // {
  //   id: 2,
  //   label: "Mood Tracker",
  //   action: "modal",
  //   screen: "moodTracker",
  //   icon: MoodIcon,
  // },
  {
    id: 2,
    label: "Recipe",
    action: "navigate",
    screen: "/(auth)/Tools/Recipe/Recipe",
    icon: RecipeIcon,
  },
  {
    id: 3,
    label: "Article",
    action: "navigate",
    screen: "/(auth)/Tools/Article/Article",
    icon: ArticleIcon,
  },
  {
    id: 4,
    label: "Calorie Cal",
    action: "navigate",
    screen: "/(auth)/Tools/CalorieCal/CalorieCalculator",
    icon: CalorieIcon,
  },
  {
    id: 5,
    label: "Protein Cal",
    action: "navigate",
    screen: "/(auth)/Tools/ProtienCal/ProteinCalculator",
    icon: ProteinIntakeIcon,
  },
  {
    id: 6,
    label: "Body Shape Cal",
    action: "navigate",
    screen: "/(auth)/Tools/BodyShapeCal/BodyShapeCalculator",
    icon: BodyShapeIcon,
  },
  {
    id: 7,
    label: "Therapy",
    action: "navigate",
    screen: "/(auth)/Tools/AIScanner/AIScanner",
    icon: TherapyIcon,
  },
  {
    id: 8,
    label: "Products",
    action: "navigate",
    screen: "/(auth)/Tools/AIScanner/AIScanner",
    icon: TherapyIcon,
  },
  {
    id: 9,
    label: "Ask Nimbus",
    action: "navigate",
    screen: "/(auth)/Tools/AIScanner/AIScanner",
    icon: TherapyIcon,
  },
];
