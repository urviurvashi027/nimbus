import type { CoachData } from "@/components/coach/types";

export async function fetchCoachData(): Promise<CoachData> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 700));

  return {
    insight:
      "You usually skip habits on Mondays. Want to make them lighter that day?",
    topics: [
      { id: "t1", title: "Consistency tips", icon: "arrow-redo-outline" },
      { id: "t2", title: "Habit stacking", icon: "link-outline" },
      {
        id: "t3",
        title: "Identity-based habits",
        icon: "sparkles-outline" as any,
      },
      { id: "t4", title: "Morning routines", icon: "sunny-outline" },
    ],
    advice: [
      { id: "a1", title: "What should I focus on today?" },
      { id: "a2", title: "Give me motivation" },
      { id: "a3", title: "Suggest 1 new habit" },
    ],
  };
}
