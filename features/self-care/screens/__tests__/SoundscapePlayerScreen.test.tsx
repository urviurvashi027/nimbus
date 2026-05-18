import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { getTheme } from "../../../../theme";
import {
  resolveSoundscapePlaybackSource,
} from "../../utils/soundscapeLibrary";
import SoundscapePlayerScreen from "../SoundscapePlayerScreen";

const mockBack = jest.fn();
const mockSetOptions = jest.fn();
const mockSetAudioModeAsync = jest.fn();
const mockCreateAsync = jest.fn();

let mockParams = {
  soundscapeId: "528-dna-integrity",
};

let playbackStatusCallback: ((status: any) => void) | null = null;
const mockSound = {
  setVolumeAsync: jest.fn(async () => {
    return {
      isLoaded: true,
      isPlaying: true,
      positionMillis: 15000,
      durationMillis: 180000,
    };
  }),
  pauseAsync: jest.fn(async () => {
    playbackStatusCallback?.({
      isLoaded: true,
      isPlaying: false,
      positionMillis: 15000,
      durationMillis: 180000,
    });
  }),
  playAsync: jest.fn(async () => {
    playbackStatusCallback?.({
      isLoaded: true,
      isPlaying: true,
      positionMillis: 15000,
      durationMillis: 180000,
    });
  }),
  setPositionAsync: jest.fn(async (position: number) => {
    playbackStatusCallback?.({
      isLoaded: true,
      isPlaying: true,
      positionMillis: position,
      durationMillis: 180000,
    });
  }),
  stopAsync: jest.fn(async () => {
    playbackStatusCallback?.({
      isLoaded: true,
      isPlaying: false,
      positionMillis: 0,
      durationMillis: 180000,
    });
  }),
  unloadAsync: jest.fn(),
};

jest.mock("expo-router", () => ({
  router: {
    back: (...args: any[]) => mockBack(...args),
  },
  useNavigation: () => ({
    setOptions: mockSetOptions,
  }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock("expo-av", () => ({
  Audio: {
    setAudioModeAsync: (...args: any[]) => mockSetAudioModeAsync(...args),
    Sound: {
      createAsync: (...args: any[]) => mockCreateAsync(...args),
    },
  },
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    LinearGradient: (props: any) => React.createElement(View, props),
  };
});

const theme = getTheme("sva");
const themeValue = {
  theme: "sva",
  toggleTheme: jest.fn(),
  useSystemTheme: jest.fn(),
  newTheme: theme.colors,
  svaColors: theme.svaColors,
  spacing: theme.spacing,
  typography: theme.typography,
  svaTypography: theme.svaTypography,
  svaSpacing: theme.svaSpacing,
  svaComponents: theme.svaComponents,
  tokens: theme.tokens,
  activeTheme: theme,
};

const getTextContent = (node: any) =>
  Array.isArray(node.props.children)
    ? node.props.children.join("")
    : node.props.children;

const hasText = (tree: renderer.ReactTestRenderer, value: string) =>
  tree.root
    .findAllByType(Text)
    .some((node) => getTextContent(node) === value);

async function renderScreen() {
  let tree!: renderer.ReactTestRenderer;

  await act(async () => {
    tree = renderer.create(
      <ThemeContext.Provider value={themeValue as any}>
        <SoundscapePlayerScreen />
      </ThemeContext.Provider>
    );
    await Promise.resolve();
  });

  return tree;
}

describe("SoundscapePlayerScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {
      soundscapeId: "528-dna-integrity",
    };
    playbackStatusCallback = null;

    mockCreateAsync.mockImplementation(
      async (source: any, options: any, onPlaybackStatusUpdate: any) => {
        playbackStatusCallback = onPlaybackStatusUpdate;
        onPlaybackStatusUpdate({
          isLoaded: true,
          isPlaying: true,
          positionMillis: 0,
          durationMillis: 180000,
        });
        return { sound: mockSound };
      }
    );
  });

  it("loads the soundscape and renders the player surface", async () => {
    const tree = await renderScreen();

    expect(mockSetOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(mockSetAudioModeAsync).toHaveBeenCalled();
    expect(mockCreateAsync).toHaveBeenCalledWith(
      resolveSoundscapePlaybackSource("528-dna-integrity"),
      expect.objectContaining({
        shouldPlay: true,
      }),
      expect.any(Function)
    );

    expect(hasText(tree, "NOW PLAYING")).toBe(true);
    expect(hasText(tree, "SVA LABORATORY SOUNDSCAPE")).toBe(true);
    expect(hasText(tree, "528Hz: DNA Integrity")).toBe(true);
    expect(hasText(tree, "BINAURAL ENTRAINMENT")).toBe(true);
    expect(hasText(tree, "RESONATING AT 528.00 HZ")).toBe(true);
    expect(hasText(tree, "Pause soundscape")).toBe(false);
  });

  it("pauses the soundscape and returns to the previous screen", async () => {
    const tree = await renderScreen();

    const pauseButton = tree.root.findByProps({
      accessibilityLabel: "Pause soundscape",
    });
    const backButton = tree.root.findByProps({
      accessibilityLabel: "Back",
    });

    await act(async () => {
      await pauseButton.props.onPress();
      await backButton.props.onPress();
    });

    expect(mockSound.pauseAsync).toHaveBeenCalledTimes(1);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("applies intensity and binaural changes and stops on timer expiry", async () => {
    jest.useFakeTimers();

    try {
      const tree = await renderScreen();

      expect(mockSound.setVolumeAsync).toHaveBeenCalledWith(0.68);

      const intensityButton = tree.root.findByProps({
        accessibilityLabel: "Intensity MID",
      });

      await act(async () => {
        await intensityButton.props.onPress();
      });

      expect(mockSound.setVolumeAsync).toHaveBeenLastCalledWith(0.9);

      const binauralToggle = tree.root.findByProps({
        accessibilityLabel: "Toggle binaural entrainment",
      });

      await act(async () => {
        await binauralToggle.props.onPress();
      });

      expect(mockSound.setVolumeAsync).toHaveBeenLastCalledWith(0.63);

      const timerButton = tree.root.findByProps({
        accessibilityLabel: "Sleep timer OFF",
      });

      await act(async () => {
        await timerButton.props.onPress();
      });

      expect(
        tree.root.findByProps({
          accessibilityLabel: "Sleep timer 15 MIN",
        }).props.accessibilityRole
      ).toBe("button");

      await act(async () => {
        jest.advanceTimersByTime(15 * 60 * 1000);
        await Promise.resolve();
      });

      expect(mockSound.stopAsync).toHaveBeenCalledTimes(1);
      expect(
        tree.root.findByProps({
          accessibilityLabel: "Sleep timer OFF",
        }).props.accessibilityRole
      ).toBe("button");
    } finally {
      jest.useRealTimers();
    }
  });
});
