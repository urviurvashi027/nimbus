// components/DailyCheckIn/WeeklySummaryChart.tsx
import React, { useContext, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

type DayDatum = { day: string; percent: number }; // percent 0..100

type WeeklySummaryChartProps = {
  data: DayDatum[];
  height?: number;
  barColor?: string;
  background?: string;
  title?: string;
  tickCount?: number; // how many Y ticks to render (including 0 and max)
};

const AnimatedView = Animated.createAnimatedComponent(View);

export default function WeeklySummaryChart({
  data,
  height = 160,
  barColor,
  background,
  title = "Weekly summaryi",
  tickCount = 4, // fewer ticks => less clutter
}: WeeklySummaryChartProps) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  // animated values for bars
  const animVals = useMemo(
    () => data.map(() => new Animated.Value(0)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.length]
  );

  useEffect(() => {
    const seq = data.map((d, i) =>
      Animated.timing(animVals[i], {
        toValue: Math.max(0, Math.min(1, d.percent / 100)),
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      })
    );
    Animated.stagger(80, seq).start();
  }, [data, animVals]);

  // generate tick values evenly (include 0)
  const ticks = useMemo(() => {
    const max = 100;
    const count = Math.max(2, Math.floor(tickCount)); // at least 2
    const out: number[] = [];
    for (let i = 0; i < count; i++) {
      // descending so top label is largest
      out.push(Math.round((max * (count - 1 - i)) / (count - 1)));
    }
    return out;
  }, [tickCount]);

  const barFill = barColor ?? newTheme.accent;
  const containerBg = background ?? newTheme.surface;

  return (
    <View style={[styles.card, { backgroundColor: containerBg }]}>
      <Text style={[styles.title, { color: newTheme.textPrimary }]}>
        {title}
      </Text>

      <View style={styles.chartRow}>
        {/* Y axis: use column spaced evenly (less fragile than absolute positioning) */}
        <View style={styles.yAxis}>
          {ticks.map((t) => (
            <Text
              key={`y-${t}`}
              style={[styles.yLabel, { color: newTheme.textSecondary }]}
            >
              {t}%
            </Text>
          ))}
        </View>

        {/* Chart area */}
        <View style={[styles.chartArea, { height }]}>
          {/* horizontal grid lines positioned relative using flex */}
          <View style={styles.gridContainer}>
            {ticks.map((_, idx) => (
              <View
                key={`grid-${idx}`}
                style={[styles.gridLine, { opacity: idx === 0 ? 0.06 : 0.03 }]}
              />
            ))}
          </View>

          {/* bars row */}
          <View style={styles.barsRow}>
            {data.map((d, i) => {
              const animHeight = animVals[i].interpolate({
                inputRange: [0, 1],
                outputRange: [0, height * 0.82],
              });
              return (
                <View key={d.day} style={styles.barColumn}>
                  <AnimatedView
                    style={[
                      styles.bar,
                      {
                        backgroundColor: barFill,
                        height: animHeight,
                      },
                    ]}
                  />
                  <Text
                    style={[styles.xLabel, { color: newTheme.textSecondary }]}
                  >
                    {d.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 12,
      padding: 12,
      marginVertical: 12,
      borderWidth: 1,
      borderColor: theme.divider,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 6 },
          shadowRadius: 12,
        },
        android: { elevation: 2 },
      }),
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 8,
    },
    chartRow: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    // slimmer yAxis so labels don't crowd chart space
    yAxis: {
      width: 36,
      justifyContent: "space-between", // evenly space tick labels vertically
      paddingTop: 6,
      paddingBottom: 6,
    },
    yLabel: {
      fontSize: 11,
      textAlign: "right",
      paddingRight: 8,
      opacity: 0.86,
    },
    chartArea: {
      flex: 1,
      position: "relative",
      paddingLeft: 4,
      paddingRight: 4,
    },
    gridContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 6,
      bottom: 18,
      justifyContent: "space-between", // aligns grid lines to same rows as ticks
    },
    gridLine: {
      height: 1,
      backgroundColor: "rgba(255,255,255,0.03)",
    },
    barsRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      position: "absolute",
      left: 6,
      right: 6,
      bottom: 18,
      top: 6,
    },
    barColumn: {
      flex: 1,
      alignItems: "center",
      marginHorizontal: 6,
      justifyContent: "flex-end",
    },
    bar: {
      width: 20,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
    },
    xLabel: {
      marginTop: 8,
      fontSize: 12,
    },
  });
