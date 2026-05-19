import {
  getWorkoutGuideLevelContent,
  mockWorkoutGuideLevels,
} from "../workoutGuide";

describe("workoutGuide", () => {
  it("returns the easy guide content", () => {
    const easy = getWorkoutGuideLevelContent("easy");

    expect(easy.summary).toContain("Foundational bodyweight control");
    expect(easy.slides).toHaveLength(7);
    expect(easy.slides[0].id).toBe("easy-1");
    expect(easy.slides[6].id).toBe("easy-7");
  });

  it("exposes all level variants", () => {
    expect(Object.keys(mockWorkoutGuideLevels)).toEqual([
      "easy",
      "medium",
      "hard",
    ]);
  });
});
