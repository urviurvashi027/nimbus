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
import { Ionicons } from "@expo/vector-icons";
import { addDays } from "date-fns";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";
import { formatDay, formatApiDate } from "@/utils/dates";
import * as FileSystem from "expo-file-system";
import {
  getMealPlanRange,
  DayPlan,
  Meal,
  getMealPlanPdfUrl,
} from "@/services/mealService";
import { FilterPill } from "@/components/selfCare/workout/FilterPill";
import StyledButton from "@/components/common/themeComponents/StyledButton";
import { useAuth } from "@/context/AuthContext";

const MealWeeklyViewScreen = () => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);
  const { authState } = useAuth();

  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const weekRanges = useMemo(() => {
    const today = new Date();
    return [
      {
        label: "This Week",
        start: formatApiDate(today),
        end: formatApiDate(addDays(today, 6)),
      },
      {
        label: "Next Week",
        start: formatApiDate(addDays(today, 7)),
        end: formatApiDate(addDays(today, 13)),
      },
      {
        label: "Following",
        start: formatApiDate(addDays(today, 14)),
        end: formatApiDate(addDays(today, 20)),
      },
    ];
  }, []);

  const fetchPlan = async (weekIdx: number) => {
    try {
      setLoading(true);
      const range = weekRanges[weekIdx];
      const res: any = await getMealPlanRange(range.start, range.end);

      let data = [];
      if (res?.success) {
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data && typeof res.data === "object") {
          data = [res.data];
        }
      }
      setWeeklyPlan(data);
    } catch (error) {
      console.error("Error fetching meal plan range:", error);
      setWeeklyPlan([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan(selectedWeek);
  }, [selectedWeek]);

  const toggleAccordion = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const onSharePlan = async (data: DayPlan) => {
    try {
      setLoading(true);
      const dateStr = formatApiDate(new Date(data.date));
      const pdfUrl = getMealPlanPdfUrl(dateStr, dateStr);
      const fileUri = `${FileSystem.cacheDirectory}NourishPlan_${dateStr}.pdf`;

      const downloadRes = await FileSystem.downloadAsync(pdfUrl, fileUri, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });

      if (downloadRes.status === 200) {
        await Share.share(
          Platform.OS === "ios"
            ? { url: downloadRes.uri }
            : {
                message: `My Nourish Plan for ${dateStr}`,
                url: downloadRes.uri,
              }
        );
      } else {
        throw new Error("Failed to download PDF");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      const getMealName = (m: any) => {
        if (!m) return "Not planned";
        if (Array.isArray(m)) {
          return m.length > 0 ? m.map((s: any) => s.name).join(", ") : "Not planned";
        }
        return m.name || "Not planned";
      };

      const message =
        `My Meal Plan for ${new Date(data.date).toDateString()}:\n` +
        `Breakfast: ${getMealName(data.meals?.breakfast)}\n` +
        `Lunch: ${getMealName(data.meals?.lunch)}\n` +
        `Dinner: ${getMealName(data.meals?.dinner)}\n` +
        `Snacks: ${getMealName(data.meals?.snacks)}\n` +
        `Total Calories: ${data.total_calories || 0} kcal`;

      await Share.share({ message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("fully")) return { icon: "checkmark-circle", color: "#6DFF8C" };
    if (s.includes("not")) return { icon: "help-circle-outline", color: newTheme.textSecondary };
    return { icon: "alert-circle-outline", color: "#FACC15" };
  };

  const renderAccordionItem = (data: DayPlan, index: number) => {
    const isExpanded = expandedIndex === index;
    const statusInfo = getStatusInfo(data.status || "Not Planned");
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
              {`${dateObj.getDate()} ${dateObj.toLocaleString("default", { month: "short" }) }`}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.headerCalories}>
              {`${data.total_calories || 0} kcal`}
            </Text>
            <View style={styles.statusRow}>
              <Ionicons
                name={statusInfo.icon as any}
                size={14}
                color={statusInfo.color}
              />
              <Text style={[styles.headerStatus, { color: statusInfo.color }]}>
                {data.status || "Not Planned"}
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
              {["breakfast", "lunch", "dinner", "snacks"].map((type) => {
                const mealData = data.meals ? (data.meals as any)[type] : null;
                const isSnack = type === "snacks";

                let displayName = "";
                if (mealData) {
                  if (Array.isArray(mealData)) {
                    displayName = mealData.map((m: any) => m.name).join(", ");
                  } else {
                    displayName = mealData.name;
                  }
                }

                return (
                  <View key={type} style={styles.mealRow}>
                    <View style={styles.mealTypeLabel}>
                      <Text style={styles.mealTypeText}>
                        {type.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text
                      style={[styles.mealTitle, !displayName && styles.mealPlaceholder]}
                    >
                      {displayName || `No ${type} planned`}
                    </Text>
                    {!isSnack && (
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/(auth)/toolsScreen/MealCreationScreen",
                            params: {
                              type: type.charAt(0).toUpperCase() + type.slice(1),
                              date: data.date,
                              foodName: displayName || "",
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
                    )}
                  </View>
                );
              })}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.fullWidthShareBtn}
                onPress={() => onSharePlan(data)}
              >
                <Ionicons
                  name="share-social-outline"
                  size={18}
                  color={newTheme.textPrimary}
                />
                <Text style={styles.shareBtnText}>Share Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="restaurant-outline" size={48} color={newTheme.accent} />
      </View>
      <Text style={styles.emptyTitle}>Fridge is Empty!</Text>
      <Text style={styles.emptySubtitle}>
        You haven\'t scheduled any meals for this period. A well-planned week is the foundation of mindful nourishment.
      </Text>
      <StyledButton
        label="Start Planning"
        onPress={() => router.push("/(auth)/toolsScreen/MealCreationScreen")}
        style={styles.emptyButton}
      />
    </View>
  );

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

        {/* Week Chips */}
        <View style={styles.chipContainer}>
          {weekRanges.map((range, idx) => (
            <FilterPill
              key={idx}
              label={range.label}
              isActive={selectedWeek === idx}
              onPress={() => {
                setSelectedWeek(idx);
                setExpandedIndex(0); // Reset accordion to first item
              }}
              style={styles.weekChip}
            />
          ))}
        </View>

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
            {weeklyPlan.length > 0
              ? weeklyPlan.map((day, index) => renderAccordionItem(day, index))
              : renderEmptyState()}
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
    chipContainer: {
      flexDirection: "row",
      marginBottom: spacing.lg,
      gap: 8,
    },
    weekChip: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 0,
      paddingBottom: spacing.xxl,
      flexGrow: 1,
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
      marginTop: spacing.sm,
    },
    fullWidthShareBtn: {
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
    shareBtnText: {
      ...typography.bodyStrong,
      color: theme.textPrimary,
      fontSize: 14,
    },
    // Empty State Styles
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.lg,
    },
    emptyIconCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: theme.accent + "15",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      ...typography.h3,
      color: theme.textPrimary,
      marginBottom: spacing.sm,
      textAlign: "center",
    },
    emptySubtitle: {
      ...typography.body,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: spacing.xl,
    },
    emptyButton: {
      width: "100%",
      maxWidth: 240,
    },
  });

export default MealWeeklyViewScreen;