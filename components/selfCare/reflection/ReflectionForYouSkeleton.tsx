// src/components/selfCare/reflection/ReflectionForYouSkeleton.tsx

import React, { useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";

const ReflectionForYouSkeleton: React.FC = () => {
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleSkeleton} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: spacing.md }}
      >
        {[0, 1, 2].map((i) => (
          <View key={i} style={styles.cardSkeleton}>
            <View style={styles.cardTopRow}>
              <View style={styles.avatarSkeleton} />
              <View style={styles.textBlock}>
                <View style={styles.linePrimary} />
                <View style={styles.lineSecondary} />
              </View>
            </View>
            <View style={styles.footerSkeleton} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styling = (
  theme: ThemeKey,
  newTheme: any,
  spacing: any,
  typography: any
) =>
  StyleSheet.create({
    sectionContainer: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      marginBottom: spacing.md,
    },
    titleSkeleton: {
      width: 90,
      height: 18,
      borderRadius: 999,
      backgroundColor: newTheme.surfaceMuted,
    },
    cardSkeleton: {
      width: 280,
      minHeight: 150,
      marginRight: spacing.md,
      marginVertical: spacing.md,
      borderRadius: 22,
      backgroundColor: newTheme.surfaceMuted,
      overflow: "hidden",
    },
    cardTopRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    avatarSkeleton: {
      width: 72,
      height: 72,
      borderRadius: 20,
      marginRight: spacing.md,
      backgroundColor: newTheme.surface,
    },
    textBlock: {
      flex: 1,
    },
    linePrimary: {
      height: 14,
      borderRadius: 999,
      backgroundColor: newTheme.surface,
      marginBottom: 6,
      width: "80%",
    },
    lineSecondary: {
      height: 10,
      borderRadius: 999,
      backgroundColor: newTheme.surface,
      width: "60%",
    },
    footerSkeleton: {
      height: 40,
      backgroundColor: newTheme.surface,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      borderRadius: 12,
    },
  });

export default ReflectionForYouSkeleton;
