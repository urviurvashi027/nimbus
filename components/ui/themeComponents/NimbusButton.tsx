import React, { useContext } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  ActivityIndicator,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { tokens } from "@/theme/tokens";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface NimbusButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function NimbusButton({
  label,
  onPress,
  variant = "primary",
  disabled,
  loading,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: NimbusButtonProps) {
  const { newTheme, typography } = useContext(ThemeContext);
  const isDisabled = !!disabled || !!loading;

  // Determine base colors based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: newTheme.surfaceMuted,
          borderColor: "transparent",
          textColor: newTheme.textPrimary,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: newTheme.border,
          textColor: newTheme.textPrimary,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          borderColor: "transparent",
          textColor: newTheme.accent,
        };
      case "primary":
      default:
        return {
          backgroundColor: newTheme.accent,
          borderColor: "transparent",
          textColor: newTheme.buttonPrimaryText ?? "#10120E",
        };
    }
  };

  const { backgroundColor, borderColor, textColor } = getVariantStyle();

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        s.btn,
        {
          backgroundColor: isDisabled ? newTheme.disabled : backgroundColor,
          borderColor: isDisabled ? "transparent" : borderColor,
          borderWidth: variant === "outline" ? tokens.border.strong : 0,
          opacity: pressed && !isDisabled ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leftIcon && <View style={s.iconLeft}>{leftIcon}</View>}
          <Text
            style={[
              typography.button,
              { color: isDisabled ? newTheme.textDisabled : textColor },
              textStyle,
            ]}
          >
            {label}
          </Text>
          {rightIcon && <View style={s.iconRight}>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    height: tokens.size.buttonHeight,
    borderRadius: tokens.radius.button,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
