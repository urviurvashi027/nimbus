// src/components/rewards/RewardDetails.tsx
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { styles } from "@/components/rewards/styles";
import AchievementCard from "@/components/rewards/AchievementCard";
import BadgeHex from "@/components/rewards/BadgeHex";
import type { ScreenProps } from "@/components/rewards/types";
import { useNavigation } from "expo-router";
import RewardsPlaceholder from "./RewardsPlaceholder";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RewardDetails({
  title = "Badges & Achievements",
  onBack,
  achievements = [],
  badges = [],
}: ScreenProps) {
  const { newTheme, spacing } = useContext(ThemeContext);
  const s = styles(newTheme);
  const navigation = useNavigation();

  const FEATURE_REWARDS_ENABLED = false; // until backend ready
  const isPremium = false;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const PAGE_TOP = Platform.OS === "ios" ? 40 : 20;

  return (
    <View
      style={[
        s.screen,
        { paddingTop: PAGE_TOP, paddingHorizontal: spacing.xs },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl }}
        >
          {/* Back */}
          <View style={{ marginBottom: spacing.md }}>
            <TouchableOpacity
              onPress={() => (onBack ? onBack() : navigation.goBack())}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color={newTheme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={s.rewardHeader}>
            <Text style={s.rewardTitle}>{title}</Text>
            <Text style={s.rewardSubtitle}>
              {FEATURE_REWARDS_ENABLED ? title : "Coming soon"}
            </Text>
          </View>

          {!FEATURE_REWARDS_ENABLED ? (
            <RewardsPlaceholder
              isPremium={isPremium}
              onUpgrade={() => console.log("Open paywall")}
              onPreview={() => console.log("Show preview modal")}
            />
          ) : (
            <>
              <Text style={s.sectionTitle}>My Achievements</Text>
              <View style={s.achievementsGrid}>
                {achievements.map((a) => (
                  <AchievementCard key={a.id} item={a} />
                ))}
              </View>

              <Text style={[s.sectionTitle, { marginTop: spacing.lg }]}>
                My Badges
              </Text>
              <View style={s.badgesGrid}>
                {badges.map((b) => (
                  <BadgeHex key={b.id} badge={b} />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
