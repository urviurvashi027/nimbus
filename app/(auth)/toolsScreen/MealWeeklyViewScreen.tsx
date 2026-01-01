import React, { useContext, useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  LayoutAnimation,
  Share,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";
import { formatDay, formatApiDate } from "@/utils/dates";
import { getWeeklyMealPlan, DayPlan, Meal } from "@/services/mealService";

/* ---------- Mock Data for Fallback ---------- */
const MOCK_WEEKLY_DATA: any[] = [
  {
    id: 101,
    date: new Date().toISOString(),
    calories: 1850,
    status: "Fully Planned",
    meals: {
      breakfast: { title: "Oatmeal & Berries" },
      lunch: { title: "Chicken Salad" },
      dinner: { title: "Grilled Salmon" },
      snacks: [],
    },
    total_calories: 1850,
  },
  {
    id: 102,
    date: new Date(Date.now() + 86400000).toISOString(),
    calories: 1200,
    status: "1 Empty Slot",
    meals: {
      breakfast: { title: "Greek Yogurt" },
      lunch: null,
      dinner: { title: "Quinoa Bowl" },
      snacks: [],
    },
    total_calories: 1200,
  },
  {
    id: 103,
    date: new Date(Date.now() + 172800000).toISOString(),
    calories: 0,
    status: "Not Planned",
    meals: {
      breakfast: null,
      lunch: null,
      dinner: null,
      snacks: [],
    },
    total_calories: 0,
  },
];

const MealWeeklyViewScreen = () => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const today = formatApiDate(new Date());
      const data = await getWeeklyMealPlan(today);
      
      if (Array.isArray(data) && data.length > 0) {
        setWeeklyPlan(data);
      } else {
        // Fallback to mock data if API returns empty
        setWeeklyPlan(MOCK_WEEKLY_DATA as unknown as DayPlan[]);
      }
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      // Fallback on error
      setWeeklyPlan(MOCK_WEEKLY_DATA as unknown as DayPlan[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const onSharePlan = async (data: DayPlan) => {
    try {
      const getMealTitle = (m: Meal | null) => m?.title || "Not planned";
      const message =
        `My Meal Plan for ${new Date(data.date).toDateString()}:\n` +
        `Breakfast: ${getMealTitle(data.meals.breakfast)}\n` +
        `Lunch: ${getMealTitle(data.meals.lunch)}\n` +
        `Dinner: ${getMealTitle(data.meals.dinner)}\n` +
        `Total Calories: ${data.total_calories} kcal`;

      await Share.share({ message });
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusInfo = (status: string) => {
    if (status === "Fully Planned")
      return { icon: "checkmark-circle", color: "#6DFF8C" };
    if (status === "Not Planned")
      return { icon: "help-circle-outline", color: newTheme.textSecondary };
    return { icon: "alert-circle-outline", color: "#FACC15" };
  };

  const renderAccordionItem = (data: DayPlan, index: number) => {
    const isExpanded = expandedIndex === index;
    const statusInfo = getStatusInfo(data.status);
    const dateObj = new Date(data.date);

    return (
      <View
        key={data.id || index}
        style={[styles.accordionCard, isExpanded && styles.accordionCardActive]}
      >
        <TouchableOpacity
          onPress={() => toggleAccordion(index)}
          style={styles.accordionHeader}
          activeOpacity={0.7}
        >
          <View style={styles.headerDateBox}>
            <Text style={styles.headerDay}>{formatDay(dateObj)}</Text>
            <Text style={styles.headerDate}>
              {dateObj.getDate()}{" "}
              {dateObj.toLocaleString("default", { month: "short" })}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.headerCalories}>{data.total_calories} kcal</Text>
            <View style={styles.statusRow}>
              <Ionicons
                name={statusInfo.icon as any}
                size={14}
                color={statusInfo.color}
              />
              <Text style={[styles.headerStatus, { color: statusInfo.color }]}>
                {data.status}
              </Text>
            </View>
          </View>

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.accordionContent}>
            <View style={styles.divider} />

            <View style={styles.mealsList}>
              {["breakfast", "lunch", "dinner"].map((type) => {
                const meal = (data.meals as any)[type] as Meal | null;
                return (
                  <View key={type} style={styles.mealRow}>
                    <View style={styles.mealTypeLabel}>
                      <Text style={styles.mealTypeText}>
                        {type.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={[ 
                        styles.mealTitle,
                        !meal && styles.mealPlaceholder,
                      ]}
                    >
                      {meal?.title || `No ${type} planned`}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/(auth)/toolsScreen/MealCreationScreen",
                          params: {
                            type: type.charAt(0).toUpperCase() + type.slice(1),
                            date: data.date,
                            foodName: meal?.title || "",
                          },
                        })
                      }
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color={newTheme.accent}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {/* Snacks summary */}
              {data.meals.snacks?.length > 0 && (
                <View style={styles.mealRow}>
                  <View
                    style={[ 
                      styles.mealTypeLabel,
                      { backgroundColor: newTheme.textSecondary },
                    ]}
                  >
                    <Text style={styles.mealTypeText}>S</Text>
                  </View>
                  <Text style={styles.mealTitle}>
                    {data.meals.snacks.map((s) => s.title).join(", ")}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity 
                style={styles.copyBtn}
                onPress={() => onSharePlan(data)}
              >
                <Ionicons name="share-social-outline" size={18} color={newTheme.textPrimary} />
                <Text style={styles.copyBtnText}>Share Plan</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editBtn}
                onPress={() => router.push({
                  pathname: "/(auth)/toolsScreen/MealCreationScreen",
                  params: { date: data.date } // Send date string directly
                })}
              >
                <Text style={styles.editBtnText}>Full Edit</Text>
                <Ionicons name="arrow-forward" size={16} color={newTheme.background} />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
        {/* Header */}
        <ToolScreenHeader
          title="Future Plan"
          subtitle="Visualize your upcoming nourishment."
          onBack={() => router.back()}
        />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={newTheme.accent} />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.monthHeader}>
              <Text style={styles.monthText}>
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>

            {weeklyPlan.map((day, index) => renderAccordionItem(day, index))}
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollContent: {
      paddingHorizontal: 0,
      paddingBottom: spacing.xxl,
    },
    monthHeader: {
      marginBottom: spacing.md,
      paddingLeft: 0,
    },
    monthText: {
      ...typography.bodyStrong,
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    accordionCard: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.divider,
      overflow: "hidden",
    },
    accordionCardActive: {
      borderColor: theme.accent,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    accordionHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
    },
    headerDateBox: {
      width: 80,
    },
    headerDay: {
      ...typography.caption,
      color: theme.textSecondary,
      textTransform: "uppercase",
    },
    headerDate: {
      ...typography.bodyStrong,
      color: theme.textPrimary,
      fontSize: 16,
    },
    headerInfo: {
      flex: 1,
      alignItems: "center",
    },
    headerCalories: {
      ...typography.bodyStrong,
      color: theme.textPrimary,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
    },
    headerStatus: {
      ...typography.caption,
      fontSize: 11,
      fontWeight: "700",
    },
    accordionContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    divider: {
      height: 1,
      backgroundColor: theme.divider,
      marginBottom: spacing.md,
    },
    mealsList: {
      gap: 12,
      marginBottom: spacing.lg,
    },
    mealRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surfaceMuted,
      padding: spacing.sm,
      borderRadius: 16,
    },
    mealTypeLabel: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.accent,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    mealTypeText: {
      fontSize: 12,
      fontWeight: "900",
      color: theme.background,
    },
    mealTitle: {
      ...typography.body,
      flex: 1,
      color: theme.textPrimary,
      fontSize: 14,
    },
    mealPlaceholder: {
      color: theme.textSecondary,
      fontStyle: "italic",
    },
    actionRow: {
      flexDirection: "row",
      gap: 12,
      marginTop: spacing.sm,
    },
    copyBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 48,
      borderRadius: 16,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.divider,
    },
    copyBtnText: {
      ...typography.bodyStrong,
      color: theme.textPrimary,
      fontSize: 14,
    },
    editBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 48,
      borderRadius: 16,
      backgroundColor: theme.accent,
    },
    editBtnText: {
      ...typography.bodyStrong,
      color: theme.background,
      fontSize: 14,
    },
  });

export default MealWeeklyViewScreen;
