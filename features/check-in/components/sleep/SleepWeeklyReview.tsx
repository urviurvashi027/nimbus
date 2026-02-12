import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

type DayPoint = { day: string; percent: number };

type Props = {
  data: DayPoint[];
  idealRange?: { min: number; max: number };
  maxHours?: number;
  title?: string;
};

export default function SleepWeekChart({
  data,
  idealRange = { min: 7, max: 9 },
  maxHours = 12,
  title = "Sleep (Last 7 days)",
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const colors = {
    bgStart: "#1C1E1A", // base background (subtle vignette, optional)
    bgEnd: "#1C1E1A",

    line: "#A3BE8C", // brand accent (sage)
    areaHi: "rgba(163,190,140,0.28)", // near line (soft fill)
    areaLo: "rgba(94,129,172,0.08)", // fade into slate (info family)

    dot: "#EBCB8B", // warm highlight for nodes
    pointer: "#CFE86C", // lime marker for interactivity

    tooltipBg: "#22251E",
    tooltipBd: "#3A3E33",
    textPrimary: "#ECEFF4",
    textSecondary: "#A1A69B",

    idealBand: "rgba(163,190,140,0.12)",
  };

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        value: d.percent,
        label: d.day,
        dataPointColor:
          d.percent < idealRange.min || d.percent > idealRange.max
            ? "#EBCB8B" // Nimbus warning tone for outliers
            : colors.line,
      })),
    [data]
  );

  const avg = useMemo(
    () =>
      Math.round(
        (data.reduce((s, p) => s + p.percent, 0) / Math.max(1, data.length)) *
          10
      ) / 10,
    [data]
  );

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: newTheme.surface,
        },
      ]}
    >
      {/* Gradient background layer */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: newTheme.surface, borderRadius: 20 },
        ]}
      />

      {/* Ideal Range shaded band */}
      <View
        style={{
          position: "absolute",
          top: 60 + (180 * (maxHours - idealRange.max)) / maxHours,
          height: (100 * (idealRange.max - idealRange.min)) / maxHours,
          left: 0,
          right: 0,
          backgroundColor: colors.idealBand,
          zIndex: 0,
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <View style={[styles.badge, { backgroundColor: newTheme.card }]}>
          <Text style={[styles.badgeText, { color: newTheme.textSecondary }]}>
            Avg:{" "}
            <Text style={{ color: colors.line, fontWeight: "800" }}>
              {avg}h
            </Text>
          </Text>
        </View>
      </View>

      {/* Chart */}
      <LineChart
        data={chartData}
        curved
        height={180}
        thickness={5}
        maxValue={maxHours}
        hideRules
        hideYAxisText
        yAxisColor="transparent"
        xAxisColor="transparent"
        xAxisLabelTextStyle={{
          color: colors.textSecondary,
          fontSize: 12,
          marginTop: 6,
        }}
        color={colors.line}
        startFillColor={colors.areaHi}
        endFillColor={colors.areaLo}
        startOpacity={1} // we’re already sending rgba; keep at 1
        endOpacity={1}
        areaChart
        hideDataPoints={false}
        dataPointsHeight={12}
        dataPointsWidth={12}
        dataPointsColor={colors.dot}
        dataPointsRadius={6}
        backgroundColor="transparent"
        pointerConfig={{
          pointerStripWidth: 1,
          pointerStripColor: "#3C3F4A",
          radius: 5,
          pointerColor: colors.pointer,
          showPointerStrip: true,
          pointerVanishDelay: 1500,
          pointerLabelComponent: (items: any[]) => {
            const it = items[0];
            return (
              <View
                style={[
                  styles.tooltip,
                  { backgroundColor: colors.tooltipBg, borderColor: "#333" },
                ]}
              >
                <Text style={[styles.tooltipTitle, { color: colors.line }]}>
                  {it?.label}
                </Text>
                <Text
                  style={[styles.tooltipValue, { color: colors.textPrimary }]}
                >
                  {it?.value}h
                </Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 20,
      padding: 14,
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: newTheme.surface,
      borderColor: newTheme.border,
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    title: { fontSize: 16, fontWeight: "700", letterSpacing: 0.3 },
    badge: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    badgeText: { fontSize: 12, fontWeight: "600" },
    tooltip: {
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
    },
    tooltipTitle: { fontSize: 12, fontWeight: "700" },
    tooltipValue: { fontSize: 12, marginTop: 2 },
  });
