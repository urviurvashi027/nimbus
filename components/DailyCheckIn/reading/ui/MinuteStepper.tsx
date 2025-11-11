import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export function MinuteStepper({
  value,
  onChange,
  min = 5,
  max = 240,
  step = 5,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onChange(clamp(value - step))}
        style={[styles.btn, styles.side]}
      >
        <Text style={styles.btnText}>–</Text>
      </Pressable>
      <Text style={styles.value}>{value} min</Text>
      <Pressable
        onPress={() => onChange(clamp(value + step))}
        style={[styles.btn, styles.side]}
      >
        <Text style={styles.btnText}>+</Text>
      </Pressable>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    wrap: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: newTheme.card,
      borderColor: newTheme.border,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 12,
      paddingHorizontal: 10,
      height: 44,
    },
    side: {
      width: 44,
      height: 32,
      borderRadius: 8,
      backgroundColor: newTheme.background,
      alignItems: "center",
      justifyContent: "center",
    },
    btn: {},
    btnText: { color: "#F6F7F9", fontWeight: "800", fontSize: 18 },
    value: { color: "#F6F7F9", fontWeight: "800" },
  });
