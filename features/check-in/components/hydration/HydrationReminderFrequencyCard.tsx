import React, { useContext, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";

import ThemeContext from "../../../../contexts/ThemeContext";
import type { ColorSet, Spacing, Typography } from "../../../../theme/types";
import { REMINDER_OPTIONS } from "../../utils/hydration";

type HydrationReminderFrequencyCardProps = {
  reminderIndex: number;
  onChange: (index: number) => void;
};

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
    cardHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    sectionLabel: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      opacity: 0.78,
      letterSpacing: 1.7,
      textTransform: "uppercase",
    },
    cardSubTitle: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: 6,
      lineHeight: 18,
    },
    reminderBadge: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.05)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.06)",
    },
    reminderBadgeText: {
      ...typography.caption,
      color: theme.textPrimary,
      fontWeight: "700",
    },
    reminderSlider: {
      width: "100%",
      height: 28,
    },
    reminderLabelsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
    },
    reminderLabelCell: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    reminderTick: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.borderMuted ?? "rgba(255,255,255,0.12)",
      marginBottom: 8,
    },
    reminderLabel: {
      ...typography.caption,
      color: theme.textSecondary,
      opacity: 0.7,
    },
    reminderLabelActive: {
      color: theme.textPrimary,
      opacity: 1,
      fontWeight: "700",
    },
  });

export const HydrationReminderFrequencyCard = ({
  reminderIndex,
  onChange,
}: HydrationReminderFrequencyCardProps) => {
  const { newTheme: theme, spacing, typography } = useContext(ThemeContext);
  const styles = useMemo(
    () => makeStyles(theme, spacing, typography),
    [theme, spacing, typography]
  );

  const reminderMinutes = REMINDER_OPTIONS[reminderIndex] ?? REMINDER_OPTIONS[1];
  const accent = theme.accent ?? theme.chart1;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <View>
          <Text style={styles.sectionLabel}>RITUAL FREQUENCY</Text>
          <Text style={styles.cardSubTitle}>Set a subtle nudge for hydration.</Text>
        </View>

        <View style={styles.reminderBadge}>
          <Text style={styles.reminderBadgeText}>{reminderMinutes}m</Text>
        </View>
      </View>

      <Slider
        style={styles.reminderSlider}
        minimumValue={0}
        maximumValue={REMINDER_OPTIONS.length - 1}
        step={1}
        value={reminderIndex}
        minimumTrackTintColor={accent}
        maximumTrackTintColor={theme.borderMuted ?? "rgba(255,255,255,0.12)"}
        thumbTintColor={accent}
        onValueChange={(value) => onChange(Math.round(value))}
      />

      <View style={styles.reminderLabelsRow}>
        {REMINDER_OPTIONS.map((minutes, index) => {
          const active = index === reminderIndex;
          return (
            <View key={minutes} style={styles.reminderLabelCell}>
              <View
                style={[
                  styles.reminderTick,
                  active && {
                    backgroundColor: accent,
                    transform: [{ scale: 1.15 }],
                  },
                ]}
              />
              <Text
                style={[
                  styles.reminderLabel,
                  active && styles.reminderLabelActive,
                ]}
              >
                {minutes}m
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
