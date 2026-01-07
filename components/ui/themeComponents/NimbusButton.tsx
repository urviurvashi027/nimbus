import React, { useContext } from "react";
import { Pressable, Text, StyleSheet, ViewStyle } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { tokens } from "@/theme/tokens";

export function NimbusButton({
  label,
  onPress,
  disabled,
  loading,
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const { newTheme } = useContext(ThemeContext);
  const isDisabled = !!disabled || !!loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        s.btn,
        {
          backgroundColor: isDisabled ? newTheme.disabled : newTheme.accent,
          opacity: pressed && !isDisabled ? 0.92 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[s.text, { color: newTheme.buttonPrimaryText ?? "#10120E" }]}
      >
        {loading ? "Please wait..." : label}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    height: tokens.size.buttonHeight,
    borderRadius: tokens.radius.button,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 16, fontWeight: "900" },
});
