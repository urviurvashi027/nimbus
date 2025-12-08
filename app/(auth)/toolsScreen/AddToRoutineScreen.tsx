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
import StyledButton from "@/components/common/themeComponents/StyledButton";

// ---------------------------------------------------------
type HabitItem = {
  id: string | number;
  name: string;
  frequency?: string;
  time?: string;
  icon?: string;
  note?: string;
};

// Mock Nimbus habits for testing
const MOCK_HABITS: HabitItem[] = [
  {
    id: "h1",
    name: "Morning Reflection",
    frequency: "Daily",
    time: "08:00 AM",
    icon: "☀️",
    note: "Start your day with clarity.",
  },
  {
    id: "h2",
    name: "Hydration Break",
    frequency: "3× / day",
    time: "Throughout the day",
    icon: "💧",
    note: "Stay hydrated — tiny habit, big impact.",
  },
  {
    id: "h3",
    name: "Night Journaling",
    frequency: "Night",
    time: "10:00 PM",
    icon: "🌙",
    note: "Reflect and wind down peacefully.",
  },
];

const AddToRoutineScreen: React.FC = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const params = useLocalSearchParams();
  const rawData = (params as any)?.data;

  const [habits, setHabits] = useState<HabitItem[]>(MOCK_HABITS);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(MOCK_HABITS.map((h) => h.id))
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const toggleHabit = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
          <View style={styles.metaChip}>
            <Ionicons
              name="repeat-outline"
              size={14}
              color={newTheme.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.metaText}>{item.frequency}</Text>
          </View>

          <View style={styles.metaChip}>
            <Ionicons
              name="time-outline"
              size={14}
              color={newTheme.textSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.metaText}>{item.time}</Text>
          </View>
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
            label={`Add ${selectedCount} habit${selectedCount > 1 ? "s" : ""}`}
            fullWidth
            variant="primary"
            onPress={() => router.back()}
          />
        </View>
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
