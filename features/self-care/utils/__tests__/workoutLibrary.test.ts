import {
  filterWorkoutCards,
  mapWorkoutListItemToCardModel,
  mockWorkoutRecommendations,
} from "../workoutLibrary";

describe("workoutLibrary", () => {
  it("filters workout cards by category", () => {
    const cardio = filterWorkoutCards(mockWorkoutRecommendations, "cardio");

    expect(cardio).toHaveLength(2);
    expect(cardio.map((item) => item.title)).toEqual([
      "Bodyweight Blitz",
      "Heart Rate Hero",
    ]);
  });

  it("keeps all workout cards when the all filter is selected", () => {
    const all = filterWorkoutCards(mockWorkoutRecommendations, "all");

    expect(all).toHaveLength(4);
  });

  it("maps api workout items into the workout card model", () => {
    const mapped = mapWorkoutListItemToCardModel({
      id: 12,
      title: "Core Reset",
      image: "https://example.com/core.png",
      coach_name: "Ava",
      category: "strength",
      duration: 18,
      description: "A focused strength reset.",
      source: "source",
    });

    expect(mapped).toEqual({
      id: "12",
      title: "Core Reset",
      subtitle: "18 MIN · ADVANCED",
      category: "strength",
      image: "https://example.com/core.png",
    });
  });
});
