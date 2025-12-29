// app/achievements.tsx
import React, { useContext } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { useAchievements } from "@/hooks/useAchievements";
import RewardDetails from "@/components/rewards/RewardDetails";

export default function RewardsRoute() {
  const router = useRouter();
  const { newTheme } = useContext(ThemeContext);
  const { data, loading, error, refresh } = useAchievements();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: newTheme.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={newTheme.accent} />
        <Text style={{ color: newTheme.textSecondary, marginTop: 12 }}>
          Loading achievements…
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: newTheme.background,
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Text
          style={{
            color: newTheme.textPrimary,
            fontWeight: "700",
            marginBottom: 6,
          }}
        >
          Something went wrong
        </Text>
        <Text style={{ color: newTheme.textSecondary, marginBottom: 12 }}>
          {String((error as any)?.message ?? error)}
        </Text>
        <TouchableOpacity
          onPress={refresh}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: newTheme.accent,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#0B0B0C", fontWeight: "800" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <RewardDetails
      onBack={() => router.back()}
      achievements={data?.achievements ?? []}
      badges={data?.badges ?? []}
    />
  );
}
