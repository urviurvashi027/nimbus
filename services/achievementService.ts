// services/achievementsApi.ts
export type AchievementDTO = {
  id: string;
  icon: string; // Ionicons name
  value: string | number;
  label: string;
};

export type BadgeDTO = {
  id: string;
  icon: string; // Ionicons name
  color: string;
  unlocked: boolean;
  title?: string;
};

export type AchievementsResponse = {
  achievements: AchievementDTO[];
  badges: BadgeDTO[];
};

// Simulate network latency + data
export async function fetchAchievements(
  signal?: AbortSignal
): Promise<AchievementsResponse> {
  // simulate latency 700–1100ms
  const delay = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      const id = setTimeout(resolve, ms);
      signal?.addEventListener("abort", () => {
        clearTimeout(id);
        reject(Object.assign(new Error("aborted"), { name: "AbortError" }));
      });
    });

  await delay(900);

  // mock data
  return {
    achievements: [
      { id: "quiz", icon: "grid", value: 150, label: "Quizzie" },
      {
        id: "points",
        icon: "diamond",
        value: "10,569",
        label: "Monthly Points",
      },
      { id: "pass", icon: "flame", value: 124, label: "Quiz Passed" },
      { id: "top3", icon: "ribbon", value: 38, label: "Top 3 Positions" },
      { id: "chall", icon: "bullseye", value: 210, label: "Challenge Passed" },
      { id: "fast", icon: "alarm", value: 72, label: "Faster Record" },
    ],
    badges: [
      {
        id: "b1",
        icon: "time",
        color: "#4FD1C5",
        unlocked: true,
        title: "Consistency",
      },
      {
        id: "b2",
        icon: "bar-chart",
        color: "#F6C34A",
        unlocked: true,
        title: "Streak 7d",
      },
      {
        id: "b3",
        icon: "happy",
        color: "#8FA8FF",
        unlocked: true,
        title: "Mindful",
      },
      {
        id: "b4",
        icon: "star",
        color: "#F49CA2",
        unlocked: true,
        title: "Starter",
      },
      {
        id: "b5",
        icon: "extension-puzzle",
        color: "#8B7CF6",
        unlocked: true,
        title: "Explorer",
      },
      {
        id: "b6",
        icon: "lock-closed",
        color: "#6B7280",
        unlocked: false,
        title: "Secret",
      },
    ],
  };
}

/** Swap to real API later:
export async function fetchAchievements(signal?: AbortSignal): Promise<AchievementsResponse> {
  const res = await fetch(`${API_BASE}/v1/achievements`, { signal, headers: { Authorization: `Bearer ${token}` }});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
*/
