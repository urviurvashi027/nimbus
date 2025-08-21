// import s from "../../assets/images"

export const routineDetails = [
  {
    id: "1",
    actionButton: "Add to routine",
    title: "routine 1",
    image: require("../../assets/images/mentalTest/childhoodTrauma.png"),
    metaInfo: {
      points: 4,
      time: "4 min",
    },
    authorInfo: {
      name: "Alex Tyler",
      role: "PhD, Developmental Psychology",
      avatar: "https://example.com/avatar.jpg",
    },
    sectionData: [
      {
        title: "Benefit",
        content:
          "Creating a routine helps kids understand expectations and reduces morning chaos.",
      },
      {
        title: "Preparation",
        content:
          "Explain the routine clearly and ensure your child knows what to expect.",
      },
      {
        title: "Nutrition",
        content:
          "Do a trial run of the routine before the first day of school.",
      },
    ],
  },
  {
    id: "2",
    title: "routine 2",
    image: require("../../assets/images/mentalTest/childhoodTrauma.png"),
    metaInfo: {
      points: 4,
      time: "4 min",
    },
    authorInfo: {
      name: "Alex Tyler",
      role: "PhD, Developmental Psychology",
      avatar: "https://example.com/avatar.jpg",
    },
    sectionData: [
      {
        title: "Benefit",
        content:
          "Creating a routine helps kids understand expectations and reduces morning chaos.",
      },
      {
        title: "Preparation",
        content:
          "Explain the routine clearly and ensure your child knows what to expect.",
      },
      {
        title: "Nutrition",
        content:
          "Do a trial run of the routine before the first day of school.",
      },
    ],
  },
  {
    id: "3",
    title: "Routine 3",
    image: require("../../assets/images/mentalTest/childhoodTrauma.png"),
    metaInfo: {
      points: 4,
      time: "4 min",
    },
    authorInfo: {
      name: "Alex Tyler",
      role: "PhD, Developmental Psychology",
      avatar: "https://example.com/avatar.jpg",
    },
    sectionData: [
      {
        title: "Benefit",
        content:
          "Creating a routine helps kids understand expectations and reduces morning chaos.",
      },
      {
        title: "Preparation",
        content:
          "Explain the routine clearly and ensure your child knows what to expect.",
      },
      {
        title: "Nutrition",
        content:
          "Do a trial run of the routine before the first day of school.",
      },
    ],
  },
];

export type RoutineType = {
  id: string;
  image: string;
};

export const RoutineData: RoutineType[] = [
  {
    id: "1",
    // title: "Restart your life in 50 days!",
    image: require("../../assets/images/routine/1.png"), // make sure these match your design
  },
  {
    id: "2",
    // title: "Less Awkward First Date Tricks",
    image: require("../../assets/images/routine/2.png"),
  },
  {
    id: "3",
    // title: "Restart your life in 50 days!",
    image: require("../../assets/images/routine/3.png"), // make sure these match your design
  },
  {
    id: "4",
    // title: "Less Awkward First Date Tricks",
    image: require("../../assets/images/routine/4.png"),
  },
  {
    id: "5",
    // title: "Restart your life in 50 days!",
    image: require("../../assets/images/routine/5.png"), // make sure these match your design
  },
  {
    id: "6",
    // title: "Less Awkward First Date Tricks",
    image: require("../../assets/images/routine/6.png"),
  },
  {
    id: "7",
    // title: "Restart your life in 50 days!",
    image: require("../../assets/images/routine/7.png"), // make sure these match your design
  },
  {
    id: "8",
    // title: "Less Awkward First Date Tricks",
    image: require("../../assets/images/routine/8.png"),
  },
  {
    id: "9",
    // title: "Restart your life in 50 days!",
    image: require("../../assets/images/routine/9.png"), // make sure these match your design
  },
];
