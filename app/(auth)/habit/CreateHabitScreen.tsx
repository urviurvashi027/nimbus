import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Pressable,
  Text,
  Platform,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// import HabitContext from "@/context/HabitContext";
import ThemeContext from "@/context/ThemeContext";

import HabitTypeInput from "@/components/createHabit/HabitTypeInput";
import HabitTagsInput, {
  selectedTag,
} from "@/components/createHabit/HabitTagsInput";
import { ScreenView } from "@/components/Themed";

import HabitMetricInput from "@/components/createHabit/HabitMetricInput";
import HabitDurationInput from "@/components/createHabit/HabitDurationInput";
import HabitDateInput from "@/components/createHabit/HabitDateInput";
import HabitReminderInput from "@/components/createHabit/HabitReminderInput";
import EmojiSelector from "@/components/createHabit/EmojiSelectorModal";
import AppHeader from "@/components/common/AppHeader";

import { createHabit } from "@/services/habitService";

import {
  ReminderAt,
  FrequencyObj,
  MetricFormat,
  Duration,
  HabitDateType,
} from "@/types/habitTypes";
import StyledButton from "@/components/common/themeComponents/StyledButton";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

const COLOR_OPTIONS = [
  "#FFEDFA",
  "#B4EBE6",
  "#F8ED8C",
  "#C1CFA1",
  "#B7B1F2",
] as const;

