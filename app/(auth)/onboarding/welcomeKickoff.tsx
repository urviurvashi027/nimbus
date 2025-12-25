// app/(auth)/OnBoarding/WelcomeKickoffScreen.tsx
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";

type Props = {
  username?: string;
};

const WelcomeKickoffScreen: React.FC<Props> = ({ username = "You" }) => {
  const { newTheme } = useContext(ThemeContext);
  const s = styles(newTheme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScreenView style={s.container}>
      {/* Header / Congrats strip */}
      <View style={s.banner}>
        <Ionicons
          name="sparkles-outline"
          size={20}
          color={newTheme.background}
        />
        <Text style={s.bannerText}>All set! Your plan is ready ✨</Text>
      </View>

      {/* Hero */}
      <View style={s.heroWrap}>
        {/* If you have an illustration asset, swap this Image out. */}
        {/* <Image source={require("@/assets/images/onboarding/hero-meditate.png")} style={s.hero} resizeMode="contain" /> */}
        <View style={s.heroPlaceholder}>
          <Ionicons
            name="person-circle-outline"
            size={96}
            color={newTheme.accent}
          />
        </View>
      </View>

      {/* Headline */}
      <View style={s.headerBlock}>
        <Text style={s.title}>Welcome, {username} 👋</Text>
        <Text style={s.subtitle}>
          You’re ready to start strong. Build routines, track habits, and grow a
          calmer, healthier you — one day at a time.
        </Text>
      </View>

      {/* Primary CTA */}
      <StyledButton
        label="Start my first routine"
        onPress={() => router.push("/(auth)/habit/CreateHabitScreen")} // ⬅️ adjust if your route differs
        style={s.primaryBtn}
      />

      {/* Secondary quick actions */}
      <View style={s.secondaryBlock}>
        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => router.push("/(auth)/CoachScreen/CoachScreen")}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={18}
            color={newTheme.textPrimary}
          />
          <Text style={s.secondaryText}>Ask Nimbus Coach</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => console.log("Explore Tools pressed")} // ⬅️ replace with actual navigation
        >
          <Ionicons
            name="construct-outline"
            size={18}
            color={newTheme.textPrimary}
          />
          <Text style={s.secondaryText}>Explore Tools</Text>
        </TouchableOpacity>
      </View>

      {/* Quick start cards */}
      <Text style={s.sectionTitle}>Quick start</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <QuickCard
          icon="water-outline"
          title="Track water"
          caption="Set your daily goal"
          onPress={() => router.push("/(auth)/dailyCheckIn/WaterCheckIn")}
          theme={newTheme}
        />
        <QuickCard
          icon="bed-outline"
          title="Sleep schedule"
          caption="Set bedtime & alarm"
          onPress={() => router.push("/(auth)/dailyCheckIn/SleepCheckIn")}
          theme={newTheme}
        />
        <QuickCard
          icon="leaf-outline"
          title="Meditation"
          caption="Start a 5-min session"
          onPress={() => router.push("/(auth)/dailyCheckIn/MeditationCheckIn")}
          theme={newTheme}
        />
      </ScrollView>

      {/* Skip / later */}
      <TouchableOpacity
        style={s.skip}
        onPress={() => router.replace("/(auth)/(tabs)") /* Home route */}
      >
        <Text style={s.skipText}>I’ll explore later</Text>
      </TouchableOpacity>
    </ScreenView>
  );
};

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
    <TouchableOpacity
      style={[cardStyles.card, { backgroundColor: theme.surface }]}
      onPress={onPress}
    >
      <View
        style={[
          cardStyles.iconWrap,
          { backgroundColor: theme.surfaceMuted ?? "#2a2f37" },
        ]}
      >
        <Ionicons name={icon} size={20} color={theme.accent} />
      </View>
      <Text style={[cardStyles.title, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <Text style={[cardStyles.caption, { color: theme.textSecondary }]}>
        {caption}
      </Text>
    </TouchableOpacity>
  );
}

const styles = (t: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 56,
      paddingHorizontal: 20,
      backgroundColor: t.background,
      flex: 1,
    },
    banner: {
      alignSelf: "center",
      backgroundColor: t.accent,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 14,
    },
    bannerText: { color: t.background, fontWeight: "700" },
    heroWrap: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 8,
      marginBottom: 12,
    },
    hero: { width: "86%", height: 180 },
    heroPlaceholder: {
      width: "86%",
      height: 180,
      borderRadius: 24,
      backgroundColor: t.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    headerBlock: {
      alignItems: "center",
      marginTop: 8,
      marginBottom: 20,
      paddingHorizontal: 6,
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: t.textPrimary,
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: t.textSecondary,
      textAlign: "center",
    },
    primaryBtn: { marginTop: 8 },
    secondaryBlock: {
      marginTop: 14,
      flexDirection: "row",
      gap: 12,
      justifyContent: "center",
    },
    secondaryBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: t.surface,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
    },
    secondaryText: { color: t.textPrimary, fontWeight: "600" },
    sectionTitle: {
      color: t.textPrimary,
      fontSize: 16,
      fontWeight: "700",
      marginTop: 22,
      marginBottom: 10,
      paddingLeft: 4,
    },
    skip: { alignSelf: "center", marginTop: 14 },
    skipText: { color: t.textSecondary, textDecorationLine: "underline" },
  });

const cardStyles = StyleSheet.create({
  card: {
    width: 180,
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  caption: { fontSize: 13 },
});

export default WelcomeKickoffScreen;
