import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { getTheme } from "../../../../theme";
import { ROUTES } from "../../../../constants/routes";
import MeditationScreen from "../MeditationScreen";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockSetOptions = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
    back: (...args: any[]) => mockBack(...args),
  },
  useNavigation: () => ({
    setOptions: mockSetOptions,
  }),
}));

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
        <MeditationScreen />
      </ThemeContext.Provider>
    );
  });

  return tree;
}

describe("MeditationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the curated recommendation above the meditation list", () => {
    const tree = renderScreen();

    expect(mockSetOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(hasText(tree, "Quiet Current")).toBe(true);
    expect(hasText(tree, "CURATED RECOMMENDATION")).toBe(true);
    expect(hasText(tree, "Moonlit Reset")).toBe(true);
    expect(hasText(tree, "Curated pick")).toBe(true);
    expect(hasText(tree, "Sleep Drift")).toBe(true);
    expect(hasText(tree, "Focus Lantern")).toBe(true);
    expect(hasText(tree, "Open")).toBe(true);

    const list = tree.root.findByProps({
      testID: "meditation-library-list",
    });

    expect(list.props.horizontal).not.toBe(true);
  });

  it("opens the meditation detail page from the curated recommendation", () => {
    const tree = renderScreen();

    const featuredCard = tree.root.findByProps({
      accessibilityLabel: "Open Moonlit Reset",
    });

    act(() => {
      featuredCard.props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_MEDITATION_DETAIL,
      params: {
        meditationId: "moonlit-reset",
      },
    });
  });

  it("filters the library list by tag while keeping the curated card", () => {
    const tree = renderScreen();

    const sleepFilter = tree.root.findByProps({
      accessibilityLabel: "Sleep",
    });

    act(() => {
      sleepFilter.props.onPress();
    });

    expect(hasText(tree, "Sleep collection")).toBe(true);
    expect(hasText(tree, "Sleep Drift")).toBe(true);
    expect(hasText(tree, "Moonlit Reset")).toBe(true);
    expect(hasText(tree, "Focus Lantern")).toBe(false);
    expect(hasText(tree, "Soft Release")).toBe(false);
  });

  it("opens the meditation detail page from a library card", () => {
    const tree = renderScreen();

    const listCard = tree.root.findByProps({
      accessibilityLabel: "Open Sleep Drift",
    });

    act(() => {
      listCard.props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_MEDITATION_DETAIL,
      params: {
        meditationId: "sleep-drift",
      },
    });
  });
});
