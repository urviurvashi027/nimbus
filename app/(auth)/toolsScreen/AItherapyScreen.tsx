// src/app/(auth)/Tools/Therapy/AITherapyComingSoonScreen.tsx

import React, { useEffect, useContext } from "react";
import { Platform } from "react-native";
import { useNavigation } from "expo-router";

import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import ComingSoonFeatureScreen from "@/components/tools/common/ComingSoonFeatureScreen";

const AITherapyComingSoonScreen: React.FC = () => {
  const navigation = useNavigation();
  const { spacing } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2 // same as Recipe / Routine / Article
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <ComingSoonFeatureScreen
        onBack={() => navigation.goBack()}
        config={{
          emoji: "🧠",
          title: "AI Therapy",
          subtitle: "Personalized reflections & guidance — powered by AI.",
          description:
            "Nimbus AI will help you process your day, notice emotional patterns, and come back to yourself with gentle prompts.",
          benefits: [
            "Reflect on your feelings with guided, non-judgemental questions.",
            "Spot recurring triggers and celebrate micro-wins over time.",
            "Get grounding exercises tailored to your current mood.",
          ],
          primaryCtaLabel: "Notify me",
          onPrimaryPress: () => {
            console.log("Notify me tapped");
          },
          secondaryCtaLabel: "Learn more",
          onSecondaryPress: () => {
            console.log("Learn more tapped");
          },
          footnote:
            "This feature is rolling out gradually to ensure it stays safe, gentle, and truly helpful.",
          badgeLabel: "Early access soon",
        }}
      />
    </ScreenView>
  );
};

export default AITherapyComingSoonScreen;
