// src/app/(auth)/selfCareScreen/Workout/WorkoutSessionScreen.tsx

import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  SafeAreaView,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";

import WorkoutSessionHeader from "@/components/selfCare/workout/WorkoutSessionHeader";
import DifficultyTabs, {
  DifficultyOptionKey,
} from "@/components/selfCare/workout/DifficultyTabs";
import ExerciseIntroCard from "@/components/selfCare/workout/ExerciseIntroCard";
import TimerRing from "@/components/selfCare/workout/TimerRing";
import RestInfoRow, {
  TimerMode,
} from "@/components/selfCare/workout/RestInfoRow";
import WorkoutPrimaryButton from "@/components/selfCare/workout/WorkoutPrimaryButton";
import WorkoutTipBanner from "@/components/selfCare/workout/WorkoutTipBanner";

import { getWorkoutDetails } from "@/services/selfCareService";
import { ActivityIndicator, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Helper to parse "5 min" or "30s" to seconds
const parseTimeToSeconds = (timeStr?: string): number => {
  if (!timeStr) return 0;

  // Handle "5 min", "15 min"
  const minMatch = timeStr.match(/(\d+)\s*min/i);
  if (minMatch) {
    return parseInt(minMatch[1], 10) * 60;
  }

  // Handle "30s", "45s"
  const secMatch = timeStr.match(/(\d+)\s*s/i);
  if (secMatch) {
    return parseInt(secMatch[1], 10);
  }

  return 0;
};

const WorkoutSessionScreen = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const params = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<DifficultyOptionKey>("easy");

  const [mode, setMode] = useState<TimerMode>("workout");
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Fetch workout details
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        if (!params.id) return;
        const result = await getWorkoutDetails(params.id);
        if (result && result.success && result.data) {
          setWorkoutData(result.data);

          // Auto-select first available difficulty if 'easy' isn't there
          if (result.data.variations?.length > 0) {
            const hasEasy = result.data.variations.some(
              (v: any) => v.difficulty === "easy"
            );
            if (!hasEasy) {
              setDifficulty(result.data.variations[0].difficulty);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch workout details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params.id]);

  // Derived current variation based on difficulty
  const currentVariation = useMemo(() => {
    if (!workoutData?.variations) return null;
    return workoutData.variations.find((v: any) => v.difficulty === difficulty);
  }, [workoutData, difficulty]);

  const WORK_DURATION = currentVariation
    ? parseTimeToSeconds(currentVariation.time)
    : 0;
  const REST_DURATION = currentVariation
    ? parseTimeToSeconds(currentVariation.rest_time)
    : 15;

  // Sync timer when variation changes or mode changes
  useEffect(() => {
    if (!currentVariation) return;

    const duration = mode === "workout" ? WORK_DURATION : REST_DURATION;

    setRemaining(duration);
    setIsRunning(false);
    setHasStarted(false);
  }, [currentVariation, WORK_DURATION, REST_DURATION]); // Removed 'mode' to prevent double reset when mode changes naturally

  // Separated mode change sync
  useEffect(() => {
    if (!currentVariation) return;
    const duration = mode === "workout" ? WORK_DURATION : REST_DURATION;
    setRemaining(duration);
  }, [mode]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // countdown effect
  useEffect(() => {
    if (!isRunning || remaining <= 0) return;

    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, remaining]);

  const progressBase = mode === "workout" ? WORK_DURATION : REST_DURATION;
  const progress =
    progressBase > 0 && hasStarted ? 1 - remaining / progressBase : 0;

  const handleToggleTimer = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsRunning(true);
      return;
    }
    if (remaining === 0) {
      const resetTo = mode === "workout" ? WORK_DURATION : REST_DURATION;
      setRemaining(resetTo);
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const handleStartRest = () => {
    if (mode === "rest") {
      setMode("workout");
    } else {
      setMode("rest");
      setRemaining(REST_DURATION);
      setIsRunning(true);
      setHasStarted(true);
    }
  };

  const handleDifficultyChange = (next: DifficultyOptionKey) => {
    setDifficulty(next);
    setMode("workout"); // Always reset to workout mode on difficulty change
    setIsRunning(false);
    setHasStarted(false);
  };

  if (loading) {
    return (
      <ScreenView style={styles.center}>
        <ActivityIndicator size="large" color={newTheme.accent} />
      </ScreenView>
    );
  }

  if (!workoutData) {
    return (
      <ScreenView style={styles.center}>
        <Text style={{ color: newTheme.textPrimary }}>Workout not found.</Text>
      </ScreenView>
    );
  }

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.4
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <WorkoutSessionHeader
            title={workoutData.name}
            onBack={() => navigation.goBack()}
          />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing.xl * 3 }}
            showsVerticalScrollIndicator={false}
          >
            <DifficultyTabs
              activeKey={difficulty}
              onChange={handleDifficultyChange}
              style={{ marginBottom: spacing.lg }}
            />

            {currentVariation ? (
              <>
                <ExerciseIntroCard
                  imageUri={workoutData.image}
                  reps={parseInt(currentVariation.reps || "0", 10)}
                  description={
                    currentVariation.description || workoutData.description
                  }
                  videoSource={currentVariation.gif || currentVariation.video}
                  title={`${currentVariation.title}`}
                />

                <View style={{ alignItems: "center", marginTop: spacing.xl }}>
                  <TimerRing
                    size={260}
                    progress={progress}
                    remainingSeconds={remaining}
                    statusText={
                      mode === "rest"
                        ? remaining === 0
                          ? "Rest done!"
                          : "Rest & breathe"
                        : remaining === 0
                        ? "Nice work!"
                        : isRunning
                        ? "Keep it up!"
                        : "Paused"
                    }
                    mode={mode}
                  />
                </View>

                <RestInfoRow
                  restSeconds={REST_DURATION}
                  mode={mode}
                  remainingSeconds={remaining}
                  onPress={handleStartRest}
                />
              </>
            ) : (
              <View style={[styles.center, { marginTop: 40 }]}>
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color={newTheme.textSecondary}
                />
                <Text
                  style={{
                    color: newTheme.textSecondary,
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  This workout is not available for the {difficulty} level yet.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* <View style={{ height: 10 }} /> */}
          <WorkoutPrimaryButton
            label={
              !hasStarted
                ? "Start"
                : remaining === 0
                ? "Restart"
                : isRunning
                ? "Pause"
                : "Resume"
            }
            onPress={handleToggleTimer}
            isDanger={mode === "workout"}
            style={{ marginTop: spacing.lg }}
            // disabled={!currentVariation}
          />

          {currentVariation && (
            <WorkoutTipBanner
              text={
                currentVariation.tips ||
                "Exhale as you press, inhale as you return.\nYou're doing great — keep it going!"
              }
            />
          )}
        </View>
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default WorkoutSessionScreen;
