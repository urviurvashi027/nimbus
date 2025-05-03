export type NavigationButtonType = {
  id: number | string;
  label: string;
  action: string;
  screen: any;
  icon: any;
};

export const buttons: NavigationButtonType[] = [
  {
    id: 1,
    label: "Test",
    action: "navigate",
    screen: "/(auth)/SelfCare/test",
    icon: require("../../assets/images/buttonLogo/test.png"),
  },
  {
    id: 2,
    label: "Drink",
    // action: "modal",
    // screen: "Sleep",
    action: "navigate",
    screen: "/(auth)/SelfCare/WaterIntake/WaterIntake",
    icon: require("../../assets/images/buttonLogo/drink.png"),
  },
  {
    id: 3,
    label: "Meditation",
    action: "navigate",
    screen: "/(auth)/SelfCare/Meditation/Meditation",
    icon: require("../../assets/images/buttonLogo/meditation.png"),
  },
  {
    id: 4,
    label: "Workout",
    action: "navigate",
    screen: "/(auth)/SelfCare/Workout/Workout",
    icon: require("../../assets/images/buttonLogo/fitness.png"),
  },
  {
    id: 5,
    label: "Soundscape",
    action: "navigate",
    screen: "/(auth)/SelfCare/Soundscape/Soundscape",
    icon: require("../../assets/images/buttonLogo/soundscape.png"),
  },
  {
    id: 6,
    label: "Reflection",
    action: "navigate",
    screen: "/(auth)/SelfCare/Reflections/Reflection",
    icon: require("../../assets/images/buttonLogo/reflection.png"),
  },
  {
    id: 7,
    label: "Sleep",
    action: "modal",
    screen: "Sleep",
    icon: require("../../assets/images/buttonLogo/sleep.png"),
  },
  {
    id: 8,
    label: "Things To Do",
    action: "modal",
    screen: "thingsToDo",
    icon: require("../../assets/images/buttonLogo/things.png"),
  },
];
