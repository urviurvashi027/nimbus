// src/app/(auth)/selfCareScreen/Workout/WorkoutListScreen.tsx

import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  View,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";

import { ScreenView } from "@/components/Themed";
import WorkoutCard, {
  DifficultyLevel,
} from "@/components/selfCare/workout/WorkoutCard";
import FilterPill from "@/components/selfCare/workout/FilterPill";
import WorkoutHeader from "@/components/selfCare/workout/WorkoutHeader";

import { getWorkoutVideo } from "@/services/selfCareService";

/* ---------- Types ---------- */

type WorkoutCategory = "cardio" | "strength" | "stretching" | "full_body";

interface WorkoutApiItem {
  id: number;
  title: string;
  image: string;
  coach_name: string;
  category: string; // "workout", "strength", etc.
  duration: number; // minutes
  description: string;
  source: string;
}

/* ---------- Demo dataset (same shape as backend) ---------- */

const DEMO_WORKOUTS: WorkoutApiItem[] = [
  {
    id: 101,
    title: "Dumbbell Shoulder Press",
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    coach_name: "Kelly Pahuja",
    category: "strength",
    duration: 12,
    description:
      "Build upper-body strength and improve shoulder stability using controlled dumbbell movements.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/shoulder_press.mp4",
  },
  {
    id: 102,
    title: "Bench Press Basics",
    image: "https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg",
    coach_name: "Alex Carter",
    category: "strength",
    duration: 10,
    description:
      "A foundational movement to build chest, triceps, and pushing power.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/bench_press.mp4",
  },
  {
    id: 103,
    title: "Kettlebell Swing Power",
    image: "https://images.pexels.com/photos/4164469/pexels-photo-4164469.jpeg",
    coach_name: "Samira Lopez",
    category: "strength",
    duration: 8,
    description:
      "Explosive hip hinge movement to build glutes, hamstrings, and total-body power.",
    source: "https://nimbus-fe-assets.s3.amazonaws.com/workouts/kb_swing.mp4",
  },
  {
    id: 201,
    title: "HIIT Fat Burner",
    image: "https://images.pexels.com/photos/4761664/pexels-photo-4761664.jpeg",
    coach_name: "Mia Johnson",
    category: "cardio",
    duration: 15,
    description:
      "High-intensity intervals designed to elevate your heart rate and burn calories fast.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/hiit_burner.mp4",
  },
  {
    id: 202,
    title: "Jump Rope Conditioning",
    image: "https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg",
    coach_name: "Ryan Hall",
    category: "cardio",
    duration: 10,
    description:
      "Improve coordination, agility, and cardiovascular endurance with jump rope cycles.",
    source: "https://nimbus-fe-assets.s3.amazonaws.com/workouts/jump_rope.mp4",
  },
  {
    id: 203,
    title: "Treadmill Speed Intervals",
    image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg",
    coach_name: "Katie Brooks",
    category: "cardio",
    duration: 12,
    description:
      "Push your pace with controlled speed bursts and active recovery.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/speed_intervals.mp4",
  },
  {
    id: 301,
    title: "Full Body Mobility Flow",
    image: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
    coach_name: "Lara Kim",
    category: "stretching",
    duration: 14,
    description:
      "Gentle mobility movements to restore flexibility and reduce stiffness.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/mobility_flow.mp4",
  },
  {
    id: 302,
    title: "Lower Back Release",
    image: "https://images.pexels.com/photos/4325468/pexels-photo-4325468.jpeg",
    coach_name: "Daniel Wu",
    category: "stretching",
    duration: 8,
    description:
      "Targeted stretches to ease tension and improve lumbar mobility.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/back_release.mp4",
  },
  {
    id: 303,
    title: "Hamstring Stretch Routine",
    image: "https://images.pexels.com/photos/6453399/pexels-photo-6453399.jpeg",
    coach_name: "Ava Singh",
    category: "stretching",
    duration: 6,
    description:
      "Improve hamstring flexibility and reduce tightness in your legs.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/hamstring_stretch.mp4",
  },
  {
    id: 401,
    title: "Full Body Burner",
    image: "https://images.pexels.com/photos/269977/pexels-photo-269977.jpeg",
    coach_name: "Mark Jacobs",
    category: "full_body",
    duration: 18,
    description:
      "An energetic flow mixing strength, cardio, and mobility for a complete workout.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/fullbody_burner.mp4",
  },
  {
    id: 402,
    title: "Bodyweight Sculpt",
    image: "https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg",
    coach_name: "Nora Patel",
    category: "full_body",
    duration: 20,
    description:
      "High-repetition bodyweight movements to tone your entire body with no equipment.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/bodyweight_sculpt.mp4",
  },
  {
    id: 403,
    title: "Core + Glutes Activation",
    image: "https://images.pexels.com/photos/6453398/pexels-photo-6453398.jpeg",
    coach_name: "Leo Martin",
    category: "full_body",
    duration: 12,
    description:
      "Strengthen your entire midsection with glute and core engagement circuits.",
    source:
      "https://nimbus-fe-assets.s3.amazonaws.com/workouts/core_glutes.mp4",
  },
];

/* ---------- UI model & mapping ---------- */

