import {
  getWorkoutSessionLevelContent,
  WORKOUT_SESSION_BREAK_DURATION_SECONDS,
  WORKOUT_SESSION_WORK_DURATION_SECONDS,
} from "../workoutSession";

describe("workoutSession", () => {
  it("exposes the fixed session durations", () => {
    expect(WORKOUT_SESSION_WORK_DURATION_SECONDS).toBe(60);
    expect(WORKOUT_SESSION_BREAK_DURATION_SECONDS).toBe(30);
  });

  it("returns level-specific guidance content", () => {
    const hard = getWorkoutSessionLevelContent("hard");

    expect(hard.reps).toBe(3);
    expect(hard.description).toContain("precision");
    expect(hard.tip).toContain("ribs");
  });
});
