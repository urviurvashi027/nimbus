import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export const ErrorCard = ({
  theme,
  message,
  onRetry,
}: {
  theme: any;
  message: string;
  onRetry: () => void;
}) => (
  <View
    style={{
      borderRadius: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.error,
      backgroundColor: "#2a1f21",
      padding: 14,
      gap: 10,
    }}
  >
    <Text style={{ color: theme.textPrimary, fontWeight: "600" }}>
      Couldn’t load water check-in
    </Text>
    <Text style={{ color: theme.textSecondary }}>{message}</Text>
    <TouchableOpacity
      onPress={onRetry}
      style={{
        alignSelf: "flex-start",
        backgroundColor: theme.accent,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: "#10120E", fontWeight: "800" }}>Retry</Text>
    </TouchableOpacity>
  </View>
);