interface WorkoutCardModel {
  id: number;
  title: string;
  coachName: string;
  imageUri: string;
  durationSeconds: number;
  reps: number;
  difficulty: DifficultyLevel;
  category: WorkoutCategory;
  description: string;
  source: string;
}

const FILTERS: { id: WorkoutCategory; label: string }[] = [
  { id: "cardio", label: "Cardio" },
  { id: "strength", label: "Strength" },
  { id: "stretching", label: "Stretching" },
  { id: "full_body", label: "Full Body" },
];

const CATEGORY_DEFAULTS: Record<
  WorkoutCategory,
  { difficulty: DifficultyLevel; durationSeconds: number; reps: number }
> = {
  strength: { difficulty: "medium", durationSeconds: 30, reps: 4 },
  cardio: { difficulty: "easy", durationSeconds: 45, reps: 0 },
  stretching: { difficulty: "easy", durationSeconds: 40, reps: 0 },
  full_body: { difficulty: "hard", durationSeconds: 30, reps: 4 },
};

const mapBackendCategory = (backendCategory: string): WorkoutCategory => {
  switch (backendCategory.toLowerCase()) {
    case "cardio":
      return "cardio";
    case "stretch":
    case "stretching":
      return "stretching";
    case "full_body":
    case "full body":
    case "workout":
      return "full_body";
    case "strength":
    default:
      return "strength";
  }
};

const mapWorkoutToCardModel = (item: WorkoutApiItem): WorkoutCardModel => {
  const category = mapBackendCategory(item.category);
  const defaults = CATEGORY_DEFAULTS[category];

  return {
    id: item.id,
    title: item.title,
    coachName: item.coach_name,
    imageUri: item.image,
    category,
    difficulty: defaults.difficulty,
    durationSeconds: item.duration
      ? item.duration * 60
      : defaults.durationSeconds,
    reps: defaults.reps,
    description: item.description,
    source: item.source,
  };
};

/* ---------- Screen component ---------- */

const WorkoutListScreen = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<WorkoutCategory>("strength");
  const [rawWorkouts, setRawWorkouts] = useState<
    WorkoutApiItem[] | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchWorkouts = async () => {
    try {
      setIsLoading(true);
      const result = await getWorkoutVideo(); // backend items

      if (result && Array.isArray(result)) {
        // ✅ MERGE BACKEND + DEMO DATA
        const merged: WorkoutApiItem[] = [...result, ...DEMO_WORKOUTS];
        setRawWorkouts(merged);
      } else {
        console.error("Workout API response is not an array:", result);
        // fallback to demo only
        setRawWorkouts(DEMO_WORKOUTS);
      }
    } catch (err) {
      console.error("Workout API error:", err);
      // on error, still show demo
      setRawWorkouts(DEMO_WORKOUTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const workoutCards: WorkoutCardModel[] = useMemo(() => {
    if (!rawWorkouts) return [];
    return rawWorkouts.map(mapWorkoutToCardModel);
  }, [rawWorkouts]);

  const filteredWorkouts = useMemo(
    () => workoutCards.filter((w) => w.category === selectedCategory),
    [workoutCards, selectedCategory]
  );

  const handleStartWorkout = (workout: WorkoutCardModel) => {
    console.log("Start workout:", workout.id);

    router.push({
      pathname: "/(auth)/selfCareScreen/WorkoutSessionScreen",
      params: {
        id: workout.id.toString(),
        title: workout.title,
        imageUri: workout.imageUri,
        description: workout.description,
        reps: workout.reps.toString(),
        durationSeconds: workout.durationSeconds.toString(),
      },
    });
  };

  const renderListHeader = () => (
    <View>
      <FlatList
        data={FILTERS}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item }) => (
          <FilterPill
            label={item.label}
            isActive={selectedCategory === item.id}
            onPress={() => setSelectedCategory(item.id)}
          />
        )}
      />
    </View>
  );

  /* Loading state */
  if (isLoading) {
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
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Workouts</Text>
            </View>
            <Text style={styles.loadingText}>Loading workouts...</Text>
          </View>
        </SafeAreaView>
      </ScreenView>
    );
  }

  /* Loaded state */
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
          <WorkoutHeader onBack={() => navigation.goBack()} />

          <FlatList
            data={filteredWorkouts}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderListHeader}
            renderItem={({ item }) => (
              <WorkoutCard
                title={item.title}
                imageUri={item.imageUri}
                durationSeconds={item.durationSeconds}
                reps={item.reps}
                difficulty={item.difficulty}
                onPressStart={() => handleStartWorkout(item)}
              />
            )}
            contentContainerStyle={{
              paddingBottom: spacing.xl * 2,
            }}
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
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    backText: {
      fontSize: 24,
      color: newTheme.textPrimary,
      marginRight: spacing.sm,
    },
    headerTitle: {
      ...typography.h2,
      color: newTheme.textPrimary,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: newTheme.textSecondary,
    },
    sectionAction: {
      ...typography.bodySmall,
      color: newTheme.accent,
    },
    filterRow: {
      paddingBottom: spacing.md,
    },
    loadingText: {
      ...typography.body,
      color: newTheme.textSecondary,
    },
  });

export default WorkoutListScreen;
