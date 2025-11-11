export type Topic = {
  id: string;
  title: string;
  icon?: string; // Ionicons name (optional)
};

export type Advice = {
  id: string;
  title: string;
  subtitle?: string;
};

export type CoachData = {
  insight: string;
  topics: Topic[];
  advice: Advice[];
};
