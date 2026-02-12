// src/components/selfCare/soundscape/SoundscapeLibrarySkeleton.tsx

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";

const SoundscapeLibrarySkeleton: React.FC = () => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      {/* Library title skeleton */}
      <View style={styles.sectionHeader}>
        <View style={styles.titleSkeleton} />
      </View>

      {/* Rows */}
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.imageSkeleton} />
          <View style={styles.textBlock}>
            <View style={styles.linePrimary} />
            <View style={styles.lineSecondary} />
          </View>
          <View style={styles.iconSkeleton} />
        </View>
      ))}
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      marginBottom: spacing.md,
    },
    titleSkeleton: {
      width: 80,
      height: 18,
      borderRadius: 999,
      backgroundColor: newTheme.surfaceMuted,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 14,
      backgroundColor: newTheme.surfaceMuted,
      marginBottom: spacing.sm,
    },
    imageSkeleton: {
      width: 56,
      height: 56,
      borderRadius: 14,
      marginRight: spacing.md,
      backgroundColor: newTheme.surface,
    },
    textBlock: {
      flex: 1,
    },
    linePrimary: {
      height: 12,
      borderRadius: 999,
      backgroundColor: newTheme.surface,
      marginBottom: 4,
      width: "75%",
    },
    lineSecondary: {
      height: 10,
      borderRadius: 999,
      backgroundColor: newTheme.surface,
      width: "45%",
    },
    iconSkeleton: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: newTheme.surface,
      marginLeft: spacing.sm,
    },
  });

export default SoundscapeLibrarySkeleton;
