export type Choice = {
  id: string;
  label: string;
  icon?: string; // optional emoji / icon
};

export type QuestionType = "single" | "multiple" | "time" | "signature" | "location";

export type Question = {
  id: number;
  title: string;
  subtitle: string;
  type: QuestionType;
  choices?: Choice[]; // only for single/multiple
};

export const ONBOARDING_QUESTIONS: Question[] = [
  {
    id: 1,
    title: "How long do you usually sleep at night? 😴",
    subtitle:
      "Understanding your sleep patterns helps us tailor your habit tracking experience.",
    type: "single",
    choices: [
      { id: "lt6", label: "Less than 6 hours", icon: "😪" },
      { id: "6-7", label: "6 - 7 hours", icon: "🙂" },
      { id: "7-8", label: "7 - 8 hours", icon: "😌" },
      { id: "8-9", label: "8 - 9 hours", icon: "😊" },
      { id: "gt9", label: "More than 9 hours", icon: "😁" },
    ],
  },
  {
    id: 2,
    title: "What time do you usually wake up? 🌞",
    subtitle:
      "Setting your wake-up time helps us create your personalized habit schedule.",
    type: "time",
  },
  {
    id: 3,
    title: "What time do you usually end your day? 🌙",
    subtitle:
      "Let us know when you typically end your day to optimize your habit tracking.",
    type: "time",
  },
  {
    id: 4,
    title: "Do you often procrastinate? 👀",
    subtitle:
      "Understanding your procrastination tendencies helps us tailor strategies to overcome them.",
    type: "single",
    choices: [
      { id: "always", label: "Always", icon: "😱" },
      { id: "sometimes", label: "Sometimes", icon: "😕" },
      { id: "rarely", label: "Rarely", icon: "😅" },
      { id: "never", label: "Never", icon: "😎" },
    ],
  },
  {
    id: 5,
    title: "Do you often find it hard to focus? 🎯",
    subtitle:
      "Let us know if focus is a struggle for you so we can provide targeted support.",
    type: "single",
    choices: [
      { id: "constantly", label: "Constantly", icon: "😭" },
      { id: "occasionally", label: "Occasionally", icon: "😕" },
      { id: "rarely", label: "Rarely", icon: "😅" },
      { id: "never", label: "Never", icon: "😁" },
    ],
  },
  {
    id: 6,
    title: "What influenced you to become organized? 🧘",
    subtitle:
      "Understanding your motivations helps us align Nimbus with your goals. Select all that apply.",
    type: "multiple",
    choices: [
      { id: "motivation", label: "Lack of Motivation", icon: "🎯" },
      { id: "work", label: "Work Overload", icon: "🔗" },
      { id: "clutter", label: "Cluttered Environment", icon: "🎭" },
      { id: "digital", label: "Digital Distractions", icon: "🎮" },
      { id: "time", label: "Lack of Time Management", icon: "⏳" },
    ],
  },
  {
    id: 7,
    title: "What do you want to achieve with Nimbus? 🎯",
    subtitle:
      "Your aspirations guide our efforts to support and empower you on your journey. Select all that apply.",
    type: "multiple",
    choices: [
      { id: "habits", label: "Build Healthy Habits", icon: "🎗️" },
      { id: "productivity", label: "Boost Productivity", icon: "🏅" },
      { id: "goals", label: "Achieve Personal Goals", icon: "🏆" },
      { id: "stress", label: "Manage Stress & Anxiety", icon: "😌" },
      { id: "other", label: "Other (Specify)", icon: "✨" },
    ],
  },
  {
    id: 9,
    title: "Where are you located? 🌍",
    subtitle: "We use your location to provide local insights and relevant suggestions.",
    type: "location",
  },
  {
    id: 8,
    title: "Let's make a contract ✍️",
    subtitle:
      "Sign your personalized commitment to achieving your goals with Nimbus.",
    type: "signature", // <- new type
  },
];
