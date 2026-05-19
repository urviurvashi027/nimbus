import {
  AFFIRMATION_RECOMMENDATIONS,
  limitWords,
} from "../affirmationLibrary";

describe("affirmationLibrary", () => {
  it("keeps recommendation affirmations within the word limit", () => {
    expect(AFFIRMATION_RECOMMENDATIONS).toHaveLength(6);
    expect(AFFIRMATION_RECOMMENDATIONS[0].title).toBe("Quiet Ground");

    AFFIRMATION_RECOMMENDATIONS.forEach((item) => {
      expect(item.affirmation.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(
        20
      );
    });
  });

  it("trims long copy to the requested number of words", () => {
    const result = limitWords(
      "One two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty twenty one",
      20
    );

    expect(result.endsWith("…")).toBe(true);
    expect(result.split(/\s+/).filter(Boolean)).toHaveLength(20);
  });
});
