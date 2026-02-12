// src/components/selfCare/reflection/ReflectionLibrarySkeleton.tsx

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";

const ReflectionLibrarySkeleton: React.FC = () => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleSkeleton} />
      </View>

      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.iconSkeleton} />
          <View style={styles.textBlock}>
            <View style={styles.linePrimary} />
            <View style={styles.lineSecondary} />
          </View>
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
      width: 60,
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
    iconSkeleton: {
      width: 50,
      height: 50,
      borderRadius: 12,
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
  });

export default ReflectionLibrarySkeleton;
