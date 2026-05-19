import React from "react";
import { Text } from "react-native";
import renderer, { act } from "react-test-renderer";

import ThemeContext from "../../../../contexts/ThemeContext";
import { getTheme } from "../../../../theme";
import CreateAffirmationScreen from "../CreateAffirmationScreen";

const mockBack = jest.fn();
const mockSetOptions = jest.fn();
const mockSetItem = jest.fn();
const mockGetItem = jest.fn();
const mockToastShow = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    back: (...args: any[]) => mockBack(...args),
  },
  useNavigation: () => ({
    setOptions: mockSetOptions,
  }),
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = jest.requireActual("react-native");

  return {
    Ionicons: (props: any) => React.createElement(View, props),
    MaterialCommunityIcons: (props: any) => React.createElement(View, props),
  };
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: (...args: any[]) => mockGetItem(...args),
  setItem: (...args: any[]) => mockSetItem(...args),
}));

jest.mock("@/components/ui/toast/useNimbusToast", () => ({
  useNimbusToast: () => ({
    show: mockToastShow,
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

const getStatementInputs = (tree: renderer.ReactTestRenderer) =>
  Array.from(
    new Map(
      tree.root
        .findAll(
          (node) =>
            typeof node.props.testID === "string" &&
            node.props.testID.startsWith("affirmation-statement-input-")
        )
        .map((node) => [node.props.testID as string, node])
    ).values()
  ) as renderer.ReactTestInstance[];

function renderScreen() {
  let tree!: renderer.ReactTestRenderer;

  act(() => {
    tree = renderer.create(
      <ThemeContext.Provider value={themeValue as any}>
        <CreateAffirmationScreen />
      </ThemeContext.Provider>
    );
  });

  return tree;
}

describe("CreateAffirmationScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it("renders the custom affirmation form with three statement inputs", () => {
    const tree = renderScreen();

    expect(mockSetOptions).toHaveBeenCalledWith({
      headerShown: false,
    });

    expect(hasText(tree, "Create Affirmation")).toBe(true);
    expect(hasText(tree, "CUSTOM DECK")).toBe(true);
    expect(getStatementInputs(tree)).toHaveLength(3);

    const addButton = tree.root.findByProps({
      testID: "add-statement-button",
    });
    expect(addButton.props.disabled).toBe(false);
  });

  it("adds statements up to seven and then locks the add action", () => {
    const tree = renderScreen();

    const addButton = tree.root.findByProps({
      testID: "add-statement-button",
    });

    act(() => {
      addButton.props.onPress();
      addButton.props.onPress();
      addButton.props.onPress();
      addButton.props.onPress();
    });

    expect(getStatementInputs(tree)).toHaveLength(7);

    const disabledAddButton = tree.root.findByProps({
      testID: "add-statement-button",
    });
    expect(disabledAddButton.props.disabled).toBe(true);
    expect(hasText(tree, "Maximum 7 reached")).toBe(true);
  });

  it("saves the custom affirmation and returns to the affirmation screen", async () => {
    const tree = renderScreen();

    act(() => {
      tree.root.findByProps({
        testID: "affirmation-title-input",
      }).props.onChangeText("Soft Return");
      tree.root.findByProps({
        testID: "affirmation-tag-input",
      }).props.onChangeText("calm, reset");
      tree.root.findByProps({
        testID: "affirmation-statement-input-0",
      }).props.onChangeText("I can move gently and still make progress.");
      tree.root.findByProps({
        testID: "affirmation-statement-input-1",
      }).props.onChangeText("My pace can be soft and still be strong.");
      tree.root.findByProps({
        testID: "affirmation-statement-input-2",
      }).props.onChangeText("What I build with care will hold.");
    });

    const createButton = tree.root.findByProps({
      testID: "create-affirmation-button",
    });

    await act(async () => {
      await createButton.props.onPress();
    });

    expect(mockGetItem).toHaveBeenCalledWith("custom_affirmations_v1");
    expect(mockSetItem).toHaveBeenCalledTimes(1);
    expect(mockBack).toHaveBeenCalled();
    expect(mockToastShow).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "success",
        title: "Affirmation saved",
      })
    );

    const [, savedJson] = mockSetItem.mock.calls[0];
    const savedDecks = JSON.parse(savedJson as string);
    expect(savedDecks).toHaveLength(1);
    expect(savedDecks[0]).toEqual(
      expect.objectContaining({
        title: "Soft Return",
        tag: "calm",
        tags: ["calm", "reset"],
        statements: [
          "I can move gently and still make progress.",
          "My pace can be soft and still be strong.",
          "What I build with care will hold.",
        ],
      })
    );
  });
});
