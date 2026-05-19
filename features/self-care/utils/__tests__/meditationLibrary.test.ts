import {
  buildMeditationFilterOptions,
  filterMeditationTemplates,
  mapMeditationTemplate,
  mockMeditationRecommendations,
} from "../meditationLibrary";

describe("meditationLibrary", () => {
  it("maps raw meditation items into premium template data", () => {
    const template = mapMeditationTemplate(
      {
        id: 19,
        title: "Moon Breath",
        description: "Slow the inhale and exhale until the room softens.",
        category: "breathwork",
        duration: 6,
        source: "https://example.com/moon-breath.mp3",
      },
      0
    );

    expect(template.id).toBe("19");
    expect(template.title).toBe("Moon Breath");
    expect(template.durationLabel).toBe("6 min");
    expect(template.tags).toContain("breath");
    expect(template.source).toBe("https://example.com/moon-breath.mp3");
  });

  it("builds unique filters and filters templates by tag", () => {
    const options = buildMeditationFilterOptions(mockMeditationRecommendations);

    expect(options[0]).toEqual({ label: "All Modes", value: "all" });
    expect(options.some((option) => option.value === "sleep")).toBe(true);

    const visible = filterMeditationTemplates(
      mockMeditationRecommendations,
      "sleep"
    );

    expect(visible).toHaveLength(1);
    expect(visible[0].title).toBe("Sleep Drift");
  });
});
