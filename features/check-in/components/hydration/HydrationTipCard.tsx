import React, { useContext, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import ThemeContext from "../../../../contexts/ThemeContext";
import type { ColorSet, Spacing, Typography } from "../../../../theme/types";

const makeStyles = (theme: ColorSet, spacing: Spacing, typography: Typography) =>
  StyleSheet.create({
    card: {
      marginTop: spacing.lg,
      borderRadius: 28,
      backgroundColor: theme.cardRaised ?? theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? theme.border,
      padding: spacing.lg,
      overflow: "hidden",
      shadowColor: theme.shadow,
      shadowOpacity: 0.22,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 18,
      elevation: 8,
    },
    tipHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    tipIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(121,169,242,0.10)",
      borderWidth: 1,
      borderColor: "rgba(121,169,242,0.14)",
    },
    sectionLabel: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      opacity: 0.78,
      letterSpacing: 1.7,
      textTransform: "uppercase",
    },
    tipQuote: {
      ...typography.h3,
      color: theme.textPrimary,
      fontStyle: "italic",
      lineHeight: typography.h3.lineHeight,
      letterSpacing: 0,
    },
  });

export const HydrationTipCard = () => {
  const { newTheme: theme, spacing, typography } = useContext(ThemeContext);
  const styles = useMemo(
    () => makeStyles(theme, spacing, typography),
    [theme, spacing, typography]
  );
  const accent = theme.chart2 ?? theme.accent;

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={["rgba(255,255,255,0.02)", "rgba(121,169,242,0.12)"]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.tipHeaderRow}>
        <View style={styles.tipIconWrap}>
          <Ionicons name="water-outline" size={18} color={accent} />
        </View>

        <Text style={styles.sectionLabel}>HYDRATION TIP</Text>
      </View>

      <Text style={styles.tipQuote}>
        Water is the first medicine. Let your rhythm be as consistent as the tides.
      </Text>
    </View>
  );
};
