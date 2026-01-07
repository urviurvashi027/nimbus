// components/common/TrendCard.tsx
import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

export type TrendPoint = {
  label: string; // e.g. "Jul"
  value: number; // e.g. 72 (0–100)
};

type Props = {
  title: string; // "Habit Completion Rate"
  data: TrendPoint[];
  periodLabel?: string; // "Last 6 Months"
  onPressPeriod?: () => void; // open bottom sheet / picker
  maxValue?: number; // defaults to 100
  style?: StyleProp<ViewStyle>; // outer card style
};

const TrendCard: React.FC<Props> = ({
  title,
  data,
  periodLabel,
  onPressPeriod,
  maxValue = 100,
  style,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = makeStyles(newTheme);

  const highlightIndex = data.length > 0 ? data.length - 1 : 0;
  const highlightValue = data[highlightIndex]?.value ?? 0;

  const chartData = useMemo(
    () =>
      data.map((d, index) => ({
        value: d.value,
        label: d.label,
        // make last point a bit more prominent
        dataPointRadius: index === highlightIndex ? 5 : 3.5,
        dataPointColor:
          index === highlightIndex ? newTheme.accent : newTheme.accent,
      })),
    [data, highlightIndex, newTheme.accent]
  );

  return (
    <View style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>

        {periodLabel ? (
          <TouchableOpacity
            onPress={onPressPeriod}
            activeOpacity={0.85}
            style={styles.periodPill}
          >
            <Text style={styles.periodText}>{periodLabel}</Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color={newTheme.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Quick highlight for last point */}
      <Text style={styles.highlightLabel}>
        Latest: <Text style={styles.highlightValue}>{highlightValue}%</Text>
      </Text>

      {/* Chart */}
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          height={170}
          maxValue={maxValue}
          //   minValue={0}
          noOfSections={4}
          stepHeight={40}
          curved
          thickness={2}
          areaChart
          startFillColor={newTheme.accent}
          endFillColor={newTheme.accent}
          startOpacity={0.18}
          endOpacity={0.02}
          hideRules
          yAxisColor={"transparent"}
          xAxisColor={newTheme.divider}
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisLabel}
          initialSpacing={16}
          endSpacing={16}
          isAnimated
        />
      </View>
    </View>
  );
};

export default TrendCard;

const makeStyles = (t: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 18,
      backgroundColor: t.surface,
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 16,
      borderWidth: 1,
      borderColor: t.divider,
      // subtle premium shadow
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    } as ViewStyle,
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: t.textPrimary,
    },
    periodPill: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: t.divider,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: t.background,
    },
    periodText: {
      fontSize: 12,
      color: t.textSecondary,
      fontWeight: "500",
    },
    highlightLabel: {
      marginTop: 4,
      fontSize: 12,
      color: t.textSecondary,
    },
    highlightValue: {
      fontWeight: "700",
      color: t.accent,
    },
    chartWrapper: {
      marginTop: 8,
    },
    xAxisLabel: {
      fontSize: 11,
      color: t.textSecondary,
      marginTop: 4,
    },
    yAxisText: {
      fontSize: 10,
      color: t.textSecondary,
    },
  });
