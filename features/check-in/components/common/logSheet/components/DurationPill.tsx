import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";

export const DurationPill = ({ minutes }: { minutes: number }) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return (
    <View style={styles.duration}>
      <Text style={styles.durationText}>
        Duration: {hours}h {mins.toString().padStart(2, "0")}m
      </Text>
    </View>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    duration: {
      alignSelf: "flex-start",
      backgroundColor: "rgba(163,190,140,0.16)",
      borderColor: newTheme.border,
      borderWidth: StyleSheet.hairlineWidth,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      marginVertical: 4,
    },
    durationText: { color: newTheme.accent, fontSize: 12, fontWeight: "800" },
  });
