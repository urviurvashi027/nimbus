// src/components/selfCare/workout/TimerRing.tsx

import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  size: number;
  progress: number; // 0..1
  remainingSeconds: number;
  statusText: string;
  mode: "workout" | "rest";
}

const TimerRing: React.FC<Props> = ({
  size,
  progress,
  remainingSeconds,
  statusText,
  mode,
}) => {
  const { newTheme, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, typography);

  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const minutesLabel = minutes.toString().padStart(2, "0");
  const secondsLabel = seconds.toString().padStart(2, "0");

  const ringColor = mode === "rest" ? "#22C55E" : "#4C8DFF";

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#111827"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={ringColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>

      <View style={styles.labelContainer}>
        <Text style={styles.timeText}>
          {minutesLabel}:{secondsLabel}
        </Text>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    </View>
  );
};

const styling = (newTheme: any, typography: any) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
      alignItems: "center",
    },
    labelContainer: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
    },
    timeText: {
      ...typography.h2,
      color: newTheme.textPrimary,
      fontSize: 32,
      fontWeight: "600",
    },
    statusText: {
      ...typography.caption,
      color: newTheme.textSecondary,
      marginTop: 4,
    },
  });

export default TimerRing;
