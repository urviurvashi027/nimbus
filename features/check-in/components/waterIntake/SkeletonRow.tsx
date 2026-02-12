import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

export const SkeletonRow = ({
  pulse,
  theme,
}: {
  pulse: Animated.Value;
  theme: any;
}) => (
  <Animated.View
    style={{
      opacity: pulse,
      height: 60,
      borderRadius: 12,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.divider,
      paddingHorizontal: 14,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    }}
  >
    <View
      style={{
        width: 140,
        height: 10,
        backgroundColor: "#30342C",
        borderRadius: 8,
      }}
    />
    <View
      style={{
        width: 80,
        height: 26,
        backgroundColor: "#2E322B",
        borderRadius: 8,
      }}
    />
  </Animated.View>
);
