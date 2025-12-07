import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  text: string;
}

const WorkoutTipBanner: React.FC<Props> = ({ text }) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: 18,
      backgroundColor: newTheme.surfaceMuted,
    },
    text: {
      ...typography.caption,
      color: newTheme.textSecondary,
      textAlign: "center",
    },
  });

export default WorkoutTipBanner;
