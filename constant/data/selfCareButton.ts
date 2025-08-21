import { SvgProps } from "react-native-svg";

import MedicalTestIcon from "../../assets/images/buttonLogo/selfcare/test.svg";
import WorkoutIcon from "../../assets/images/buttonLogo/selfcare/fitness.svg";
import WaterIntakeIcon from "../../assets/images/buttonLogo/selfcare/drink.svg";
import JournalingIcon from "../../assets/images/buttonLogo/selfcare/journaling.svg";
import MeditationIcon from "../../assets/images/buttonLogo/selfcare/meditation.svg";
import SleepIcon from "../../assets/images/buttonLogo/selfcare/sleep.svg";
import SoundscapeIcon from "../../assets/images/buttonLogo/selfcare/soundscape.svg";
import ThingsToDoIcon from "../../assets/images/buttonLogo/selfcare/things.svg";

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
    label: "Test",
    action: "navigate",
    screen: "/(auth)/SelfCare/test",
    icon: MedicalTestIcon,
  },
  {
    id: 2,
    label: "Drink",
    action: "navigate",
    screen: "/(auth)/SelfCare/WaterIntake/WaterIntake",
    icon: WaterIntakeIcon,
  },
  {
    id: 3,
    label: "Meditation",
    action: "navigate",
    screen: "/(auth)/SelfCare/Meditation/Meditation",
    icon: MeditationIcon,
  },
  {
    id: 4,
    label: "Workout",
    action: "navigate",
    screen: "/(auth)/SelfCare/Workout/Workout",
    icon: WorkoutIcon,
  },
  {
    id: 5,
    label: "Soundscape",
    action: "navigate",
    screen: "/(auth)/SelfCare/Soundscape/Soundscape",
    icon: SoundscapeIcon,
  },
  {
    id: 6,
    label: "Reflection",
    action: "navigate",
    screen: "/(auth)/SelfCare/Reflections/Reflection",
    icon: JournalingIcon,
  },
  {
    id: 7,
    label: "Sleep",
    action: "modal",
    screen: "Sleep",
    icon: SleepIcon,
  },
  {
    id: 8,
    label: "Things To Do",
    action: "modal",
    screen: "thingsToDo",
    icon: ThingsToDoIcon,
  },
];
