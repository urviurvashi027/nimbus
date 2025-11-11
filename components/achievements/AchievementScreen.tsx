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
import { styles } from "@/components/achievements/styles";
import AchievementCard from "@/components/achievements/AchievementCard";
import BadgeHex from "@/components/achievements/BadgeHex";
import type { ScreenProps } from "@/components/achievements/types";
import { useNavigation } from "expo-router";

export default function AchievementsScreen({
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
    <SafeAreaView style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={s.backBtn}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={newTheme.textPrimary}
          />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} style={s.body}>
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
      </ScrollView>
    </SafeAreaView>
  );
}
