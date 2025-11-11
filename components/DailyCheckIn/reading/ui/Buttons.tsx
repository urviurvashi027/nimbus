import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          // backgroundColor: newTheme.card,
          opacity: pressed ? 0.9 : 1,
          shadowColor: newTheme.shadow,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    btn: {
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    btnText: {
      color: newTheme.buttonPrimary,
      fontWeight: "500",
      fontSize: 16,
      textAlign: "center",
      paddingVertical: 6,
    },
  });
