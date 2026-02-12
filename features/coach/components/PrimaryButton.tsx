import React, { useContext } from "react";
import { TouchableOpacity, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "./styles";

export default function PrimaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress?: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  return (
    <TouchableOpacity style={s.ctaBtn} onPress={onPress} activeOpacity={0.9}>
      <Text style={s.ctaText}>{title}</Text>
    </TouchableOpacity>
  );
}
