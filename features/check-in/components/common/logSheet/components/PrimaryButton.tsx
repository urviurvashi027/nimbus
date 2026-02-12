import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useMemo, useState } from "react";
import { StyleSheet, Text, Pressable } from "react-native";

export const PrimaryButton = ({
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
        styles.primaryBtn,
        pressed && { backgroundColor: newTheme.accentPressed },
      ]}
    >
      <Text style={styles.primaryBtnText}>{label}</Text>
    </Pressable>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    primaryBtn: {
      height: 48,
      borderRadius: 14,
      backgroundColor: newTheme.buttonPrimary,
      alignItems: "center",
      justifyContent: "center",
    },
    primaryBtnText: {
      color: newTheme.buttonPrimaryText,
      fontSize: 16,
      fontWeight: "800",
    },
  });
