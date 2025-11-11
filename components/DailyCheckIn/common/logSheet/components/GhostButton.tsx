import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useMemo, useState } from "react";
import { StyleSheet, Text, Pressable } from "react-native";

export const GhostButton = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.ghostBtn,
        pressed && { backgroundColor: "#262A22" },
      ]}
    >
      <Text style={styles.ghostBtnText}>{label}</Text>
    </Pressable>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    ghostBtn: {
      height: 44,
      borderRadius: 12,
      backgroundColor: newTheme.buttonGhostBg,
      borderColor: newTheme.border,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
      justifyContent: "center",
    },
    ghostBtnText: {
      color: newTheme.buttonGhostText,
      fontSize: 14,
      fontWeight: "700",
    },
  });
