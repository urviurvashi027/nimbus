import ThemeContext from "@/contexts/ThemeContext";
import { useContext } from "react";
import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ScreenView(
  props: ViewProps & {
    bgColor?: string;
    padding?: number;
    useSafeTop?: boolean;
  }
) {
  const { style, bgColor, padding, useSafeTop = true, ...otherProps } = props;
  const { newTheme, tokens, spacing } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  console.log("ScreenView insets:", insets, spacing.md);

  const standardStyle = {
    backgroundColor: bgColor || newTheme.background,
    paddingHorizontal: padding !== undefined ? padding : tokens.layout.screenX,
    paddingTop: useSafeTop ? insets.top + spacing.md : padding ?? spacing.md,
    flex: 1,
  };

  console.log("ScreenView rendered with bgColor:", standardStyle);

  return <View style={[standardStyle, style]} {...otherProps} />;
}
