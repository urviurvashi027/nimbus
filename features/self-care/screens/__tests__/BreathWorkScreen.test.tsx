import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { ROUTES } from "../../../../constants/routes";
import { getTheme } from "../../../../theme";
import BreathWorkScreen from "../BreathWorkScreen";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockSetOptions = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    back: (...args: any[]) => mockBack(...args),
    push: (...args: any[]) => mockPush(...args),
  },
  useNavigation: () => ({
    setOptions: mockSetOptions,
  }),
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    Ionicons: (props: any) => React.createElement(View, props),
    MaterialCommunityIcons: (props: any) => React.createElement(View, props),
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

const hasText = (tree: renderer.ReactTestRenderer, value: string) =>
  tree.root
    .findAllByType(Text)
    .some((node) =>
      Array.isArray(node.props.children)
        ? node.props.children.join("") === value
        : node.props.children === value
    );

function renderScreen() {
  let tree!: renderer.ReactTestRenderer;

  act(() => {
    tree = renderer.create(
      <ThemeContext.Provider value={themeValue as any}>
        <BreathWorkScreen />
      </ThemeContext.Provider>
    );
  });

  return tree;
}

describe("BreathWorkScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the recommendation rail, tone chips, stacked cards, and quote card", () => {
    const tree = renderScreen();

    expect(mockSetOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(hasText(tree, "Breath Work")).toBe(true);
    expect(
      hasText(tree, "Choose a rhythm, then narrow the stack below.")
    ).toBe(true);
    expect(hasText(tree, "BREATH FORMULAS")).toBe(false);
    expect(hasText(tree, "Entrain your neural frequency.")).toBe(false);
    expect(hasText(tree, "Swipe a formula that fits the moment.")).toBe(false);
    expect(
      hasText(
        tree,
        "Pick a rhythm from the carousel, then narrow the stack below to the tone you need."
      )
    ).toBe(false);
    expect(
      hasText(
        tree,
        "Swipe a rhythm, filter the stack, and settle the room."
      )
    ).toBe(false);
    expect(hasText(tree, "4-4-4-4: Box Breath")).toBe(true);
    expect(hasText(tree, "GROUNDING")).toBe(true);
    expect(hasText(tree, "STEADY")).toBe(true);
    expect(hasText(tree, "RELEASE")).toBe(true);
    expect(hasText(tree, "SLEEP")).toBe(true);
    expect(
      hasText(tree, '"Equal counts make the room feel steady again."')
    ).toBe(true);
  });

  it("navigates to the detail screen when a rhythm is selected", () => {
    const tree = renderScreen();

    const releaseCard = tree.root.findByProps({
      accessibilityLabel: "Open rhythm 4-6: Release Path",
    });

    act(() => {
      releaseCard.props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_DETAIL,
      params: {
        breathworkId: "release-breath",
      },
    });
  });

  it("launches the session when a recommendation play button is pressed", () => {
    const tree = renderScreen();

    const playButton = tree.root.findByProps({
      accessibilityLabel: "Play recommendation 4-6: Release Path",
    });

    act(() => {
      playButton.props.onPress({
        stopPropagation: jest.fn(),
      });
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_SESSION,
      params: {
        breathworkId: "release-breath",
      },
    });
  });

  it("launches the session when a stack play button is pressed", () => {
    const tree = renderScreen();

    const playButton = tree.root.findByProps({
      accessibilityLabel: "Play stack 4-6: Release Path",
    });

    act(() => {
      playButton.props.onPress({
        stopPropagation: jest.fn(),
      });
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_SESSION,
      params: {
        breathworkId: "release-breath",
      },
    });
  });
});
