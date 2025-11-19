import React, { useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "@/components/rewards/styles";
import AchievementCard from "@/components/rewards/AchievementCard";
import BadgeHex from "@/components/rewards/BadgeHex";
import type { ScreenProps } from "@/components/rewards/types";
import { useNavigation } from "expo-router";

export default function RewardDetails({
  title = "Badges & Achievements",
  onBack,
  achievements = [], // 👈 default
  badges = [], // 👈 default
}: ScreenProps) {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={s.screen}>
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity
          // style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <View style={s.rewardHeader}>
        <Text style={s.rewardTitle}>{title}</Text>
        <Text style={s.rewardSubtitle}>{title}</Text>
      </View>

      {/* Header */}
      {/* <View style={s.header}>
        <Text style={s.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View> */}

      {/* <ScrollView contentContainerStyle={{ paddingBottom: 28 }} style={s.body}> */}
      {/* My Achievements */}
      <Text style={s.sectionTitle}>My Achievements</Text>
      <View style={s.achievementsGrid}>
        {achievements.map((a) => (
          <AchievementCard key={a.id} item={a} />
        ))}
      </View>

      {/* Badges */}
      <Text style={[s.sectionTitle, { marginTop: 18 }]}>My Badges</Text>
      <View style={s.badgesGrid}>
        {badges.map((b) => (
          <BadgeHex key={b.id} badge={b} />
        ))}
      </View>
      {/* </ScrollView> */}
    </View>
  );
}
