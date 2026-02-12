import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ThemeContext from "@/context/ThemeContext";

export default function ProgressBar({ percent }: { percent: number }) {
  const pct = Math.max(0, Math.min(100, percent));

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  return (
    <View style={styles.track}>
      <View style={[styles.fillWrapper, { width: `${pct}%` }]}>
        <LinearGradient
          colors={["#F7C66D", "#F49466", "#FF7A59"]} // Nimbus warm gradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fill}
        />
      </View>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    track: {
      height: 10,
      borderRadius: 10,
      backgroundColor: newTheme.card,
      overflow: "hidden",
    },
    fillWrapper: { height: "100%" },
    fill: { height: "100%", borderRadius: 10 },
  });
