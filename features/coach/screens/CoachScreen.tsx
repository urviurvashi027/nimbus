import React, { useContext, useMemo, useState, useEffect } from "react";
import { Platform, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import ThemeContext from "@/contexts/ThemeContext";
import CoachPlaceholder from "../components/CoachPlaceholder";
import CoachLive from "../components/CoachLive";
import { ScreenView } from "@/components/ui/Themed";
import { fetchCoachData } from "../services/coachService";
import type { CoachData, Topic, Advice } from "../types";

export const CoachScreen = () => {
  const { newTheme, spacing } = useContext(ThemeContext);
  const [data, setData] = useState<CoachData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchCoachData();
      setData(res);
    } catch (error) {
      console.error("Failed to fetch coach data:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasLiveContent = useMemo(() => {
    if (!data) return false;
    const topics = Array.isArray(data.topics) ? data.topics : [];
    const advice = Array.isArray(data.advice) ? data.advice : [];
    const insight =
      typeof data.insight === "string" && data.insight.trim().length > 0;
    return insight || topics.length > 0 || advice.length > 0;
  }, [data]);

  const handleBack = () => router.back();
  const handleTopic = (t: Topic) => console.log("Topic selected:", t);
  const handleAdvice = (a: Advice) => console.log("Advice selected:", a);
  const handleAsk = () => console.log("Ask something pressed");
  const handleUpgrade = () => console.log("Upgrade pressed");

  if (loading) {
    return (
      <ScreenView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: newTheme.background,
        }}
      >
        <ActivityIndicator size="large" color={newTheme.accent} />
      </ScreenView>
    );
  }

  if (!hasLiveContent || !data) {
    return (
      <CoachPlaceholder
        onBack={handleBack}
        onAsk={handleAsk}
        isPremium={false}
        onUpgrade={handleUpgrade}
        stats={{
          daysTracked: 0,
          habitsActive: 0,
        }}
      />
    );
  }

  return (
    <CoachLive
      data={data}
      onBack={handleBack}
      onTopic={handleTopic}
      onAdvice={handleAdvice}
      onAsk={handleAsk}
    />
  );
};
