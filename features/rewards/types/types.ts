// Shared types

export type Achievement = {
  id: string;
  icon: string; // Ionicons name, e.g. "flame", "alarm"
  value: string | number;
  label: string;
};

export type Badge = {
  id: string;
  icon: string; // Ionicons name
  color: string; // primary badge color
  unlocked: boolean;
  title?: string;
};

export type ScreenProps = {
  title?: string;
  onBack?: () => void;
  achievements?: Achievement[];
  badges?: Badge[];
};
