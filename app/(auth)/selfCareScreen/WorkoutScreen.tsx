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

import { getWorkoutVideo, getWorkouts } from "@/services/selfCareService";

/* ---------- Types ---------- */

type WorkoutCategory = "all" | "cardio" | "strength" | "yoga" | "full_body" | "other";

interface RoutineItem {
  id: number;
  difficulty: DifficultyLevel;
  title: string;
  description: string;
  reps: string;
  time: string;
  tips: string;
  gif: string | null;
}

interface WorkoutApiItem {
  id: number;
  name: string;
  description: string;
  category: string;
  category_display: string;
  image: string;
  is_active: boolean;
  routines: RoutineItem[];
}

/* ---------- Demo dataset (New API structure) ---------- */

const DEMO_WORKOUTS: WorkoutApiItem[] = [
  {
    id: 1,
    name: "Squat",
    description: "A fundamental lower body exercise...",
    category: "strength",
    category_display: "Strength",
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg",
    is_active: true,
    routines: [
      {
        id: 101,
        difficulty: "easy",
        title: "Air Squat",
        description: "Perform squats using only bodyweight...",
        reps: "15",
        time: "5 min",
        tips: "Keep your back straight.",
        gif: null,
      },
      {
        id: 102,
        difficulty: "medium",
        title: "Goblet Squat",
        description: "Hold a weight at chest level...",
        reps: "12",
        time: "15 min",
        tips: "Keep chest up.",
        gif: null,
      },
    ],
  },
  {
    id: 2,
    name: "Push Up",
    description: "Foundational upper body pushing movement.",
    category: "strength",
    category_display: "Strength",
    image: "https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg",
    is_active: true,
    routines: [
      {
        id: 201,
        difficulty: "medium",
        title: "Standard Push Up",
        description: "Focus on core stability and full range of motion.",
        reps: "10",
        time: "3 min",
        tips: "Don't let your hips sag.",
        gif: null,
      },
    ],
  },
];

/* ---------- UI model & mapping ---------- */

interface WorkoutCardModel {
  id: number;
  title: string;
  imageUri: string;
  durationSeconds: number;
  reps: number;
  difficulty: DifficultyLevel;
  category: WorkoutCategory;
  description: string;
  routines: RoutineItem[];
}

const FILTERS: { id: WorkoutCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "cardio", label: "Cardio" },
  { id: "strength", label: "Strength" },
  { id: "yoga", label: "Yoga" },
  { id: "full_body", label: "Full Body" },
];

const parseTimeToSeconds = (timeStr?: string): number => {
  if (!timeStr) return 0;
  // Handle "5 min", "15 min"
  const match = timeStr.match(/(\d+)\s*min/i);
  if (match) {
    return parseInt(match[1], 10) * 60;
  }
  return 0;
};

const mapWorkoutToCardModel = (item: WorkoutApiItem): WorkoutCardModel => {
  // Use first routine for card metadata (preview)
  const firstRoutine = item.routines?.[0];
  
  return {
    id: item.id,
    title: item.name,
    imageUri: item.image,
    category: item.category as WorkoutCategory,
    difficulty: firstRoutine?.difficulty || "easy",
    durationSeconds: parseTimeToSeconds(firstRoutine?.time),
    reps: parseInt(firstRoutine?.reps || "0", 10),
    description: item.description,
    routines: item.routines || [],
  };
};

/* ---------- Screen component ---------- */

const WorkoutListScreen = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<WorkoutCategory>("all");
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
      // Fetch from new endpoint
      const result = await getWorkouts(); 

      if (result && result.success && Array.isArray(result.data)) {
        // We can still merge or just use API data
        // For now, we'll use API data if available, otherwise fallback
        setRawWorkouts(result.data.length > 0 ? result.data : DEMO_WORKOUTS);
      } else {
        console.error("Workout API error or invalid data:", result);
        setRawWorkouts(DEMO_WORKOUTS);
      }
    } catch (err) {
      console.error("Workout API error:", err);
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
    () =>
      selectedCategory === "all"
        ? workoutCards
        : workoutCards.filter((w) => w.category === selectedCategory),
    [workoutCards, selectedCategory]
  );

  const handleStartWorkout = (workout: WorkoutCardModel) => {
    console.log("Start workout:", workout.id);
    
    router.push({
      pathname: "/(auth)/selfCareScreen/WorkoutSessionScreen",
      params: {
        id: workout.id.toString(),
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
