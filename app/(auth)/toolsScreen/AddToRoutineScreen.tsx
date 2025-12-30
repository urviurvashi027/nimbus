// --- Nimbus Polished AddToRoutineScreen ---
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import {
  HabitDateType,
  Duration,
  HabitCreateRequest,
} from "@/types/habitTypes";
import {
  formatDurationDisplay,
  toBackendDurationPayload,
  parseBackendTimeToDate,
} from "@/utils/time";
import { createBulkHabit } from "@/services/habitService";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";
import StartDateModal from "@/components/createHabit/Modal/StartDateModal";
import HabitDurationModal from "@/components/createHabit/Modal/DurationModal";
import StyledButton from "@/components/common/themeComponents/StyledButton";

// ---------------------------------------------------------
type HabitItem = {
  id: string | number;
  name: string;
  frequency?: string;
  frequencyData?: HabitDateType; // Store full object for editing
  time?: string;
  durationData?: Duration; // Store full object for editing
  icon?: string;
  note?: string;

  // Add other fields needed for creation if they vary per habit
  habit_type_id?: number;
  color?: string;
};

const parseBackendFrequency = (freq: any): HabitDateType => {
  if (!freq)
    return { start_date: new Date(), frequency_type: "daily", interval: 1 };

  return {
    start_date: freq.start_date ? new Date(freq.start_date) : new Date(),
    end_date: freq.end_date ? new Date(freq.end_date) : undefined,
    frequency_type: freq.frequency_type || "daily",
    interval: freq.interval || 1,
    days_of_week: freq.days_of_week,
    days_of_month: freq.days_of_month?.map(Number),
  };
};

const parseBackendDuration = (dur: any): Duration => {
  if (!dur) return { all_day: true };

  const parseTime = (timeStr: string | null | undefined): Date | undefined => {
    if (!timeStr) return undefined;

    // Handle "06:00 AM" or "10:30 PM"
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let [_, hours, minutes, ampm] = match;
      let h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);
      if (ampm.toUpperCase() === "PM" && h < 12) h += 12;
      if (ampm.toUpperCase() === "AM" && h === 12) h = 0;

      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    }

    // Fallback to standard parser
    return parseBackendTimeToDate(timeStr) || undefined;
  };

  return {
    all_day: !!dur.all_day,
    start_time: parseTime(dur.start_time),
    end_time: parseTime(dur.end_time),
  };
};

