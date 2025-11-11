import React from "react";
import { View } from "react-native";
import TopicCard from "./TopicCard";
import { styles } from "./styles";
import ThemeContext from "@/context/ThemeContext";
import { useContext } from "react";
import type { Topic } from "./types";

export default function TopicsGrid({
  topics,
  onPressTopic,
}: {
  topics: Topic[];
  onPressTopic?: (t: Topic) => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  return (
    <View style={s.topicsWrap}>
      {topics.map((t) => (
        <TopicCard key={t.id} topic={t} onPress={onPressTopic} />
      ))}
    </View>
  );
}
