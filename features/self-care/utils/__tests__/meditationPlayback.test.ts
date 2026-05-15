import {
  formatPlaybackRemaining,
  formatPlaybackTime,
  seekMillis,
} from "../meditationPlayback";

describe("meditationPlayback", () => {
  it("formats playback time and remaining time", () => {
    expect(formatPlaybackTime(0)).toBe("00:00");
    expect(formatPlaybackTime(61000)).toBe("01:01");
    expect(formatPlaybackRemaining(61000, 180000)).toBe("-01:59");
  });

  it("clamps seek positions within the playback window", () => {
    expect(seekMillis(30000, -15000, 180000)).toBe(15000);
    expect(seekMillis(179900, 15000, 180000)).toBe(179500);
    expect(seekMillis(0, -15000, 180000)).toBe(0);
  });
});
