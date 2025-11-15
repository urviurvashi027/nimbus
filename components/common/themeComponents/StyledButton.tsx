// components/common/StyledButton.tsx
import React, { useContext } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ActivityIndicator,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

type StyledButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type StyledButtonSize = "medium" | "large";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: StyledButtonVariant;
  size?: StyledButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const StyledButton: React.FC<Props> = ({
  label,
  onPress,
  variant = "primary",
  size = "large",
  fullWidth = true,
  disabled = false,
  loading = false,
  style,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = getStyles(newTheme);

  const isDisabled = disabled || loading;

  const baseStyle: StyleProp<ViewStyle> = [
    styles.base,
    size === "large" ? styles.large : styles.medium,
    fullWidth && styles.fullWidth,
  ];

  let containerVariant: ViewStyle = {};
  let textVariant: TextStyle = {};

  switch (variant) {
    case "primary":
      containerVariant = {
        backgroundColor: newTheme.accent,
      };
      textVariant = { color: newTheme.background };
      break;
    case "secondary":
      containerVariant = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: newTheme.divider,
      };
      textVariant = { color: newTheme.textPrimary };
      break;
    case "ghost":
      containerVariant = {
        backgroundColor: "transparent",
      };
      textVariant = { color: newTheme.textSecondary };
      break;
    case "destructive":
      containerVariant = {
        backgroundColor: newTheme.error ?? "#ff6b6b",
      };
      textVariant = { color: newTheme.background };
      break;
  }

  return (
    <Pressable
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        baseStyle,
        containerVariant,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "secondary" || variant === "ghost"
              ? newTheme.textPrimary
              : newTheme.background
          }
        />
      ) : (
        <Text
          style={[styles.label, textVariant] as StyleProp<TextStyle>}
          numberOfLines={1}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default StyledButton;

const getStyles = (t: any) =>
  StyleSheet.create({
    base: {
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 16,
    } as ViewStyle,
    fullWidth: {
      alignSelf: "stretch",
    } as ViewStyle,
    large: {
      height: 52,
    } as ViewStyle,
    medium: {
      height: 44,
    } as ViewStyle,
    label: {
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.3,
    } as TextStyle,
    pressed: {
      opacity: 0.9,
    } as ViewStyle,
    disabled: {
      opacity: 0.5,
    } as ViewStyle,
  });
