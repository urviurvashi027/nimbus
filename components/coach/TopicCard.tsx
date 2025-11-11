import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "./styles";
import type { Topic } from "./types";

export default function TopicCard({
  topic,
  onPress,
}: {
  topic: Topic;
  onPress?: (t: Topic) => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress?.(topic)}
      style={s.topicCard}
    >
      <View style={s.topicRow}>
        <Text numberOfLines={2} style={s.topicText}>
          {topic.title}
        </Text>
        <View style={s.topicIconWrap}>
          <Ionicons
            name={(topic.icon ?? "link-outline") as any}
            size={16}
            color={newTheme.accent}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
