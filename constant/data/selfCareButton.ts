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
    icon: require("../../assets/images/options/test.png"),
  },
  {
    id: 2,
    label: "Drink",
    action: "modal",
    screen: "waterIntake",
    icon: require("../../assets/images/options/drink.png"),
  },
  {
    id: 3,
    label: "Meditation",
    action: "navigate",
    screen: "/(auth)/SelfCare/Meditation/Meditation",
    icon: require("../../assets/images/options/meditation.png"),
  },
  {
    id: 4,
    label: "Workout",
    action: "navigate",
    screen: "/(auth)/SelfCare/Workout/Workout",
    icon: require("../../assets/images/options/fitness.png"),
  },
  {
    id: 5,
    label: "Soundscape",
    action: "navigate",
    screen: "/(auth)/SelfCare/Soundscape/Soundscape",
    icon: require("../../assets/images/options/soundscape.png"),
  },
  {
    id: 6,
    label: "Reflection",
    action: "navigate",
    screen: "/(auth)/SelfCare/Reflections/Reflection",
    icon: require("../../assets/images/options/reflection.png"),
  },
  {
    id: 7,
    label: "Sleep",
    action: "modal",
    screen: "Sleep",
    icon: require("../../assets/images/options/sleep.png"),
  },
  {
    id: 8,
    label: "Things To Do",
    action: "modal",
    screen: "thingsToDo",
    icon: require("../../assets/images/options/things.png"),
  },
];
