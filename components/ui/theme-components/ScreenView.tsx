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
  const { newTheme, nimbusColors, tokens, spacing } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  const backgroundColor = bgColor || nimbusColors.bg.base || newTheme.background;

  const standardStyle = {
    backgroundColor,
    paddingHorizontal: padding !== undefined ? padding : tokens.layout.screenX,
    paddingTop: useSafeTop ? insets.top + spacing.md : padding ?? spacing.md,
    flex: 1,
  };

  return <View style={[standardStyle, style]} {...otherProps} />;
}
