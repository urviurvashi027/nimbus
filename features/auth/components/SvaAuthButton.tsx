import React, { useContext } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
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
  testID,
}: SvaAuthButtonProps) {
  const { svaColors, svaComponents } = useContext(ThemeContext);
  const isDisabled = disabled || loading;

  const palette =
    variant === "primary"
      ? {
          bg: svaComponents?.button.primary.bg ?? svaColors.brand.primary,
          borderColor: "transparent",
          textColor:
            svaComponents?.button.primary.text ?? svaColors.text.inverse,
        }
      : {
          bg: svaColors.surface.base,
          borderColor: svaColors.border.default,
          textColor: svaColors.text.primary,
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
              ? svaComponents?.button.primary.disabledBg ??
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
          <Text style={[s.label, { color: palette.textColor }]}>
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
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});