export default function HabitBasic() {
  // form state
  const [colorSchema, setColorSchema] =
    useState<(typeof COLOR_OPTIONS)[number]>("#FFEDFA");
  const [name, setName] = useState("");
  const [habitTypeId, sethabitTypeId] = useState<number>(0);
  const [tags, setTags] = useState<selectedTag>({} as selectedTag);
  const [metric, setMetric] = useState<MetricFormat | {}>({});
  const [frequency, setFrequency] = useState<FrequencyObj | null>(null);
  const [duration, setDuration] = useState<Duration>({ all_day: undefined });
  const [date, setDate] = useState<HabitDateType>();
  const [reminderAt, setReminderAt] = useState<ReminderAt>({});
  const [emoji, setEmoji] = useState<string>("🙂");

  const toast = useNimbusToast();

  // ui / api state
  const [isLoading, setIsLoading] = useState(false);

  // context
  // const { setHabitData } = useContext(HabitContext);
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  // navigation & safe area
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // hide native header → use AppHeader instead
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // handlers passed to child input components
  const handleColorSelect = (color: (typeof COLOR_OPTIONS)[number]) => {
    setColorSchema(color);
  };
  const handleHabitTypeSelect = (id: number) => {
    sethabitTypeId(id);
  };

  const handleMetricSelect = (v: { count: string; unit: number }) => {
    setMetric(v);
  };
  const handleHabitTagSelection = (s: selectedTag) => setTags(s);

  const handleDurationSelect = (v: any) => {
    console.log(v, "selected setDuration");
    setDuration(v);
  };

  const handleHabitStartDate = (v: any) => {
    console.log(v, "selected start date details");
    setDate(v);
  };

  const handleFrequencySelect = (v: any) => setFrequency(v);

  const handleReminderSelect = useCallback((v: any) => {
    setReminderAt(v);
    console.log(v, "selected reminder details");
  }, []);

  const getFrequencyDetail = () => {
    if (frequency?.frequency_type || date?.start_date)
      return { ...frequency, ...date };
  };

  const getFormattedTag = () => {
    let value;
    if (tags) {
      const oldIds = tags?.old?.map((it) => it.id) || [];
      if (tags.new) value = { old: oldIds, new: [tags.new] };
      else value = { old: oldIds };
    } else value = {};
    return value;
  };

  const validateAndBuild = () => {
    if (!name.trim()) return { ok: false, msg: "Please enter a habit name." };
    if (!Object.keys(metric).length)
      return { ok: false, msg: "Please choose a metric." };
    if (!Object.keys(reminderAt).length)
      return { ok: false, msg: "Please set a reminder." };

    const freq = getFrequencyDetail();
    const payload: any = {
      name: name.trim(),
      habit_type_id: habitTypeId,
      color: colorSchema,
      habit_metric: metric,
      habit_duration: duration,
      habit_frequency: freq,
      tags: getFormattedTag(),
      icon: emoji,
    };

    if (reminderAt?.time || reminderAt?.ten_min_before)
      payload.remind_at = reminderAt;
    return { ok: true, payload };
  };

  const creatHabitApi = async (payload: any) => {
    setIsLoading(true);
    try {
      const result = await createHabit(payload);
      if (result?.success) {
        toast.show({
          variant: "success",
          title: "Habit is created",
          message: "Habit created",
        });
        setTimeout(() => {
          router.replace("/(auth)/(tabs)");
        }, 650);
      } else {
        toast.show({
          variant: "error",
          title: "Somthing went wrong",
          message: "Failed to create habit",
        });
      }
    } catch (err: any) {
      toast.show({
        variant: "error",
        title: "Somthing went wrong",
        message: "Network error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitClick = () => {
    const { ok, payload, msg } = validateAndBuild() as any;
    if (!ok) {
      toast.show({
        variant: "error",
        title: "Validation Error",
        message: msg,
      });
      return;
    }
    creatHabitApi(payload);
  };

  // small helper UI components
  const ColorSwatch = ({
    color,
    selected,
    onPress,
  }: {
    color: (typeof COLOR_OPTIONS)[number];
    selected?: boolean;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.colorCircle,
          { backgroundColor: color },
          selected && styles.colorSelectedOuter,
        ]}
        android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      >
        {selected && (
          <View style={styles.colorInnerCheck}>
            <Ionicons name="checkmark" size={16} color={newTheme.background} />
          </View>
        )}
      </Pressable>
    );
  };

  const isAllDayEnabled = () => {
    return duration.all_day ? true : false;
  };

  return (
    <GestureHandlerRootView
      style={[
        styles.gestureContainer,
        { backgroundColor: newTheme.background },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: Math.max(24, insets.bottom + 24),
          }}
          showsVerticalScrollIndicator={false}
        >
          <ScreenView
            bgColor={newTheme.background}
            style={{
              paddingTop:
                Platform.OS === "ios"
                  ? spacing["xl"] + spacing["xl"] * 0.4
                  : spacing.xl,
              paddingHorizontal: spacing.md,
            }}
          >
            {/* Nimbus shared header */}
            <AppHeader
              title="Create New Habit"
              subtitle="Set up a habit that you can track and celebrate every day."
              onBack={() => router.back()}
            />

            {/* Appearance section */}
            <View style={[styles.sectionHeader, { marginTop: spacing.xs }]}>
              <Text style={styles.sectionTitle}>Appearance</Text>
              <Text style={styles.sectionSubtitle}>
                Choose an icon and color that matches your habit’s energy.
              </Text>
            </View>

            <View style={styles.emojiRow}>
              <EmojiSelector
                value={emoji}
                onSelect={(e) => setEmoji(e)}
                placeholder={emoji}
                size={52}
              />
              <View style={styles.underline} />
            </View>

            {/* NAME (pill input) */}
            <View style={styles.nameWrapper}>
              <TextInput
                style={[styles.pillInput]}
                placeholder="Habit name"
                placeholderTextColor={newTheme.textSecondary}
                value={name}
                onChangeText={setName}
                returnKeyType="done"
                maxLength={40}
                autoCapitalize="sentences"
                selectionColor={newTheme.accent}
              />
            </View>

            {/* Color swatches */}
            <View style={styles.swatchesRow}>
              {COLOR_OPTIONS.map((c) => (
                <ColorSwatch
                  key={c}
                  color={c}
                  selected={c === colorSchema}
                  onPress={() => handleColorSelect(c)}
                />
              ))}
            </View>

            {/* Details section */}
            <View
              style={[
                styles.sectionHeader,
                { marginTop: spacing.lg, marginBottom: spacing.xs },
              ]}
            >
              <Text style={styles.sectionTitle}>Habit details</Text>
              <Text style={styles.sectionSubtitle}>
                Set how often, how long, and how you’ll track this habit.
              </Text>
            </View>

            {/* Form rows inside a card */}
            <View style={styles.formCard}>
              <HabitTypeInput
                style={styles.rowItem}
                onSelect={handleHabitTypeSelect}
              />
              <HabitMetricInput
                style={styles.rowItem}
                onSelect={handleMetricSelect}
              />
              <HabitDurationInput
                style={styles.rowItem}
                onSelect={handleDurationSelect}
              />
              <HabitDateInput
                style={styles.rowItem}
                onSelect={handleHabitStartDate}
              />
              <HabitReminderInput
                style={styles.rowItem}
                isAllDayEnabled={isAllDayEnabled()}
                onSelect={handleReminderSelect}
              />
              <HabitTagsInput
                onSelect={handleHabitTagSelection}
                style={[styles.rowItem, styles.rowItemLast]}
              />
            </View>

            {/* Spacer before button */}
            <View style={{ height: spacing.lg }} />
          </ScreenView>
        </ScrollView>

        {/* Submit button anchored above safe area */}
        <View
          style={[
            styles.submitWrap,
            { paddingBottom: (insets.bottom || 16) + spacing.xs },
          ]}
        >
          <StyledButton
            label="Create habit"
            onPress={onSubmitClick}
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

/* ----- Styles ----- */
const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    gestureContainer: { flex: 1 },
    header: { color: newTheme.textPrimary },

    sectionHeader: {
      marginBottom: spacing.sm,
    },
    sectionTitle: {
      ...typography.bodyLarge,
      fontWeight: "600",
      color: newTheme.textPrimary,
    },
    sectionSubtitle: {
      ...typography.caption,
      color: newTheme.textSecondary,
      marginTop: 4,
      marginBottom: spacing.sm,
    },

    emojiRow: {
      alignItems: "center",
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },
    underline: {
      width: 64,
      height: 4,
      backgroundColor: "rgba(255,255,255,0.12)",
      marginTop: 10,
      borderRadius: 999,
    },

    nameWrapper: {
      marginTop: spacing.sm,
      marginBottom: spacing.md,
    },
    pillInput: {
      height: 52,
      borderRadius: 26,
      backgroundColor: newTheme.surface,
      paddingHorizontal: spacing.lg,
      ...typography.bodyMedium,
      color: newTheme.textPrimary,
      includeFontPadding: false,
      textAlign: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.06)",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 3,
    },

    swatchesRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: spacing.sm,
      paddingHorizontal: 4,
    },
    colorCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 2,
    },
    colorSelectedOuter: {
      shadowOpacity: 0.22,
      shadowRadius: 10,
      elevation: 4,
      borderWidth: 2,
      borderColor: newTheme.accent,
      transform: [{ scale: 1.04 }],
    },
    colorInnerCheck: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: "rgba(0,0,0,0.25)",
      justifyContent: "center",
      alignItems: "center",
    },

    submitWrap: {
      paddingHorizontal: spacing.md,
      backgroundColor: "transparent",
    },

    formCard: {
      backgroundColor: newTheme.surface,
      borderRadius: spacing.lg,
      overflow: "hidden",

      // Add subtle shadow for premium depth
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },

    rowItem: {
      paddingVertical: spacing.md + 2, // ↑ more breathing space
      paddingHorizontal: spacing.md, // consistent left/right
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.06)",
    },

    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm + 2, // slightly more gap
    },

    rowLabel: {
      color: newTheme.textSecondary,
      fontSize: 15,
      fontWeight: "500",
    },

    rowRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },

    rowValue: {
      color: newTheme.textPrimary,
      fontSize: 15,
      fontWeight: "600",
    },

    // Remove the last divider cleanly
    rowItemLast: {
      borderBottomWidth: 0,
    },
  });
