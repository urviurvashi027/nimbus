// src/components/coach/CoachScreen.tsx
import React, { useContext, useMemo } from "react";
import { Platform, View } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import CoachPlaceholder from "@/components/coach/CoachPlaceholder";
import { ScreenView } from "@/components/Themed";
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

// ✅ your existing real screen UI (the one in screenshot)
// import CoachLive from "@/components/coach/CoachLive";
// If your current CoachScreen already IS the live UI, move it to CoachLive and keep this wrapper as CoachScreen.

type Props = {
  data: any; // coach payload (may be empty)
  onBack: () => void;
  onTopic: (t: any) => void;
  onAdvice: (a: any) => void;
  onAsk: () => void;

  // optional
  isPremium?: boolean;
  onUpgrade?: () => void;
};

export default function CoachScreen({
  data,
  onBack,
  onTopic,
  onAdvice,
  onAsk,
  isPremium = false,
  onUpgrade,
}: Props) {
  // const { newTheme } = useContext(ThemeContext);
  const { newTheme, spacing, typography } = useContext(ThemeContext);

  // ✅ decide if we have enough to show live screen
  const hasLiveContent = useMemo(() => {
    const topics = Array.isArray(data?.topics) ? data.topics : [];
    const advice = Array.isArray(data?.advice) ? data.advice : [];
    const insight =
      typeof data?.insight === "string" && data.insight.trim().length > 0;
    console.log("CoachScreen - hasLiveContent:", { insight, topics, advice });
    return insight || topics.length > 0 || advice.length > 0;
  }, [data]);

  if (!hasLiveContent) {
    return (
      <ScreenView
        style={{
          paddingTop:
            Platform.OS === "ios"
              ? spacing["xxl"] + spacing["xxl"] * 0.4
              : spacing.xl,
          paddingHorizontal: spacing.xs,
        }}
      >
        <View style={{ flex: 1, backgroundColor: newTheme.background }}>
          {/* <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing.xl * 3 }}
            showsVerticalScrollIndicator={false}
          > */}
          <CoachPlaceholder
            onBack={() => router.back()}
            // onBack={onBack}
            onAsk={onAsk}
            isPremium={isPremium}
            onUpgrade={onUpgrade}
            stats={{
              daysTracked: data?.stats?.daysTracked,
              habitsActive: data?.stats?.habitsActive,
            }}
          />
          {/* </ScrollView> */}
        </View>
      </ScreenView>
    );
  }

  // ✅ LIVE MODE
  // If your current CoachScreen is already the live UI, paste it here (or import CoachLive).
  return (
    <View style={{ flex: 1, backgroundColor: newTheme.background }}>
      {/* Replace this comment with your real Coach UI */}
      {/* 
        <CoachLive
          data={data}
          onBack={onBack}
          onTopic={onTopic}
          onAdvice={onAdvice}
          onAsk={onAsk}
        /> 
      */}
    </View>
  );
}