const AddToRoutineScreen: React.FC = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);
  const toast = useNimbusToast();

  const params = useLocalSearchParams();
  const rawData = (params as any)?.data;

  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Frequency Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | number | null>(
    null
  );
  const [modalInitialData, setModalInitialData] =
    useState<HabitDateType | null>(null);

  // Duration Modal State
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [durationInitialData, setDurationInitialData] = useState<
    Duration | undefined
  >(undefined);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  // Parse dynamic data from params
  useEffect(() => {
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed)) {
          const mapped: HabitItem[] = parsed.map((b: any) => {
            const freqData = parseBackendFrequency(b.frequency_details);
            const durData = parseBackendDuration(b.duration_details);

            return {
              id: b.id || Math.random().toString(36).substr(2, 9),
              name: b.name || "Untitled Habit",
              note: b.description || "",
              icon: b.icon || "✨",
              habit_type_id: b.habit_type || 1,
              color: b.color || "#FF7A7A",
              frequencyData: freqData,
              durationData: durData,
              frequency: generateFrequencyString(freqData),
              time: formatDurationDisplay(durData, { allDayLabel: "All Day" }),
            };
          });
          setHabits(mapped);
          setSelectedIds(new Set(mapped.map((h) => h.id)));
        }
      } catch (e) {
        console.error("Error parsing blueprint data:", e);
      }
    }
  }, [rawData]);

  const toggleHabit = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Helper to generate display string
  const generateFrequencyString = (data: HabitDateType): string => {
    if (!data.frequency_type) return "One time";
    const type = data.frequency_type.toLowerCase();
    const interval = data.interval || 1;

    if (type === "daily") {
      return interval === 1 ? "Daily" : `Every ${interval} days`;
    }
    if (type === "weekly") {
      if (data.days_of_week && data.days_of_week.length > 0) {
        // e.g. "Weekly (Mon, Wed)"
        return `Weekly (${data.days_of_week
          .map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3))
          .join(", ")})`;
      }
      return interval === 1 ? "Weekly" : `Every ${interval} weeks`;
    }
    if (type === "monthly") {
      return interval === 1 ? "Monthly" : `Every ${interval} months`;
    }
    return "Custom";
  };

  const openFrequencyModal = (habit: HabitItem) => {
    setEditingHabitId(habit.id);

    // If we have stored data, use it. Otherwise default to "Daily" starting today.
    if (habit.frequencyData) {
      setModalInitialData(habit.frequencyData);
    } else {
      setModalInitialData({
        start_date: new Date(),
        frequency_type: "daily",
        interval: 1,
      });
    }
    setModalVisible(true);
  };

  const handleSaveFrequency = (data: HabitDateType) => {
    if (editingHabitId === null) return;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === editingHabitId) {
          return {
            ...h,
            frequencyData: data,
            frequency: generateFrequencyString(data),
          };
        }
        return h;
      })
    );
  };

  const openDurationModal = (habit: HabitItem) => {
    setEditingHabitId(habit.id);
    if (habit.durationData) {
      setDurationInitialData(habit.durationData);
    } else {
      setDurationInitialData(undefined);
    }
    setDurationModalVisible(true);
  };

  const handleSaveDuration = (data: Duration) => {
    if (editingHabitId === null) return;

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === editingHabitId) {
          return {
            ...h,
            durationData: data,
            time: formatDurationDisplay(data, { allDayLabel: "All Day" }),
          };
        }
        return h;
      })
    );
  };

  const handleAddHabits = async () => {
    if (selectedIds.size === 0) return;
    setIsSubmitting(true);

    try {
      const selectedHabits = habits.filter((h) => selectedIds.has(h.id));

      const payload: HabitCreateRequest[] = selectedHabits.map((h) => {
        // Construct basic habit payload
        const habitData: HabitCreateRequest = {
          name: h.name,
          description: h.note || "",
          icon: h.icon || "✨",
          habit_type_id: h.habit_type_id || 1, // Default or specific type ID
          color: h.color || "#FF7A7A",
          // tags: [], // Add tags if available
          habit_metric: { unit: 1, count: 1 }, // Default metric: unit ID 1, count 1
          habit_duration: h.durationData
            ? toBackendDurationPayload(h.durationData)
            : { all_day: true },
          habit_frequency: {
            frequency_type: h.frequencyData?.frequency_type || "daily",
            interval: h.frequencyData?.interval || 1,
            start_date:
              h.frequencyData?.start_date?.toISOString().split("T")[0] ||
              new Date().toISOString().split("T")[0],
            days_of_week: h.frequencyData?.days_of_week,
            days_of_month: h.frequencyData?.days_of_month?.map(String),
            end_date: h.frequencyData?.end_date?.toISOString().split("T")[0],
          },
          remind_at: { ten_min_before: true }, // Default reminder
        };
        return habitData;
      });

      await createBulkHabit(String(params.id), payload);

      toast.show({
        variant: "success",
        title: "Success",
        message: `${selectedIds.size} habit(s) added to your routine!`,
      });
      router.back();
    } catch (error: any) {
      console.error("Bulk add error:", error);
      toast.show({
        variant: "error",
        title: "Error",
        message: error?.message || "Failed to add habits.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = selectedIds.size;

  const renderHabit = ({ item }: { item: HabitItem }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleHabit(item.id)}
        style={[
          styles.card,
          isSelected && {
            borderColor: newTheme.accent,
            backgroundColor: newTheme.surface,
          },
        ]}
      >
        {/* TOP ROW */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.iconBubble}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>

          <View style={styles.titleColumn}>
            <Text style={styles.habitName}>{item.name}</Text>
            {item.note && <Text style={styles.habitNote}>{item.note}</Text>}
          </View>

          <View
            style={[
              styles.checkbox,
              isSelected && { backgroundColor: newTheme.accent },
            ]}
          >
            {isSelected && (
              <Ionicons name="checkmark" size={16} color={newTheme.surface} />
            )}
          </View>
        </View>

        {/* META ROW */}
        <View style={styles.metaRow}>
          <TouchableOpacity
            style={styles.metaChip}
            onPress={() => openFrequencyModal(item)}
          >
            <Ionicons
              name="repeat-outline"
              size={14}
              color={newTheme.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.metaText}>{item.frequency}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.metaChip}
            onPress={() => openDurationModal(item)}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color={newTheme.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.metaText}>{item.time}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.15
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Nimbus Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={newTheme.textSecondary}
            />
          </TouchableOpacity>

          <View style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}>
            <Text style={styles.headerTitle}>Add to routine</Text>
            <Text style={styles.headerSubtitle}>
              Choose habits to bring into your Nimbus routine.
            </Text>
          </View>
        </View>

        {/* Habit List */}
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
        />

        {/* Bottom CTA */}
        <View style={styles.bottomBar}>
          <StyledButton
            label={
              isSubmitting
                ? "Adding..."
                : `Add ${selectedCount} habit${selectedCount > 1 ? "s" : ""}`
            }
            fullWidth
            variant="primary"
            onPress={handleAddHabits}
            disabled={isSubmitting || selectedCount === 0}
          />
        </View>

        {/* Frequency Edit Modal */}
        <StartDateModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveFrequency}
          isEditMode={modalInitialData}
        />

        {/* Duration Edit Modal */}
        <HabitDurationModal
          visible={durationModalVisible}
          onClose={() => setDurationModalVisible(false)}
          onSave={handleSaveDuration}
          isEditMode={durationInitialData}
        />
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    headerWrapper: {},
    headerTitle: {
      ...typography.h2,
      color: theme.textPrimary,
      fontWeight: "700",
    },
    headerSubtitle: {
      ...typography.bodySmall,
      color: theme.textSecondary,
      marginTop: spacing.xs,
    },

    card: {
      borderRadius: 22,
      padding: spacing.md,
      marginBottom: spacing.md,
      backgroundColor: theme.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.divider,
    },
    cardHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconBubble: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surfaceElevated,
      marginRight: spacing.md,
    },
    iconText: { fontSize: 22 },
    titleColumn: { flex: 1 },
    habitName: {
      ...typography.bodyStrong,
      color: theme.textPrimary,
      fontSize: 16,
    },
    habitNote: {
      ...typography.caption,
      color: theme.textSecondary,
      marginTop: 2,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 50,
      borderWidth: 1.3,
      borderColor: theme.divider,
      alignItems: "center",
      justifyContent: "center",
    },

    metaRow: { flexDirection: "row", marginTop: spacing.sm },
    metaChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      backgroundColor: theme.surfaceMuted,
      borderRadius: 999,
      marginRight: spacing.sm,
    },
    metaText: {
      ...typography.caption,
      color: theme.textSecondary,
    },

    bottomBar: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
      bottom: spacing.xl,
    },
  });

export default AddToRoutineScreen;
