import React, { useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import ThemeContext from "@/contexts/ThemeContext";

interface SyncProgressCardProps {
  percentage: number; // 0 to 100
  currentPhase?: string;
  nextPhase?: string;
}

const SyncProgressCard: React.FC<SyncProgressCardProps> = ({
  percentage,
  currentPhase = "Flow State",
  nextPhase = "Master Healer",
}) => {
  const { newTheme, typography, spacing } = useContext(ThemeContext);

  // Animation for the progress bar
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 1000,
      useNativeDriver: false, // width is not supported by native driver
    }).start();
  }, [percentage]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>SYNCHRONIZATION PATH</Text>
        <View style={styles.percentWrapper}>
          <Text style={styles.percentValue}>{percentage}%</Text>
          <Text style={styles.percentLabel}> Sync</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[styles.progressFill, { width: widthInterpolated }]}
        />
      </View>

      {/* Footer Info Row */}
      <View style={styles.footerRow}>
        <Text style={styles.footerLabel}>
          CURRENT:{" "}
          <Text style={styles.footerValue}>{currentPhase.toUpperCase()}</Text>
        </Text>
        <Text style={styles.footerLabel}>
          NEXT:{" "}
          <Text style={styles.footerValue}>{nextPhase.toUpperCase()}</Text>
        </Text>
      </View>
    </View>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      marginVertical: spacing.lg,
      // No card background/shadow based on screenshot, just layout
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1.2,
      color: theme.textSecondary,
      opacity: 0.7,
    },
    percentWrapper: {
      flexDirection: "row",
      alignItems: "baseline",
    },
    percentValue: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.textPrimary,
    },
    percentLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.textSecondary,
    },
    progressTrack: {
      height: 6,
      backgroundColor: theme.surfaceMuted ?? "rgba(255,255,255,0.1)",
      borderRadius: 99,
      overflow: "hidden",
      marginBottom: spacing.sm,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.accent, // Sage green
      borderRadius: 99,
    },
    footerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    footerLabel: {
      fontSize: 10,
      fontWeight: "600",
      color: theme.textSecondary,
      opacity: 0.6,
      letterSpacing: 0.5,
    },
    footerValue: {
      color: theme.textSecondary,
      opacity: 0.9,
    },
  });

export default SyncProgressCard;
