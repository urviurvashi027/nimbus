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
import React, { useState } from "react";

import Colors, { themeColors } from "@/constant/theme/Colors";
// import { theme } from "@/constant/theme/Colors";
import { useColorScheme } from "./UseColorScheme";
import { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import { Spacing, Typography } from "@/types/themeTypes";
import { Ionicons } from "@expo/vector-icons";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export type ThemeKey = "basic" | "light" | "dark";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  console.log(theme, "themetheme");
  const colorFromProps = props[theme];
  // console.log(colorFromProps, colorName, theme);
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
  const styles = btnStyling(theme);

  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <Text style={[textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const btnStyling = (theme: ThemeKey) => StyleSheet.create({});

export function LargeButton() {}

export function ScreenView(
  props: ViewProps & { bgColor?: string; padding?: number }
) {
  const { style, bgColor, padding, ...otherProps } = props;
  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);
  const styles = screenViewStyling(theme, newTheme, bgColor, padding);
  console.log("NewTheme[theme].background,");
  return <DefaultView style={[style, styles.container]} {...otherProps} />;
}

const screenViewStyling = (
  theme: ThemeKey,
  newTheme: any,
  bgColor?: string,
  padding?: number
) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor || newTheme.background,
      // backgroundColor: themeColors[theme].background,
      padding: padding || 15,
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

// new component input
export const StyledInput = ({
  label,
  iconName,
  placeholder,
  onChangeText,
  value,
  isPassword = false,
  style,
}: any) => {
  // const { theme,toggleTheme, useSystemTheme } =
  //   useContext(ThemeContext);
  // State to track if the input is focused to change border color
  const [isFocused, setIsFocused] = useState(false);
  // State to toggle password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(!isPassword);

  // Set focused state to true when input is focused
  const handleFocus = () => setIsFocused(true);
  // Set focused state to false when input is blurred
  const handleBlur = () => setIsFocused(false);

  const { theme, toggleTheme, spacing, typography, newTheme, useSystemTheme } =
    useContext(ThemeContext);

  const styles = styledInputStyling(
    theme,
    newTheme,
    isFocused,
    spacing,
    typography
  );

  // Styles are now JS objects for inline styling
  return (
    <View style={[styles.container, style]}>
      {/* Label for the input field */}
      <Text style={styles.label}>{label}</Text>
      {/* Container for the icon, text input, and password toggle icon */}
      <View
        style={[
          styles.inputContainer,
          // Apply focused styles when the input is active
          isFocused && styles.inputContainerFocused,
        ]}
      >
        {/* Left icon */}
        <Ionicons
          name={iconName}
          size={22}
          color={isFocused ? "#FFFFFF" : "#9CA3AF"}
          style={styles.icon}
        />
        {/* Text input field */}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          value={value}
          secureTextEntry={!isPasswordVisible}
          autoCapitalize="none"
        />
        {/* Eye icon to toggle password visibility, only shown if isPassword is true */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#9CA3AF"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styledInputStyling = (
  theme: ThemeKey,
  newTheme: any,
  isFocused: boolean,
  spacing: Spacing,
  typography: Typography
) =>
  StyleSheet.create({
    // Container for the label and the input box
    container: {
      width: "100%",
    },
    // Style for the label text above the input
    label: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 10,
      fontFamily: "System", // A common default font
    },
    // Container that holds the icon and the TextInput
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#1F2937", // A slightly lighter dark shade for the input background
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#374151", // Default border color
      paddingHorizontal: 15,
    },
    // Style applied to the input container when it is focused
    inputContainerFocused: {
      borderColor: "#4A5568", // A slightly lighter border color for focus state
    },
    // Style for the icon on the left
    icon: {
      marginRight: 12,
    },
    // Style for the eye icon on the right (for password fields)
    eyeIcon: {
      marginLeft: 12,
    },
    // Style for the actual TextInput element
    input: {
      flex: 1,
      color: "#FFFFFF",
      fontSize: 16,
      paddingVertical: 14,
      fontFamily: "System",
    },
  });
