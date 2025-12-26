import React, { useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ThemeContext from "@/context/ThemeContext";

export const MeditationFeaturedSkeleton: React.FC = () => {
  const { newTheme, spacing } = useContext(ThemeContext);
  const styles = skeletonStyles(newTheme, spacing);

  return (
    <View style={styles.featureBlock}>
      {/* "For You" label skeleton */}
      <View style={styles.sectionTitleSkeleton} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: spacing.md,
          paddingTop: spacing.sm,
        }}
      >
        {[0, 1].map((key) => (
          <View key={key} style={styles.featureCardSkeleton}>
            {/* top part */}
            <View style={styles.featureTopRow}>
              <View style={styles.avatarSkeleton} />
              <View style={styles.featureTextBlock}>
                <View style={styles.lineSkeletonWide} />
                <View style={styles.lineSkeletonNarrow} />
              </View>
            </View>
            {/* footer */}
            <View style={styles.featureFooterSkeleton} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export const MeditationListSkeleton: React.FC = () => {
  const { newTheme, spacing } = useContext(ThemeContext);
  const styles = skeletonStyles(newTheme, spacing);

  return (
    <View style={styles.listBlock}>
      {/* "Library" label skeleton */}
      <View
        style={[
          styles.sectionTitleSkeleton,
          { width: 110, marginBottom: spacing.md },
        ]}
      />

      {[0, 1, 2].map((row) => (
        <View key={row} style={styles.listRowSkeleton}>
          <View style={styles.listAvatarSkeleton} />
          <View style={styles.listTextBlock}>
            <View style={styles.lineSkeletonWide} />
            <View style={styles.lineSkeletonNarrow} />
          </View>
        </View>
      ))}
    </View>
  );
};

const skeletonStyles = (newTheme: any, spacing: any) =>
  StyleSheet.create({
    featureBlock: {
      marginBottom: spacing.lg,
    },
    listBlock: {
      marginBottom: spacing.xl,
    },
    sectionTitleSkeleton: {
      width: 80,
      height: 18,
      borderRadius: 999,
      backgroundColor: newTheme.surfaceMuted,
      opacity: 0.7,
    },
    featureCardSkeleton: {
      width: 260,
      minHeight: 140,
      borderRadius: 22,
      backgroundColor: newTheme.surfaceMuted,
      marginRight: spacing.md,
      overflow: "hidden",
    },
    featureTopRow: {
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
      backgroundColor: newTheme.card,
      opacity: 0.8,
      marginRight: spacing.md,
    },
    featureTextBlock: {
      flex: 1,
    },
    featureFooterSkeleton: {
      height: 36,
      backgroundColor: newTheme.card,
      opacity: 0.7,
      marginTop: spacing.sm,
    },
    lineSkeletonWide: {
      height: 14,
      borderRadius: 999,
      backgroundColor: newTheme.card,
      opacity: 0.9,
      marginBottom: 6,
      width: "70%",
    },
    lineSkeletonNarrow: {
      height: 12,
      borderRadius: 999,
      backgroundColor: newTheme.card,
      opacity: 0.7,
      width: "40%",
    },
    listRowSkeleton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 14,
      backgroundColor: newTheme.surfaceMuted,
      marginBottom: spacing.sm,
    },
    listAvatarSkeleton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: newTheme.card,
      opacity: 0.8,
      marginRight: spacing.md,
    },
    listTextBlock: {
      flex: 1,
    },
  });
