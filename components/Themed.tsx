/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  TouchableOpacity,
} from "react-native";

import Colors from "@/constant/Colors";
import { useColorScheme } from "./UseColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  console.log(theme, "theme");
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

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

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
  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <Text style={[textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export function LargeButton() {}

export function ScreenView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultView
      style={[
        {
          backgroundColor,
          padding: 25,
          height: "100%",
          paddingTop: 40,
          // marginTop: 60,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  const color = useThemeColor({ dark: lightColor, light: darkColor }, "text");

  const borderColor = useThemeColor(
    { dark: lightColor, light: darkColor },
    "text"
  );

  return (
    <DefaultTextInput
      style={[
        {
          backgroundColor,
          color,
          borderColor,
          padding: 15,
          borderWidth: 1,
          borderRadius: 15,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
