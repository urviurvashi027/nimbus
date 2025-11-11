// components/analytics/AdSpendCard.tsx
import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

type Point = { day: string; percent: number };

type Props = {
  title?: string;
  data: Point[]; // e.g., [{label:'Mon', value:120}, ...]
  changePct?: number; // e.g., -2 for -2%
  periodLabel?: string; // e.g., "Today", "This week"
  onPressPeriod?: () => void; // opens a sheet / menu
  maxValue?: number; // y-axis cap (auto if omitted)
};

export default function AdSpendCard({
  title = "Ad Spend",
  data,
  changePct = -2,
  periodLabel = "Today",
  onPressPeriod,
  maxValue,
}: Props) {
  // Nimbus palette (no theme dependency)
  const colors = {
    // Backgrounds & Borders
    bg: "#2A2D24", // Nimbus background (matches theme.background)
    border: "#2A2D24", // subtle border (matches theme.surface)

    // Text
    textPrimary: "#ECEFF4", // bright readable white-gray
    textSecondary: "#A1A69B", // muted for labels and ticks
    textMuted: "#6E7268", // for helper text or tooltips

    // Accent & Data colors (core to meditation chart)
    accentLavender: "#A3BE8C", // calm green accent — Nimbus brand tone
    accentAmber: "#EBCB8B", // warm secondary for peak values
    success: "#90B47A", // soft mossy green (used for positive streaks)
    danger: "#BF616A", // subtle earthy red (for low days)

    // Tooltip & overlay
    tooltipBg: "#242721", // semi-dark surface for contrast (matches Nimbus divider)
  };

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        value: d.percent,
        label: d.day,
        dataPointColor: colors.accentAmber,
      })),
    [data]
  );

  const positive = changePct >= 0;
  const changeColor = positive ? colors.success : colors.danger;

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  // auto y max with headroom if not provided
  const computedMax = useMemo(() => {
    if (maxValue) return maxValue;
    const peak = Math.max(...data.map((d) => d.percent), 1);
    // round up to a nice bucket
    const pow = Math.pow(10, Math.floor(Math.log10(peak)));
    const rounded = Math.ceil(peak / pow) * pow;
    return Math.max(rounded, peak + pow * 0.5);
  }, [data, maxValue]);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={[styles.title, { color: newTheme.textPrimary }]}>
            {title}
          </Text>
          <View style={styles.changePill}>
            <Ionicons
              name={positive ? "trending-up-outline" : "trending-down-outline"}
              size={14}
              color={changeColor}
            />
            <Text style={[styles.changeText, { color: changeColor }]}>
              {positive ? "+" : ""}
              {changePct}%
            </Text>
          </View>
        </View>

        <Pressable style={styles.periodBtn} onPress={onPressPeriod}>
          <Text style={[styles.periodText, { color: newTheme.textSecondary }]}>
            {periodLabel}
          </Text>
          {/* <Ionicons
            name="chevron-down"
            size={14}
            color={newTheme.textSecondary}
          /> */}
        </Pressable>
      </View>

      {/* Chart */}
      <LineChart
        data={chartData}
        curved
        height={180}
        thickness={5}
        maxValue={computedMax}
        areaChart
        startFillColor={colors.accentLavender}
        endFillColor={colors.accentAmber}
        startOpacity={0.16}
        endOpacity={0.06}
        color={colors.accentAmber} // line color (gifted-charts line stroke can’t be gradient)
        hideRules // clean look (no dotted grid)
        hideYAxisText
        yAxisColor="transparent"
        xAxisColor="transparent"
        xAxisLabelTextStyle={{
          color: colors.textMuted,
          fontSize: 12,
          marginTop: 6,
        }}
        hideDataPoints={false}
        dataPointsRadius={5}
        dataPointsColor="red"
        backgroundColor="transparent"
        pointerConfig={{
          showPointerStrip: true,
          pointerStripColor: colors.border,
          pointerStripWidth: 1,
          pointerVanishDelay: 1200,
          radius: 5,
          pointerColor: colors.success,
          pointerLabelComponent: (items: any[]) => {
            const it = items?.[0];
            return (
              <View
                style={[
                  styles.tooltip,
                  {
                    backgroundColor: colors.tooltipBg,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[styles.tooltipTitle, { color: newTheme.textPrimary }]}
                >
                  {it?.label}
                </Text>
                <Text
                  style={[
                    styles.tooltipValue,
                    { color: newTheme.textSecondary },
                  ]}
                >
                  ${it?.value}
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
      shadowColor: newTheme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    title: { fontSize: 16, fontWeight: "700", letterSpacing: 0.2 },
    changePill: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
      backgroundColor: newTheme.card, // faint base; text color overrides
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    changeText: { fontSize: 12, fontWeight: "800" },
    periodBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      padding: 6,
    },
    periodText: { fontSize: 12, fontWeight: "600" },
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
