import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PrimaryButton } from "./ui/Buttons";
import ProgressBar from "./ProgressBar";
import ThemeContext from "@/context/ThemeContext";

export type ReadingOverviewCardProps = {
  title?: string; // default: "Reading"
  percent: number; // 0..100
  subtitle?: string; // optional supporting text
  onLogPress?: () => void; // action for CTA
};

const ReadingOverviewCard = ({
  title = "Reading",
  percent,
  subtitle,
  onLogPress,
}: ReadingOverviewCardProps) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  const pct = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.percent}>{pct}%</Text>
      </View>

      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={{ height: 20 }} />
      <ProgressBar percent={pct} />

      <View style={{ height: 14 }} />
      <PrimaryButton title="+ Log Reading time" onPress={onLogPress} />
    </View>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: newTheme.surface, // Nimbus dark card
      borderColor: newTheme.border,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    title: { color: "#F6F7F9", fontSize: 16, fontWeight: "700" },
    percent: { color: "#F6F7F9", fontSize: 16, fontWeight: "800" },
    subtitle: { color: "#9AA3AF", fontSize: 12, marginTop: 4 },
  });
export default ReadingOverviewCard;
