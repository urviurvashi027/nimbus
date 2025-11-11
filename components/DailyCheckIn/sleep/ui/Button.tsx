import React, { useContext } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: newTheme.buttonPrimary,
          shadowColor: newTheme.shadow,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={[styles.btnText, { color: newTheme.buttonPrimaryText }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function GhostButton({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: newTheme.buttonGhostBg,
          borderColor: newTheme.border,
          borderWidth: StyleSheet.hairlineWidth,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <Text style={[styles.btnText, { color: newTheme.buttonGhostText }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  btnText: { fontSize: 16, fontWeight: "700" },
});
