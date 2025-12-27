// app/(auth)/onboarding/welcomeKickoff.tsx
import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";

type Props = { username?: string };

export default function WelcomeKickoff({ username = "You" }: Props) {
  const { newTheme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const s = useMemo(() => styles(newTheme, insets.top), [newTheme, insets.top]);

  return (
    <ScrollView
      style={s.screen}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner */}
      <View style={s.banner}>
        <Ionicons
          name="sparkles-outline"
          size={18}
          color={newTheme.background}
        />
        <Text style={s.bannerText}>All set! Your plan is ready ✨</Text>
      </View>

      {/* Hero */}
      <View style={s.hero}>
        <View style={s.heroCard}>
          <Ionicons
            name="person-circle-outline"
            size={110}
            color={newTheme.accent}
          />
        </View>
      </View>

      {/* Copy */}
      <Text style={s.title}>Welcome, {username} 👋</Text>
      <Text style={s.subtitle}>
        You’re ready to start strong. Build routines, track habits, and grow a
        calmer, healthier you — one day at a time.
      </Text>

      {/* Primary CTA */}
      <StyledButton
        label="Start my first routine"
        style={s.primaryBtn}
        onPress={() => {
          // ✅ Update this to the EXACT route file you have
          // Example if you have: app/(auth)/habit/CreateHabitScreen.tsx
          router.push("/(auth)/habit/CreateHabitScreen");
        }}
      />

      {/* Secondary actions */}
      <View style={s.secondaryRow}>
        <Pressable
          style={s.secondaryBtn}
          onPress={() => router.push("/(auth)/CoachScreen/CoachScreen")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={newTheme.textPrimary}
          />
          <Text style={s.secondaryText}>Ask Nimbus Coach</Text>
        </Pressable>

        <Pressable
          style={s.secondaryBtn}
          onPress={() => router.push("/(auth)/(tabs)/tools")}
        >
          <Ionicons
            name="construct-outline"
            size={18}
            color={newTheme.textPrimary}
          />
          <Text style={s.secondaryText}>Explore Tools</Text>
        </Pressable>
      </View>

      {/* Quick start */}
      <Text style={s.sectionTitle}>Quick start</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <QuickCard
          theme={newTheme}
          icon="water-outline"
          title="Track water"
          caption="Set your daily goal"
          onPress={() => router.push("/(auth)/dailyCheckIn/WaterCheckIn")}
        />
        <QuickCard
          theme={newTheme}
          icon="bed-outline"
          title="Sleep schedule"
          caption="Set bedtime & alarm"
          onPress={() => router.push("/(auth)/dailyCheckIn/SleepCheckIn")}
        />
        <QuickCard
          theme={newTheme}
          icon="leaf-outline"
          title="Meditation"
          caption="Start a 5-min session"
          onPress={() => router.push("/(auth)/dailyCheckIn/MeditationCheckIn")}
        />
      </ScrollView>

      {/* Skip */}
      <Pressable
        style={s.skip}
        onPress={() => router.replace("/(auth)/(tabs)")}
      >
        <Text style={s.skipText}>I’ll explore later</Text>
      </Pressable>
    </ScrollView>
  );
}

function QuickCard({
  icon,
  title,
  caption,
  onPress,
  theme,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  caption: string;
  onPress: () => void;
  theme: any;
}) {
  return (
    <Pressable
      style={[card.card, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View
        style={[
          card.iconWrap,
          { backgroundColor: theme.surfaceMuted ?? theme.cardRaised },
        ]}
      >
        <Ionicons name={icon} size={20} color={theme.accent} />
      </View>
      <Text style={[card.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[card.caption, { color: theme.textSecondary }]}>
        {caption}
      </Text>
    </Pressable>
  );
}

const styles = (t: any, safeTop: number) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: t.background },
    content: {
      paddingTop: safeTop + 16,
      paddingHorizontal: 20,
      paddingBottom: 28,
    },

    banner: {
      alignSelf: "center",
      backgroundColor: t.accent,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    bannerText: { color: t.background, fontWeight: "800" },

    hero: { alignItems: "center", marginBottom: 16 },
    heroCard: {
      width: "100%",
      height: 190,
      borderRadius: 22,
      backgroundColor: t.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: t.borderMuted ?? t.border,
    },

    title: {
      fontSize: 30,
      fontWeight: "900",
      color: t.textPrimary,
      textAlign: "center",
      marginTop: 4,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: t.textSecondary,
      textAlign: "center",
      marginTop: 10,
      marginBottom: 18,
    },

    primaryBtn: { borderRadius: 16 },

    secondaryRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: 12,
    },
    secondaryBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: t.surface,
      borderRadius: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: t.borderMuted ?? t.border,
    },
    secondaryText: { color: t.textPrimary, fontWeight: "700" },

    sectionTitle: {
      marginTop: 18,
      marginBottom: 10,
      color: t.textPrimary,
      fontSize: 16,
      fontWeight: "800",
    },

    skip: { alignSelf: "center", marginTop: 14, paddingVertical: 10 },
    skipText: { color: t.textSecondary, textDecorationLine: "underline" },
  });

const card = StyleSheet.create({
  card: {
    width: 180,
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  caption: { fontSize: 13, fontWeight: "600" },
});
