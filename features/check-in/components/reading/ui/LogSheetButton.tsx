import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export const PrimaryButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        styles.primary,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Text style={styles.primaryText}>{title}</Text>
    </Pressable>
  );
};

export const GhostButton = ({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        styles.ghost,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <Text style={styles.ghostText}>{title}</Text>
    </Pressable>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    btn: {
      height: 46,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
    },
    primary: {
      backgroundColor: newTheme.buttonPrimary,
      shadowColor: newTheme.shadow,
      paddingHorizontal: 14,
    },
    primaryText: {
      color: newTheme.buttonPrimaryText,
      fontSize: 15,
      fontWeight: "800",
    },
    ghost: {
      backgroundColor: newTheme.buttonGhostBg,
      borderColor: newTheme.buttonGhostBorder,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 14,
    },
    ghostText: {
      color: newTheme.buttonGhostText,
      fontSize: 15,
      fontWeight: "800",
    },
  });
