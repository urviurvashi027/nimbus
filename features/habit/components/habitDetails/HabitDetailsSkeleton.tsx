import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  spacing: any;
}

export default function HabitDetailsSkeleton({ spacing }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const s = skeletonStyles(newTheme, spacing);

  return (
    <View>
      {/* Header */}
      <View style={s.headerContainer}>
        <View style={s.backCircle} />
        <View style={s.headerTextBlock}>
          <View style={s.lineLarge} />
          <View style={s.lineSmall} />
        </View>
      </View>

      {/* Details card */}
      <View style={s.card}>
        {[1, 2].map((row) => (
          <View key={row} style={s.row}>
            <View style={s.labelStub} />
            <View style={s.valueStub} />
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={s.summaryContainer}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={s.summaryCard}>
            <View style={s.labelStubSmall} />
            <View style={s.valueStubWide} />
          </View>
        ))}
      </View>

      {/* Weekly */}
      <View style={s.sectionTitleStub} />
      <View style={s.weeklyCard}>
        <View style={s.weeklyHeaderRow}>
          <View style={s.iconStub} />
          <View style={s.weeklyTitleStub} />
        </View>
        <View style={s.weekCirclesRow}>
          {Array.from({ length: 7 }).map((_, idx) => (
            <View key={idx} style={s.circleStub} />
          ))}
        </View>
      </View>

      {/* Monthly */}
      <View style={s.sectionTitleStub} />
      <View style={s.monthlyCard}>
        <View style={s.monthHeaderStub} />
        <View style={s.monthGrid}>
          {Array.from({ length: 28 }).map((_, idx) => (
            <View key={idx} style={s.dotStub} />
          ))}
        </View>
      </View>
    </View>
  );
}

const skeletonStyles = (theme: any, spacing: any) =>
  StyleSheet.create({
    shimmer: {
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      borderRadius: 999,
      opacity: 0.6,
    },

    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    backCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      marginRight: spacing.md,
    },
    headerTextBlock: { flex: 1 },
    lineLarge: {
      height: 16,
      width: "60%",
      borderRadius: 8,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      marginBottom: spacing.xs,
    },
    lineSmall: {
      height: 12,
      width: "40%",
      borderRadius: 8,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
    },

    card: {
      backgroundColor: theme.surface,
      borderRadius: spacing.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.lg,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    labelStub: {
      height: 12,
      width: "30%",
      borderRadius: 5,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
    },
    valueStub: {
      height: 14,
      width: "25%",
      borderRadius: 7,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
    },

    summaryContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: spacing.lg,
    },
    summaryCard: {
      width: "48%",
      backgroundColor: theme.surface,
      padding: spacing.md,
      borderRadius: spacing.md,
      marginBottom: spacing.sm,
    },
    labelStubSmall: {
      height: 10,
      width: "50%",
      borderRadius: 5,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      marginBottom: spacing.xs,
    },
    valueStubWide: {
      height: 14,
      width: "40%",
      borderRadius: 7,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
    },

    sectionTitleStub: {
      height: 14,
      width: "40%",
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      borderRadius: 6,
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },

    weeklyCard: {
      backgroundColor: theme.surface,
      borderRadius: spacing.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    weeklyHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    iconStub: {
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      marginRight: spacing.sm,
    },
    weeklyTitleStub: {
      height: 12,
      width: "40%",
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      borderRadius: 6,
    },
    weekCirclesRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.sm,
    },
    circleStub: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
    },

    monthlyCard: {
      backgroundColor: theme.surface,
      borderRadius: spacing.lg,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    monthHeaderStub: {
      height: 12,
      width: "50%",
      alignSelf: "center",
      borderRadius: 6,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
      marginBottom: spacing.md,
    },
    monthGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      rowGap: spacing.sm,
    },
    dotStub: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.surfaceSoft ?? theme.disabled,
    },
  });
