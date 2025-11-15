import { NotificationType } from "@/types/notificationType";

export const NOTIFICATION_TYPES: NotificationType[] = [
  {
    key: "morning_review",
    id: "morning",
    label: "Morning check-in",
    desc: "Start your day with a quick reflection.",
  },
  {
    key: "night_review",
    id: "nightly",
    label: "Nightly review",
    desc: "Wind down and review today.",
  },
  {
    key: "mood_logger",
    id: "mood",
    label: "Log your mood",
    desc: "Capture how you feel.",
  },
  {
    key: "streak_saver",
    id: "streak",
    label: "Streak saver",
    desc: "Save your streak if you’re about to lose it.",
  },
];
