import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { getTheme } from "../../../../theme";
import { ROUTES } from "../../../../constants/routes";
import JournalDetailScreen from "../JournalDetailScreen";

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

const mockNavigation = {
  setOptions: jest.fn(),
};

let mockParams = {
  journalId: "journal-1",
  journalTitle: "The Morning Light",
  journalDescription:
    "Today I feel a deep sense of gratitude for the soft amber light filtering through the window.",
  journalTags: "gratitude,mindfulness",
  journalDateLabel: "OCT 24",
};

jest.mock("expo-router", () => ({
  router: {
    push: (...args: any[]) => mockPush(...args),
    back: (...args: any[]) => mockBack(...args),
    replace: (...args: any[]) => mockReplace(...args),
  },
  useNavigation: () => mockNavigation,
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

function renderScreen() {
  let tree!: renderer.ReactTestRenderer;

  act(() => {
    tree = renderer.create(
      <ThemeContext.Provider value={themeValue as any}>
        <JournalDetailScreen />
      </ThemeContext.Provider>
    );
  });

  return tree;
}

describe("JournalDetailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {
      journalId: "journal-1",
      journalTitle: "The Morning Light",
      journalDescription:
        "Today I feel a deep sense of gratitude for the soft amber light filtering through the window.",
      journalTags: "gratitude,mindfulness",
      journalDateLabel: "OCT 24",
    };
  });

  it("renders the premium journal detail layout", () => {
    const tree = renderScreen();

    expect(mockNavigation.setOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(hasText(tree, "Chronicle Prelude")).toBe(true);
    expect(hasText(tree, "The Morning Light")).toBe(true);
    expect(
      hasText(
        tree,
        "Today I feel a deep sense of gratitude for the soft amber light filtering through the window."
      )
    ).toBe(true);
    expect(hasText(tree, "#GRATITUDE")).toBe(true);
    expect(hasText(tree, "WHY IT HELPS")).toBe(true);
    expect(hasText(tree, "Start Journal")).toBe(true);
  });

  it("starts the guided journal flow with the selected journal params", () => {
    const tree = renderScreen();

    const startButton = tree.root.findByProps({
      accessibilityLabel: "Start Journal",
    });

    act(() => {
      startButton.props.onPress();
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: ROUTES.AUTH.SELF_CARE_JOURNAL_ENTRY,
      params: {
        journalId: "journal-1",
        journalTitle: "The Morning Light",
        journalDescription:
          "Today I feel a deep sense of gratitude for the soft amber light filtering through the window.",
        journalTags: "gratitude,mindfulness",
        journalDateLabel: "OCT 24",
      },
    });
  });
});
