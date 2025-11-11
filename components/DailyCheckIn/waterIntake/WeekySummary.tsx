// components/DailyCheckIn/WeeklySummaryChartSvg.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  PixelRatio,
  LayoutChangeEvent,
  Text,
} from "react-native";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import ThemeContext from "@/context/ThemeContext";

type DayDatum = { day: string; percent: number };

type WeeklySummaryChartSvgProps = {
  data: DayDatum[];
  height?: number; // height of the PLOT only
  width?: number; // optional; otherwise auto-measure
  barColor?: string;
  background?: string;
  tickCount?: number;
  title?: string;
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function WeeklySummaryChartSvg({
  data,
  height = 180, // plot height only
  width,
  barColor,
  background,
  tickCount = 4,
  title = "Weekly Summary",
}: WeeklySummaryChartSvgProps) {
  const { newTheme } = React.useContext(ThemeContext);
  const barFill = barColor ?? newTheme.accent;
  const bg = background ?? newTheme.surface;
  const hair = 1 / PixelRatio.get();

  // Layout constants
  const MARGIN_LEFT = 56; // aligns with Y labels (and title)
  const MARGIN_RIGHT = 12;
  const MARGIN_TOP = 12; // back to a small top margin – title lives outside SVG
  const MARGIN_BOTTOM = 26;

  // Auto width
  const [layoutW, setLayoutW] = useState<number | null>(null);
  const chartW = width ?? layoutW ?? 0;
  const onLayout = (e: LayoutChangeEvent) => {
    if (width == null) setLayoutW(e.nativeEvent.layout.width);
  };

  const usableW = Math.max(0, chartW - MARGIN_LEFT - MARGIN_RIGHT);
  const usableH = height - MARGIN_TOP - MARGIN_BOTTOM;

  // Ticks (100..0)
  const ticks = useMemo(() => {
    const count = Math.max(2, Math.floor(tickCount));
    return Array.from({ length: count }, (_, i) =>
      Math.round((100 * (count - 1 - i)) / (count - 1))
    );
  }, [tickCount]);

  // Animations
  const animVals = useRef(data.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    if (animVals.length !== data.length) {
      // @ts-ignore – replace array in place
      animVals.splice(
        0,
        animVals.length,
        ...data.map(() => new Animated.Value(0))
      );
    }
    Animated.stagger(
      80,
      data.map((d, i) =>
        Animated.timing(animVals[i], {
          toValue: Math.max(0, Math.min(1, d.percent / 100)),
          duration: 650,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      )
    ).start();
  }, [data]);

  // Bars
  const n = Math.max(1, data.length);
  const step = n > 0 ? usableW / n : 0;
  const barWidth = Math.max(4, step * 0.5);

  const ready = chartW > 0 && usableW > 0 && usableH > 0;

  return (
    <View
      onLayout={onLayout}
      style={[
        styles.container,
        { backgroundColor: bg, borderColor: newTheme.divider }, // ❌ no fixed height here
      ]}
    >
      {/* Header aligned to the plot left edge */}
      {!!title && (
        <View style={[styles.header, { paddingLeft: 20, marginBottom: 15 }]}>
          <Text style={[styles.title, { color: newTheme.textPrimary }]}>
            {title}
          </Text>
        </View>
      )}

      {/* Chart box owns the fixed plot height */}
      <View style={{ height }}>
        {ready && (
          <Svg width={chartW} height={height}>
            {/* Grid + Y labels */}
            {ticks.map((t, i) => {
              const y = MARGIN_TOP + (usableH * i) / (ticks.length - 1);
              const snapped = Math.round(y / hair) * hair;
              return (
                <React.Fragment key={`tick-${t}`}>
                  <Line
                    x1={MARGIN_LEFT}
                    y1={snapped}
                    x2={chartW - MARGIN_RIGHT}
                    y2={snapped}
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={hair}
                  />
                  <SvgText
                    x={MARGIN_LEFT - 8}
                    y={y}
                    fill={newTheme.textSecondary}
                    fontSize={11}
                    textAnchor="end"
                    alignmentBaseline="middle"
                  >
                    {`${t}%`}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {/* Bars + X labels */}
            {data.map((d, i) => {
              const centerX = MARGIN_LEFT + step * i + step / 2;
              const x = centerX - barWidth / 2;

              return (
                <React.Fragment key={d.day}>
                  <AnimatedRect
                    x={x}
                    y={Animated.subtract(
                      MARGIN_TOP + usableH,
                      Animated.multiply(animVals[i], usableH)
                    )}
                    width={barWidth}
                    height={Animated.multiply(animVals[i], usableH)}
                    rx={6}
                    fill={barFill}
                  />
                  <SvgText
                    x={centerX}
                    y={height - MARGIN_BOTTOM / 2}
                    fill={newTheme.textSecondary}
                    fontSize={12}
                    textAnchor="middle"
                  >
                    {d.day}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    overflow: "hidden",
    marginVertical: 15,
  },
  header: {
    height: 28,
    justifyContent: "center",
    marginBottom: 4, // small space before grid
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
