import React, { useContext } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
  View,
} from "react-native";

import ThemeContext from "@/contexts/ThemeContext";
import { SVATypography } from "@/theme/typography";

type Variant = "primary" | "secondary";

export type SvaAuthButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export function SvaAuthButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  testID,
}: SvaAuthButtonProps) {
  const { nimbusColors, nimbusComponents } = useContext(ThemeContext);
  const isDisabled = disabled || loading;

  const palette =
    variant === "primary"
      ? {
          bg: nimbusComponents?.button.primary.bg ?? nimbusColors.brand.primary,
          borderColor: "transparent",
          textColor:
            nimbusComponents?.button.primary.text ?? nimbusColors.text.inverse,
        }
      : {
          bg: nimbusColors.surface.base,
          borderColor: nimbusColors.border.default,
          textColor: nimbusColors.text.primary,
        };

  return (
    <Pressable
      testID={testID}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.button,
        {
          backgroundColor: isDisabled
            ? variant === "primary"
              ? nimbusComponents?.button.primary.disabledBg ??
                "rgba(163,190,140,0.28)"
              : "rgba(255,255,255,0.03)"
            : palette.bg,
          borderColor: palette.borderColor,
          opacity: pressed && !isDisabled ? 0.92 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.textColor} />
      ) : (
        <>
          {leftIcon ? <View style={s.leftIcon}>{leftIcon}</View> : null}
          <Text style={[s.label, { color: palette.textColor }, textStyle]}>
            {label}
          </Text>
          {rightIcon ? <View style={s.rightIcon}>{rightIcon}</View> : null}
        </>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  label: {
    ...SVATypography.textStyle.button,
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    fontWeight: "600",
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});

