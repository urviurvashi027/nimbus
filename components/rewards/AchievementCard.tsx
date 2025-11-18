import React, { memo, useContext } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "./styles";
import type { Achievement } from "./types";

export default memo(function AchievementCard({ item }: { item: Achievement }) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  return (
    <View style={s.achievementCard}>
      <View style={s.iconCircle}>
        <Ionicons name={item.icon as any} size={20} color={newTheme.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.metricText}>{item.value}</Text>
        <Text style={s.metricLabel} numberOfLines={1}>
          {item.label}
        </Text>
      </View>
    </View>
  );
});
