import type { WorkoutGuideLevel } from "@/features/self-care/utils/workoutGuide";

export const WORKOUT_SESSION_WORK_DURATION_SECONDS = 60;
export const WORKOUT_SESSION_BREAK_DURATION_SECONDS = 30;

export interface WorkoutSessionLevelContent {
  reps: number;
  description: string;
  tip: string;
}

const WORKOUT_SESSION_LEVELS: Record<WorkoutGuideLevel, WorkoutSessionLevelContent> =
  {
    easy: {
      reps: 1,
      description: "Settle into the shape and move with quiet control.",
      tip: "Keep the neck long and exhale softly through the effort.",
    },
    medium: {
      reps: 2,
      description: "Add a deeper range while keeping the frame calm.",
      tip: "Brace lightly before you descend and stay stacked through the center.",
    },
    hard: {
      reps: 3,
      description: "Commit to a tighter line with steady precision.",
      tip: "Move slowly, keep the ribs contained, and finish tall.",
    },
  };

export const getWorkoutSessionLevelContent = (
  level: WorkoutGuideLevel
): WorkoutSessionLevelContent => WORKOUT_SESSION_LEVELS[level];

