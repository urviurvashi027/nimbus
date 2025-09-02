import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Ring {
  value: number; // progress value
  maxValue: number; // total possible
  color: string; // active color
}

interface Props {
  rings: Ring[];
  size?: number;
  strokeWidth?: number;
  gap?: number;
}

export default function RingsChart({
  rings,
  size = 160,
  strokeWidth = 10,
  gap = 8,
}: Props) {
  const center = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {rings.map((ring, index) => {
          const radius =
            center - (index + 1) * (strokeWidth + gap) + strokeWidth / 2;
          const circumference = 2 * Math.PI * radius;
          const progress = (ring.value / ring.maxValue) * circumference;

          return (
            <React.Fragment key={index}>
              {/* Background circle */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={"#222"} // dark bg instead of white
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Foreground arc */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={ring.color}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${progress}, ${circumference}`}
                strokeLinecap="round" // ✅ rounded edges like Apple fitness
                rotation="-90"
                origin={`${center}, ${center}`}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({});
