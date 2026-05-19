import React, { useContext } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ThemeContext from "@/contexts/ThemeContext";

const SKELETON_ITEMS = Array.from({ length: 6 }, (_, index) => index);

const SoundscapePinterestSkeleton: React.FC = () => {
  const { svaColors, spacing } = useContext(ThemeContext);
  const styles = styling(svaColors, spacing);

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {[72, 54, 86, 66].map((width, index) => (
          <View key={`pill-${index}`} style={[styles.pillSkeleton, { width }]} />
        ))}
      </View>

      <FlatList
        data={SKELETON_ITEMS}
        keyExtractor={(item) => String(item)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ index }) => (
          <View style={styles.cardShell}>
            <View
              style={[
                styles.card,
                index % 3 === 0 ? styles.cardTall : styles.cardShort,
              ]}
            >
              <View
                style={[
                  styles.imageSkeleton,
                  index % 2 === 0 ? styles.imageTall : styles.imageMedium,
                ]}
              />

              <View style={styles.body}>
                <View style={styles.linePrimary} />
                <View style={styles.lineSecondary} />

                <View style={styles.tagsRow}>
                  <View style={styles.tagPill} />
                  <View style={[styles.tagPill, styles.tagPillMuted]} />
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styling = (colors: any, spacing: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    filterRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingBottom: spacing.md,
    },
    pillSkeleton: {
      height: 40,
      borderRadius: 999,
      backgroundColor: colors.surface.base,
      borderWidth: 1,
      borderColor: colors.border.subtle,
    },
    columnWrapper: {
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    cardShell: {
      width: "48%",
    },
    card: {
      width: "100%",
      borderRadius: 24,
      backgroundColor: colors.surface.base,
      borderWidth: 1,
      borderColor: colors.border.subtle,
      overflow: "hidden",
    },
    cardTall: {
      height: 340,
    },
    cardShort: {
      height: 304,
    },
    imageSkeleton: {
      backgroundColor: colors.bg.subtle,
    },
    imageTall: {
      height: 208,
    },
    imageMedium: {
      height: 186,
    },
    body: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: spacing.md,
      justifyContent: "space-between",
    },
    linePrimary: {
      height: 18,
      width: "78%",
      borderRadius: 999,
      backgroundColor: colors.bg.subtle,
      marginBottom: spacing.xs,
    },
    lineSecondary: {
      height: 14,
      width: "56%",
      borderRadius: 999,
      backgroundColor: colors.bg.subtle,
    },
    tagsRow: {
      flexDirection: "row",
      gap: spacing.xs,
      marginTop: spacing.md,
    },
    tagPill: {
      height: 24,
      flex: 1,
      borderRadius: 999,
      backgroundColor: colors.bg.subtle,
    },
    tagPillMuted: {
      flex: 0.78,
    },
  });

export default SoundscapePinterestSkeleton;
