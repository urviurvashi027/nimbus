import React from "react";
import { View } from "react-native";

import type { BiometricBlueprintStyles } from "./styles";

type BlueprintSkeletonProps = {
  styles: BiometricBlueprintStyles;
  wide?: boolean;
};

export const BlueprintSkeleton = ({
  styles,
  wide = false,
}: BlueprintSkeletonProps) => (
  <View style={wide ? styles.skeletonWide : styles.skeletonCard}>
    {!wide ? (
      <>
        <View style={styles.skeletonTopRow}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonMetric} />
        </View>
        <View style={styles.skeletonBody}>
          <View style={styles.skeletonKicker} />
          <View style={styles.skeletonTitle} />
        </View>
        <View style={styles.skeletonProgress} />
      </>
    ) : (
      <>
        <View style={styles.skeletonWideRow}>
          <View style={styles.skeletonWideIcon} />
          <View style={styles.skeletonWideText} />
          <View style={styles.skeletonWideMetric} />
        </View>
        <View style={styles.skeletonProgress} />
      </>
    )}
  </View>
);
