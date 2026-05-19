import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { getTheme } from "../../../../theme";
import BreathWorkSessionScreen from "../BreathWorkSessionScreen";

const mockBack = jest.fn();
const mockSetOptions = jest.fn();
const mockSelection = jest.fn();
const mockImpact = jest.fn();

let mockParams = {
  breathworkId: "box-breath",
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

jest.mock("expo-haptics", () => ({
  selectionAsync: (...args: any[]) =>
    Promise.resolve(mockSelection(...args)),
  impactAsync: (...args: any[]) => Promise.resolve(mockImpact(...args)),
  ImpactFeedbackStyle: {
    Light: "light",
  },
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    Ionicons: (props: any) => React.createElement(View, props),
    MaterialCommunityIcons: (props: any) => React.createElement(View, props),
  };
});

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

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

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

function renderScreen() {
  let tree!: renderer.ReactTestRenderer;

  act(() => {
    tree = renderer.create(
      <ThemeContext.Provider value={themeValue as any}>
        <BreathWorkSessionScreen />
      </ThemeContext.Provider>
    );
  });

  return tree;
}

describe("BreathWorkSessionScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockParams = {
      breathworkId: "box-breath",
    };
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders the box breathing session and advances through phases", () => {
    const tree = renderScreen();

    expect(mockSetOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(hasText(tree, "Breath Session")).toBe(true);
    expect(
      hasText(tree, "Inhale 4s · Hold 4s · Exhale 4s · Hold 4s")
    ).toBe(true);
    expect(hasText(tree, "Start")).toBe(true);
    expect(hasText(tree, "Tap play to begin the 4-4-4-4 cycle.")).toBe(true);

    const playButton = tree.root.findByProps({
      accessibilityLabel: "Start breathwork",
    });

    act(() => {
      playButton.props.onPress();
    });

    expect(mockSelection).toHaveBeenCalledTimes(1);
    expect(hasText(tree, "Start")).toBe(true);
    expect(
      hasText(tree, "Climb the left edge with a smooth inhale.")
    ).toBe(true);

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(mockSelection).toHaveBeenCalledTimes(2);
    expect(
      hasText(tree, "Pause at the top and keep the frame steady.")
    ).toBe(true);

    act(() => {
      tree.unmount();
    });
  });
});
