import React, { useContext } from "react";
import { View, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "./styles";

export default function InsightCard({ text }: { text: string }) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);
  return (
    <View style={s.insightCard}>
      <View style={s.insightRow}>
        <View style={s.insightGlow} />
        <Text style={s.insightText}>{text}</Text>
      </View>
    </View>
  );
}
