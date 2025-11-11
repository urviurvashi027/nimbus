import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

export const SkeletonCard = ({
  pulse,
  theme,
  height = 140,
}: {
  pulse: Animated.Value;
  theme: any;
  height?: number;
}) => (
  <Animated.View
    style={{
      opacity: pulse,
      height,
      borderRadius: 16,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.divider,
      padding: 14,
      justifyContent: "space-between",
    }}
  >
    <View
      style={{
        width: 120,
        height: 12,
        backgroundColor: "#2E322B",
        borderRadius: 8,
      }}
    />
    <View
      style={{
        width: "100%",
        height: 10,
        backgroundColor: "#30342C",
        borderRadius: 8,
        marginTop: 10,
      }}
    />
    <View
      style={{
        width: "65%",
        height: 10,
        backgroundColor: "#30342C",
        borderRadius: 8,
        marginTop: 8,
      }}
    />
  </Animated.View>
);
