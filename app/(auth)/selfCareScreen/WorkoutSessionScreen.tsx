// src/app/(auth)/selfCareScreen/Workout/WorkoutSessionScreen.tsx

import React, { useContext, useEffect, useState } from "react";
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

const WorkoutSessionScreen = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    imageUri?: string;
    description?: string;
    reps?: string;
    durationSeconds?: string; // seconds
  }>();

  const exercise = {
    id: params.id ? Number(params.id) : 0,
    title: params.title ?? "Workout",
    imageUri:
      params.imageUri ??
      "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    description:
      params.description ??
      "Follow the movement at your own pace, focusing on form and control.",
    reps: params.reps ? Number(params.reps) : 4,
    durationSeconds: params.durationSeconds
      ? Number(params.durationSeconds)
      : 30,
  };

  // durations in seconds
  const WORK_DURATION = exercise.durationSeconds;
  const REST_DURATION = 15;

  const [mode, setMode] = useState<TimerMode>("workout");
  const [difficulty, setDifficulty] = useState<DifficultyOptionKey>("easy");

  const [remaining, setRemaining] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false); // start stopped
  const [hasStarted, setHasStarted] = useState(false); // for "Start" label

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
  const progress = 1 - remaining / progressBase;

  const handleToggleTimer = () => {
    // first ever press -> start workout
    if (!hasStarted) {
      setHasStarted(true);
      setIsRunning(true);
      return;
    }

    // finished -> restart current mode
    if (remaining === 0) {
      const resetTo = mode === "workout" ? WORK_DURATION : REST_DURATION;
      setRemaining(resetTo);
      setIsRunning(true);
      return;
    }

    // pause / resume
    setIsRunning((prev) => !prev);
  };

  const handleStartRest = () => {
    if (mode === "rest") {
      // 🔙 back to exercise timer
      setMode("workout");
      setRemaining(WORK_DURATION);
      setIsRunning(false);
    } else {
      // ▶ start rest timer
      setMode("rest");
      setRemaining(REST_DURATION);
      setIsRunning(true);
      setHasStarted(true);
    }
  };

  const buttonLabel = !hasStarted
    ? "Start"
    : remaining === 0
    ? "Restart"
    : isRunning
    ? "Pause"
    : "Resume";

  const statusText =
    mode === "rest"
      ? remaining === 0
        ? "Rest done!"
        : "Rest & breathe"
      : remaining === 0
      ? "Nice work!"
      : isRunning
      ? "Keep it up!"
      : "Paused";

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
            title={exercise.title}
            onBack={() => navigation.goBack()}
          />

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: spacing.xl * 3 }}
            showsVerticalScrollIndicator={false}
          >
            <DifficultyTabs
              activeKey={difficulty}
              onChange={setDifficulty}
              style={{ marginBottom: spacing.lg }}
            />

            <ExerciseIntroCard
              imageUri={exercise.imageUri}
              reps={exercise.reps}
              description={exercise.description}
            />

            <View style={{ alignItems: "center", marginTop: spacing.xl }}>
              <TimerRing
                size={260}
                progress={progress}
                remainingSeconds={remaining}
                statusText={statusText}
                mode={mode}
              />
            </View>

            <RestInfoRow
              restSeconds={REST_DURATION}
              mode={mode}
              remainingSeconds={remaining}
              onPress={handleStartRest}
            />
          </ScrollView>

          <WorkoutPrimaryButton
            label={buttonLabel}
            onPress={handleToggleTimer}
            isDanger={mode === "workout"}
          />

          <WorkoutTipBanner
            text={
              "Exhale as you press, inhale as you return.\nYou're doing great — keep it going!"
            }
          />
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
  });

export default WorkoutSessionScreen;
