// component/HormoneLevelOverview.tsx
import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";

export default function MentalHealthOverview() {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Mental Health Overview</Text>
      <Text style={styles.subtitle}>Unlocking soon ✨</Text>
      <Text style={styles.helper}>
        A deeper look into your mental health — personalized insights from mood,
        energy, and cycle trends, designed to guide your days.
      </Text>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: newTheme.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: newTheme.divider,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: newTheme.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: "600",
      color: newTheme.accent,
      marginBottom: 8,
    },
    helper: {
      fontSize: 13,
      color: newTheme.textSecondary,
    },
  });
