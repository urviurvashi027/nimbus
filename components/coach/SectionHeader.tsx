import React, { useContext } from "react";
import { View, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "./styles";

export default function SectionHeader({ title }: { title: string }) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);
  return (
    <View style={s.sectionHeader}>
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}
