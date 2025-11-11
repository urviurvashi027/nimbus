import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";

export const InfoRow = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={{ gap: 4 }}>
      <Text style={styles.infoTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.infoSubtitle}>{subtitle}</Text>}
    </View>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    infoTitle: { color: newTheme.textPrimary, fontSize: 14, fontWeight: "700" },
    infoSubtitle: { color: newTheme.textSecondary, fontSize: 12 },
  });
