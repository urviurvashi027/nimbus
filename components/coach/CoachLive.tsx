import React, { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "./styles";
import InsightCard from "./InsightCard";
import SectionHeader from "./SectionHeader";
import TopicsGrid from "./TopicGrid";
import AdviceList from "./AdviceList";
import PrimaryButton from "./PrimaryButton";
import type { CoachData, Topic, Advice } from "./types";

export default function CoachLive({
  data,
  onBack,
  onTopic,
  onAdvice,
  onAsk,
}: {
  data: CoachData;
  onBack?: () => void;
  onTopic?: (t: Topic) => void;
  onAdvice?: (a: Advice) => void;
  onAsk?: () => void;
}) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  return (
    <SafeAreaView style={s.screen} edges={["top", "left", "right"]}>
      {/* Custom Header */}
      <View style={s.navbar}>
        <TouchableOpacity
          onPress={onBack}
          accessibilityLabel="Go back"
          style={{ position: "absolute", left: 0, padding: 8 }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={newTheme.textPrimary}
          />
        </TouchableOpacity>
        <Text style={s.title}>Coach</Text>
      </View>

      <InsightCard text={data.insight} />

      <SectionHeader title="Explore Coach Topics" />
      <TopicsGrid topics={data.topics} onPressTopic={onTopic} />

      <SectionHeader title="Advice of the Day" />
      <AdviceList items={data.advice} onPressItem={onAdvice} />

      <View style={s.ctaWrap}>
        <PrimaryButton title="Ask something" onPress={onAsk} />
      </View>

      <View style={s.spacerBottom} />
    </SafeAreaView>
  );
}
