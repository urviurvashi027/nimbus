// components/stats/RingsChart.tsx
import React, { useContext } from "react";
import { View, StyleSheet, ViewStyle, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import ThemeContext from "@/context/ThemeContext";

export interface Ring {
  value: number;
  maxValue: number;
  color: string;
  label?: string; // shown in legend if provided
}

interface Props {
  rings: Ring[];
  size?: number;
  strokeWidth?: number;
  gap?: number;
  trackColor?: string;
  style?: ViewStyle; // card container style
  showLegend?: boolean;
  legendPlacement?: "left" | "bottom";
  children?: React.ReactNode; // center content
}

export default function RingsChart({
  rings,
  size = 160,
  strokeWidth = 10,
  gap = 8,
  trackColor,
  style,
  showLegend = true,
  legendPlacement = "left",
  children,
}: Props) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const center = size / 2;
  const baseTrackColor = trackColor ?? `${newTheme.surface}AA`; // subtle translucent track

  const chart = (
    <View style={[styles.chartContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {rings.map((ring, index) => {
          const radius =
            center - (index + 1) * (strokeWidth + gap) + strokeWidth / 2;

          if (radius <= 0) return null;

          const circumference = 2 * Math.PI * radius;
          const safeMax = ring.maxValue <= 0 ? 1 : ring.maxValue;
          const clampedValue = Math.min(Math.max(ring.value, 0), safeMax);
          const progress = (clampedValue / safeMax) * circumference;

          return (
            <React.Fragment key={index}>
              {/* background track */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={baseTrackColor}
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* progress arc */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={ring.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${progress}, ${circumference}`}
                strokeLinecap="round"
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            </React.Fragment>
          );
        })}
      </Svg>

      {children && <View style={styles.centerContent}>{children}</View>}
    </View>
  );

  const legendData = rings.filter((r) => !!r.label);

  const legend =
    !showLegend || legendData.length === 0 ? null : (
      <View
        style={[
          styles.legendBlock,
          legendPlacement === "bottom" && {
            flexDirection: "row",
            marginTop: 14,
          },
        ]}
      >
        {legendData.map((ring, index) => (
          <View
            key={`${ring.label}-${index}`}
            style={[
              styles.legendItem,
              legendPlacement === "bottom" && { marginRight: 16 },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: ring.color }]} />
            <View>
              <Text style={styles.legendLabel}>{ring.label}</Text>
              <Text style={[styles.legendValue, { color: ring.color }]}>
                {ring.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    );

  return (
    <View style={[styles.card, style]}>
      {legendPlacement === "left" ? (
        <View style={styles.row}>
          {legend}
          {chart}
        </View>
      ) : legendPlacement === "bottom" ? (
        <>
          {chart}
          {legend}
        </>
      ) : (
        chart
      )}
    </View>
  );
}

const styling = (t: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.surface,
      borderRadius: 20,
      padding: 14,
      shadowColor: "#000",
      shadowOpacity: 0.22,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chartContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    centerContent: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    legendBlock: {
      justifyContent: "center",
      marginRight: 12,
    },
    legendItem: {
      flexDirection: "row",
      marginBottom: 10,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 6,
      marginTop: 4,
      marginRight: 8,
    },
    legendLabel: {
      color: t.textSecondary,
      fontSize: 13,
      fontWeight: "600",
    },
    legendValue: {
      fontSize: 15,
      fontWeight: "700",
    },
  });
