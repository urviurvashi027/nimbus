import React, { memo, useContext } from "react";
import { View, Text } from "react-native";
import Svg, { Polygon, Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import type { Badge } from "./types";

const HEX_SIZE = 78;

const BadgeHex = memo(({ badge }: { badge: Badge }) => {
  const { newTheme } = useContext(ThemeContext);
  const locked = !badge.unlocked;

  // Hexagon geometry (flat-top)
  const w = HEX_SIZE;
  const h = HEX_SIZE;
  const a = w / 2;
  const b = h / 4;
  const points = `${a},0 ${w},${b} ${w},${3 * b} ${a},${h} 0,${3 * b} 0,${b}`;

  // Colors & styles
  const fillColor = locked ? newTheme.divider : badge.color;
  const iconColor = locked ? newTheme.textSecondary : newTheme.background;
  const overlayBg = locked ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)";

  return (
    <View style={{ alignItems: "center", width: HEX_SIZE, margin: 8 }}>
      {/* Hex shape */}
      <View style={{ borderRadius: 16, overflow: "visible" }}>
        <Svg width={w} height={h}>
          {/* Base hex */}
          <Polygon
            points={points}
            fill={fillColor}
            opacity={locked ? 0.75 : 1}
          />
          {/* Soft inner depth circle */}
          <Circle
            cx={w / 2}
            cy={h / 2}
            r={HEX_SIZE * 0.22}
            fill="#000"
            opacity={0.08}
          />
        </Svg>

        {/* Center icon overlay */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: overlayBg,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={(locked ? "lock-closed" : badge.icon) as any}
              size={20}
              color={iconColor}
            />
          </View>
        </View>
      </View>

      {/* Caption */}
      {badge.title && (
        <Text
          numberOfLines={1}
          style={{
            marginTop: 8,
            fontSize: 12,
            textAlign: "center",
            color: newTheme.textSecondary,
            maxWidth: HEX_SIZE + 8,
          }}
        >
          {badge.title}
        </Text>
      )}
    </View>
  );
});

export default BadgeHex;
