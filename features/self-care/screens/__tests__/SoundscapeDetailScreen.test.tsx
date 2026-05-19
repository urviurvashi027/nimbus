import React from "react";
import { Share, Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { getTheme } from "../../../../theme";
import { ROUTES } from "../../../../constants/routes";
import SoundscapeDetailScreen from "../SoundscapeDetailScreen";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockSetOptions = jest.fn();
const mockShare = jest.fn();

let mockParams = {
  soundscapeId: "528-dna-integrity",
};

jest.mock("expo-router", () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
    back: (...args: any[]) => mockBack(...args),
  },
  useNavigation: () => ({
    setOptions: mockSetOptions,
  }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    Image: (props: any) => React.createElement(View, props),
  };
});

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    LinearGradient: (props: any) => React.createElement(View, props),
  };
});

jest.mock("../../../../components/ui/theme-components/NimbusButton", () => {
  const React = require("react");
  const { Pressable, Text } = require("react-native");

  return {
    NimbusButton: ({ label, onPress, ...props }: any) =>
      React.createElement(
        Pressable,
        { accessibilityLabel: label, onPress, ...props },
        React.createElement(Text, null, label)
      ),
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
        <SoundscapeDetailScreen />
      </ThemeContext.Provider>
    );
    await Promise.resolve();
  });

  return tree;
}

describe("SoundscapeDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {
      soundscapeId: "528-dna-integrity",
    };
    jest.spyOn(Share, "share").mockImplementation(mockShare);
    mockShare.mockResolvedValue({ action: "sharedAction" });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the soundscape detail layout", async () => {
    const tree = await renderScreen();

    expect(mockSetOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(hasText(tree, "Soundscape Prelude")).toBe(true);
    expect(hasText(tree, "528Hz: DNA Integrity")).toBe(true);
    expect(hasText(tree, "ABOUT THIS SOUNDSCAPE")).toBe(true);
    expect(hasText(tree, "WHY IT HELPS")).toBe(true);
    expect(hasText(tree, "Start Soundscape")).toBe(true);
  });

  it("toggles favorite state and shares the soundscape", async () => {
    const tree = await renderScreen();

    const favoriteButton = tree.root.findByProps({
      accessibilityLabel: "Add to favorites",
    });

    act(() => {
      favoriteButton.props.onPress();
    });

    expect(
      tree.root.findByProps({
        accessibilityLabel: "Remove from favorites",
      }).props.accessibilityRole
    ).toBe("button");

    const shareButton = tree.root.findByProps({
      accessibilityLabel: "Share soundscape",
    });

    act(() => {
      shareButton.props.onPress();
    });

    expect(mockShare).toHaveBeenCalledWith({
      message: "528Hz: DNA Integrity · Alpha 10Hz | Solfeggio 528Hz",
    });
  });

  it("opens the soundscape player from the detail screen", async () => {
    const tree = await renderScreen();

    const startButton = tree.root.findByProps({
      accessibilityLabel: "Start Soundscape",
    });

    act(() => {
      startButton.props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_SOUNDSCAPE_PLAYER,
      params: {
        soundscapeId: "528-dna-integrity",
      },
    });
  });
});
