import React, { useContext, useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";
import {
  getMealDashboard,
  MealDashboardResponse,
  MealDashboardData,
  getDailyMealPlan,
  DayPlan,
  Meal,
} from "@/services/mealService";
import { formatApiDate } from "@/utils/dates";

const { width } = Dimensions.get("window");

/* ---------- Mock Data ---------- */
const MOCK_DASHBOARD: MealDashboardData = {
  period: "Last 30 days",
  days_tracked: 12,
  total_calories_consumed: 15400,
  average_calories: 1283.33,
  today_nutrition: {
    calories: { consumed: 1020, goal: 2000, color: "#6DFF8C" },
    protein: { consumed: 65, goal: 150, color: "#4C8DFF" },
    carbs: { consumed: 110, goal: 250, color: "#FACC15" },
    fats: { consumed: 35, goal: 70, color: "#FB923C" },
    fiber: { consumed: 15, goal: 30, color: "#A78BFA" },
  },
};

const MOCK_MEALS = {
  breakfast: {
    title: "Oatmeal with Berries",
    calories: 350,
    time: "08:00 AM",
    image: "https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg",
  },
  lunch: null, // Empty State
  dinner: {
    title: "Grilled Salmon & Asparagus",
    calories: 520,
    time: "07:30 PM",
    image:
      "https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg",
  },
  snacks: [{ title: "Greek Yogurt", calories: 150, time: "04:00 PM" }],
};

const MealPlannerScreen = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dashboardData, setDashboardData] =
    useState<MealDashboardData>(MOCK_DASHBOARD);
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);

  const fetchDashboardData = async () => {
    try {
      const result = await getMealDashboard(30);
      console.log("Meal Dashboard Response:", JSON.stringify(result, null, 2));
      if (
        result &&
        result.success &&
        result.data &&
        result.data.today_nutrition
      ) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Dashboard API error:", error);
    }
  };

  const fetchDailyPlan = async (date: Date) => {
    try {
      const dateStr = formatApiDate(date);
      console.log(`Fetching daily plan for: ${dateStr}`);
      const result: any = await getDailyMealPlan(dateStr);
      console.log("Daily Plan API Response:", JSON.stringify(result, null, 2));

      if (
        result &&
        result.success &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        setDayPlan(result.data[0]);
      } else if (result && result.success && result.data && !Array.isArray(result.data)) {
        // Handle case where data is a single object instead of array
        setDayPlan(result.data);
      } else {
        setDayPlan(null);
      }
    } catch (error) {
      console.error("Daily Plan API error:", error);
      setDayPlan(null);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch plan when date changes
  useEffect(() => {
    fetchDailyPlan(selectedDate);
  }, [selectedDate]);

  const handleAddMeal = (type: string) => {
    router.push({
      pathname: "/(auth)/toolsScreen/MealCreationScreen",
      params: { type },
    });
  };

  const handlePlanAhead = () => {
    router.push("/(auth)/toolsScreen/MealCreationScreen");
  };

  const handleWeeklyView = () => {
    router.push("/(auth)/toolsScreen/MealWeeklyViewScreen");
  };

  const renderNutrientRing = () => {
    const nutrition = dashboardData.today_nutrition;
    const size = 140;
    const strokeWidth = 10;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(
      nutrition.calories.consumed / nutrition.calories.goal,
      1
    );
    const offset = circumference * (1 - progress);

    return (
      <View style={styles.summaryCard}>
        <View style={styles.ringWrapper}>
          <Svg width={size} height={size}>
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={newTheme.surfaceMuted}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={nutrition.calories.color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="none"
              rotation="-90"
              origin={`${center}, ${center}`}
            />
          </Svg>
          <View style={styles.ringLabel}>
            <Text style={styles.caloriesValue}>
              {nutrition.calories.consumed}
            </Text>
            <Text style={styles.caloriesLabel}>kcal left</Text>
          </View>
        </View>

        <View style={styles.macroCol}>
          {["protein", "carbs", "fats", "fiber"].map((macro) => {
            const data = (nutrition as any)[macro];
            return (
              <View key={macro} style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroName}>
                    {macro.charAt(0).toUpperCase() + macro.slice(1)}
                  </Text>
                  <Text style={styles.macroValue}>
                    {data.consumed}/{data.goal}g
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(
                          (data.consumed / data.goal) * 100,
                          100
                        )}%`,
                        backgroundColor: data.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderMealCard = (type: string, data: Meal | undefined | null) => {
    const iconMap: any = {
      breakfast: "coffee",
      lunch: "white-balance-sunny",
      dinner: "moon-waning-crescent",
      snacks: "apple",
    };

    if (!data) {
      return (
        <TouchableOpacity
          style={styles.ghostCard}
          activeOpacity={0.7}
          onPress={() => handleAddMeal(type)}
        >
          <View style={styles.timelinePoint}>
            <MaterialCommunityIcons
              name={iconMap[type]}
              size={20}
              color={newTheme.textSecondary}
            />
          </View>
          <View style={styles.ghostCardBody}>
            <Text style={styles.ghostText}>Plan your {type}</Text>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={newTheme.accent}
            />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.mealCardContainer}>
        <View style={styles.timelinePointActive}>
          <MaterialCommunityIcons
            name={iconMap[type]}
            size={20}
            color={newTheme.background}
          />
        </View>
        <TouchableOpacity style={styles.mealCard} activeOpacity={0.9}>
          <View style={styles.mealInfo}>
            <Text style={styles.mealType}>{type.toUpperCase()}</Text>
            <Text style={styles.mealTitle}>{data.name}</Text>
            <Text style={styles.mealMeta}>{data.calories ?? 0} kcal</Text>
          </View>
          {data.image && (
            <View style={styles.mealImagePlaceholder}>
              <Ionicons
                name="restaurant-outline"
                size={24}
                color={newTheme.textSecondary}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ToolScreenHeader
          title="Nourish Plan"
          subtitle="Fuel your body with intention."
          onBack={() => router.back()}
          rightIcon="calendar-outline"
          onRightPress={handleWeeklyView}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainScroll}
        >
          {renderNutrientRing()}

          <View style={styles.timelineContainer}>
            <View style={styles.timelineVerticalLine} />
            {renderMealCard("breakfast", dayPlan?.meals?.breakfast)}
            {renderMealCard("lunch", dayPlan?.meals?.lunch)}
            {renderMealCard("dinner", dayPlan?.meals?.dinner)}
            {/* Handle multiple snacks if needed, for now just showing first or the object itself */}
            {renderMealCard(
              "snacks",
              Array.isArray(dayPlan?.meals?.snacks)
                ? dayPlan?.meals?.snacks[0]
                : (dayPlan?.meals?.snacks as unknown as Meal)
            )}
          </View>
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={handlePlanAhead}
        >
          <Ionicons name="add" size={32} color={newTheme.background} />
          <Text style={styles.fabLabel}>Plan Ahead</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    screenTitle: {
      marginBottom: spacing.xl,
    },
    mainScroll: {
      paddingHorizontal: 0,
      paddingBottom: 120,
      paddingTop: spacing.md,
    },
    summaryCard: {
      flexDirection: "row",
      backgroundColor: theme.surface,
      borderRadius: 28,
      padding: spacing.lg,
      marginBottom: spacing.xl,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.divider,
    },
    ringWrapper: {
      justifyContent: "center",
      alignItems: "center",
    },
    ringLabel: {
      position: "absolute",
      alignItems: "center",
    },
    caloriesValue: {
      ...typography.h2,
      fontSize: 24,
      color: theme.textPrimary,
    },
    caloriesLabel: {
      ...typography.caption,
      color: theme.textSecondary,
    },
    macroCol: {
      flex: 1,
      marginLeft: spacing.lg,
      gap: 12,
    },
    macroItem: {},
    macroHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    macroName: {
      ...typography.caption,
      color: theme.textSecondary,
      fontWeight: "600",
    },
    macroValue: {
      ...typography.caption,
      color: theme.textPrimary,
      fontWeight: "700",
    },
    progressBarBg: {
      height: 6,
      backgroundColor: theme.surfaceMuted,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: 3,
    },
    timelineContainer: {
      paddingLeft: 20,
    },
    timelineVerticalLine: {
      position: "absolute",
      left: 30,
      top: 0,
      bottom: 0,
      width: 2,
      backgroundColor: theme.divider,
      opacity: 0.5,
    },
    mealCardContainer: {
      marginBottom: spacing.xl,
      flexDirection: "row",
      alignItems: "center",
    },
    timelinePointActive: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
      marginRight: 16,
    },
    mealCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 24,
      padding: spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.divider,
    },
    mealInfo: {
      flex: 1,
    },
    mealType: {
      ...typography.caption,
      color: theme.accent,
      fontWeight: "800",
      letterSpacing: 1,
      marginBottom: 4,
    },
    mealTitle: {
      ...typography.bodyStrong,
      fontSize: 16,
      color: theme.textPrimary,
    },
    mealMeta: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    mealImagePlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: theme.surfaceElevated,
      justifyContent: "center",
      alignItems: "center",
    },
    ghostCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    timelinePoint: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 2,
      borderColor: theme.divider,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
      marginRight: 16,
    },
    ghostCardBody: {
      flex: 1,
      height: 80,
      borderRadius: 24,
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: theme.divider,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
    },
    ghostText: {
      ...typography.body,
      color: theme.textSecondary,
      fontStyle: "italic",
    },
    fab: {
      position: "absolute",
      bottom: spacing.xl,
      alignSelf: "center",
      backgroundColor: theme.accent,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: 32,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
    fabLabel: {
      ...typography.bodyStrong,
      color: theme.background,
    },
  });

export default MealPlannerScreen;
