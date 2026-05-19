import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { ROUTES } from "../../../../constants/routes";
import { getTheme } from "../../../../theme";
import BreathWorkDetailScreen from "../BreathWorkDetailScreen";

const mockBack = jest.fn();
const mockSetOptions = jest.fn();
const mockPush = jest.fn();
const mockSelection = jest.fn();

let mockParams = {
  breathworkId: "release-breath",
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

jest.mock("expo-haptics", () => ({
  selectionAsync: (...args: any[]) =>
    Promise.resolve(mockSelection(...args)),
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
        <BreathWorkDetailScreen />
      </ThemeContext.Provider>
    );
  });

  return tree;
}

describe("BreathWorkDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {
      breathworkId: "release-breath",
    };
  });

  it("renders the premium breathwork detail layout", () => {
    const tree = renderScreen();

    expect(mockSetOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(hasText(tree, "Breath Prelude")).toBe(true);
    expect(
      hasText(tree, "A quiet threshold before the practice begins.")
    ).toBe(true);
    expect(hasText(tree, "4-6: Release Path")).toBe(true);
    expect(hasText(tree, "DESCRIPTION")).toBe(true);
    expect(hasText(tree, "CONTEXT")).toBe(true);
    expect(hasText(tree, "STEPS TO PERFORM")).toBe(true);
    expect(hasText(tree, "BENEFITS")).toBe(true);
    expect(hasText(tree, "TIPS")).toBe(true);
    expect(
      hasText(
        tree,
        "Longer exhale to soften tension and loosen the edges."
      )
    ).toBe(true);
    expect(
      hasText(
        tree,
        "Use this when tension is parked in the jaw, chest, or shoulders and you want the exhale to carry more of the release."
      )
    ).toBe(true);
    expect(
      hasText(
        tree,
        "Unclench the jaw, soften the shoulders, and give the chest a little room."
      )
    ).toBe(true);
    expect(
      hasText(
        tree,
        "Helps the exhale carry more of the effort than the inhale."
      )
    ).toBe(true);
    expect(
      hasText(
        tree,
        "Let the air leave naturally instead of pushing it out."
      )
    ).toBe(true);
    expect(hasText(tree, "Play Breath Work")).toBe(true);
  });

  it("launches the breath session when the start button is pressed", () => {
    const tree = renderScreen();

    const startButton = tree.root.findByProps({
      accessibilityLabel: "Play Breath Work",
    });

    act(() => {
      startButton.props.onPress();
    });

    expect(mockSelection).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_BREATHWORK_SESSION,
      params: {
        breathworkId: "release-breath",
      },
    });
  });
});
