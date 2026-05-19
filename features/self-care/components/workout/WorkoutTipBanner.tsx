import React, { useContext, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import ThemeContext from "@/contexts/ThemeContext";
import type { ColorSet, Spacing, Typography } from "@/theme/types";

interface WorkoutTipBannerProps {
  text: string;
}

const WorkoutTipBanner: React.FC<WorkoutTipBannerProps> = ({ text }) => {
  const { newTheme: theme, spacing, typography } = useContext(ThemeContext);
  const styles = useMemo(
    () => styling(theme, spacing, typography),
    [theme, spacing, typography]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styling = (theme: ColorSet, spacing: Spacing, typography: Typography) =>
  StyleSheet.create({
    container: {
      borderRadius: 18,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    text: {
      ...typography.caption,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 18,
    },
  });

export default WorkoutTipBanner;
