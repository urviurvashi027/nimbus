import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "./styles";
import type { Advice } from "./types";

export default function AdviceItem({
  item,
  onPress,
}: {
  item: Advice;
  onPress?: (a: Advice) => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  return (
    <TouchableOpacity
      style={s.adviceCard}
      activeOpacity={0.9}
      onPress={() => onPress?.(item)}
    >
      <View style={s.adviceRow}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={s.adviceText}>
            {item.title}
          </Text>
          {item.subtitle ? (
            <Text numberOfLines={1} style={s.adviceSub}>
              {item.subtitle}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={newTheme.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}
