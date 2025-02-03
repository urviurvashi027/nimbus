/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

import Colors, { themeColors } from "@/constant/Colors";
import { useColorScheme } from "./UseColorScheme";
import { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

type ThemeKey = "basic" | "light" | "dark";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  // console.log(theme, "theme");
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  console.log("Text styling", theme);
  const styles = textStyling(theme);

  return <DefaultText style={[styles.textStyle, style]} {...otherProps} />;
}

const textStyling = (theme: ThemeKey) =>
  StyleSheet.create({
    textStyle: {
      color: themeColors[theme].text,
    },
  });

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const Button = ({
  title,
  onPress,
  style,
  textStyle,
}: {
  title: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
}) => {
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  console.log("Text styling", theme);
  const styles = btnStyling(theme);

  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <Text style={[textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const btnStyling = (theme: ThemeKey) => StyleSheet.create({});

export function LargeButton() {}

export function ScreenView(props: ViewProps) {
  const { style, ...otherProps } = props;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = screenViewStyling(theme);
  console.log(style, "screnview");

  return <DefaultView style={[style, styles.container]} {...otherProps} />;
}

const screenViewStyling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      backgroundColor: themeColors[theme].background,
      padding: 15,
      height: "100%",
      // paddingTop: Platform.OS === "ios" ? 50 : 20,
    },
  });

export function TextInput(props: TextInputProps) {
  const { style, ...otherProps } = props;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = inputStyling(theme);

  return <DefaultTextInput style={styles.input} {...otherProps} />;
}

const inputStyling = (theme: ThemeKey) =>
  StyleSheet.create({
    input: {
      backgroundColor: themeColors[theme].background,
      color: themeColors[theme].text,
      borderColor: themeColors[theme].inpurBorderColor,
      padding: 19,
      borderWidth: 1,
      borderRadius: 10,

      // Shadow for iOS
      shadowColor: themeColors[theme].boxShadowColor,
      shadowOffset: {
        width: -2,
        height: 4, // vertical shadow
      },
      shadowOpacity: 0.2, // shadow transparency
      shadowRadius: 3, // shadow blur

      // Shadow for Android
      elevation: 15, // Creates shadow on Android
    },
  });

export const FormInput = (props: TextInputProps) => {
  const { style, ...otherProps } = props;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = formInputStyling(theme);

  return <DefaultTextInput style={styles.input} {...otherProps} />;
};

const formInputStyling = (theme: ThemeKey) =>
  StyleSheet.create({
    input: {
      backgroundColor: themeColors[theme].background,
      color: themeColors[theme].text,
      borderColor: themeColors[theme].inpurBorderColor,
      padding: 15,
      borderWidth: 1,
      borderRadius: 10,
    },
  });
