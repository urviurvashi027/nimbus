import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Pressable,
  Text as RNText,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import HabitContext from "@/context/HabitContext";
import ThemeContext from "@/context/ThemeContext";

import { themeColors } from "@/constant/theme/Colors";

import HabitTypeInput from "@/components/createHabit/HabitTypeInput";
import HabitTagsInput, {
  selectedTag,
} from "@/components/createHabit/HabitTagsInput";
import { Button, FormInput, ScreenView, Text } from "@/components/Themed";

import HabitMetricInput from "@/components/createHabit/HabitMetricInput";
import HabitDurationInput from "@/components/createHabit/HabitDurationInput";
import HabitDateInput from "@/components/createHabit/HabitDateInput";
import HabitReminderInput from "@/components/createHabit/HabitReminderInput";
import EmojiSelector from "@/components/createHabit/EmojiSelectorModal";
import { ThemeKey } from "@/components/Themed";
// import EmojiInput from "@/components/createHabit/EmojiSelector";

import { createHabit } from "@/services/habitService";

import { ReminderAt } from "@/types/habitTypes";
import { FrequencyObj } from "@/types/habitTypes";
import { MetricFormat } from "@/types/habitTypes";
import { Duration } from "@/types/habitTypes";
import { HabitDateType } from "@/types/habitTypes";

export default function HabitBasic() {
  // form state
  const [colorSchema, setColorSchema] = useState<
    "#FFEDFA" | "#B4EBE6" | "#F8ED8C" | "#C1CFA1" | "#B7B1F2"
  >("#FFEDFA");
  const [name, setName] = useState("");
  const [habitTypeId, sethabitTypeId] = useState<number>(0);
  const [tags, setTags] = useState<selectedTag>({} as selectedTag);
  const [metric, setMetric] = useState<MetricFormat | {}>({});
  const [frequency, setFrequency] = useState<FrequencyObj | null>(null);
  const [duration, setDuration] = useState<Duration>({ all_day: undefined });
  const [date, setDate] = useState<HabitDateType>();
  const [reminderAt, setReminderAt] = useState<ReminderAt>({});
  const [emoji, setEmoji] = useState<string>("🙂");

  // ui / api state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // context
  const { habitData, setHabitData } = useContext(HabitContext);
  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(theme, newTheme);

  // navigation & safe area
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Create New Habit",
      headerTitleAlign: "center",
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: "700",
        color: styles.header.color,
      },
      headerStyle: {
        elevation: 0,
        shadowColor: "transparent",
        backgroundColor: "transparent",
        borderBottomWidth: 0,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: 12, padding: 8 }}
          accessibilityLabel="Close"
        >
          <Ionicons name="close" size={26} color={styles.header.color} />
        </TouchableOpacity>
      ),
      headerRight: () => <View style={{ width: 44 }} />,
    });
  }, [navigation, styles.header.color]);

  // handlers passed to child input components
  const handleColorSelect = (
    color: "#FFEDFA" | "#B4EBE6" | "#F8ED8C" | "#C1CFA1" | "#B7B1F2"
  ) => {
    setColorSchema(color);
  };
  const handleHabitTypeSelect = (id: number) => sethabitTypeId(id);
  const handleHabitTagSelection = (s: selectedTag) => setTags(s);
  const handleMetricSelect = (v: any) => setMetric(v);
  const handleFrequencySelect = (v: any) => setFrequency(v);
  const handleDurationSelect = (v: any) => setDuration(v);
  const handleHabitStartDate = (v: any) => setDate(v);
  const handleReminderSelect = (v: any) => setReminderAt(v);

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
    if (!name) return { ok: false, msg: "Please enter habit name" };
    if (!Object.keys(metric).length)
      return { ok: false, msg: "Please choose a metric" };
    if (!Object.keys(reminderAt).length)
      return { ok: false, msg: "Please set a reminder" };

    const freq = getFrequencyDetail();
    const payload: any = {
      name,
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
    console.log(payload, "payload create habit");
    setIsLoading(true);
    try {
      const result = await createHabit(payload);
      if (result?.success) {
        setIsSuccess(true);
        // small UX: short toast
        Toast.show({ type: "success", text1: "Habit created" });
        // reset UI & navigate
        setTimeout(() => {
          router.replace("/(auth)/(tabs)");
        }, 700);
      } else {
        Toast.show({ type: "error", text1: "Failed to create habit" });
      }
    } catch (err: any) {
      Toast.show({ type: "error", text1: "Network error" });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitClick = () => {
    const { ok, payload, msg } = validateAndBuild() as any;
    if (!ok) {
      Toast.show({ type: "error", text1: msg });
      return;
    }
    creatHabitApi(payload);
  };

  // small helper UI components (kept inline for single-file copy)
  const ColorSwatch = ({
    color,
    selected,
    onPress,
  }: {
    color: string;
    selected?: boolean;
    onPress: () => void;
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={[
          styles.colorCircle,
          { backgroundColor: color },
          selected ? styles.colorSelectedOuter : undefined,
        ]}
        android_ripple={{ color: "rgba(0,0,0,0.1)" }}
      >
        {selected && (
          <Ionicons name="checkmark" size={18} color={newTheme.background} />
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
          contentContainerStyle={{
            paddingBottom: Math.max(24, insets.bottom + 24),
          }}
        >
          <ScreenView
            bgColor={newTheme.background}
            style={{
              paddingTop: insets.top + 10,
              paddingHorizontal: 18,
              // paddingBottom: 12,
            }}
          >
            <View style={styles.emojiRow}>
              {/* <RNText style={styles.emoji}>{emoji}</RNText> */}
              <EmojiSelector
                value={emoji}
                onSelect={(e) => {
                  setEmoji(e);
                  // any extra logic you want when emoji selected
                }}
                placeholder={emoji}
                size={48}
              />
              <View style={styles.underline} />
            </View>

            {/* NAME (pill input) */}
            <View style={{ marginTop: 10, marginBottom: 18 }}>
              <TextInput
                style={[styles.pillInput, { color: newTheme.textPrimary }]}
                placeholder="Habit name"
                placeholderTextColor={newTheme.textSecondary}
                value={name}
                onChangeText={setName}
                returnKeyType="done"
              />
            </View>

            {/* Color swatches */}
            <View style={styles.swatchesRow}>
              {["#FFEDFA", "#B4EBE6", "#F8ED8C", "#C1CFA1", "#B7B1F2"].map(
                (c) => (
                  <ColorSwatch
                    key={c}
                    color={c}
                    selected={c === colorSchema}
                    onPress={() => handleColorSelect(c as any)}
                  />
                )
              )}
            </View>

            {/* Form rows */}
            <View style={styles.formList}>
              <HabitTypeInput onSelect={handleHabitTypeSelect} />

              <HabitMetricInput onSelect={handleMetricSelect} />
              <HabitDurationInput onSelect={handleDurationSelect} />
              <HabitDateInput onSelect={handleHabitStartDate} />
              <HabitReminderInput
                isAllDayEnabled={isAllDayEnabled()}
                onSelect={handleReminderSelect}
              />
              <HabitTagsInput onSelect={handleHabitTagSelection} />

              {/* <TouchableOpacity style={styles.rowItem}>
                <View style={styles.rowLeft}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={newTheme.textSecondary}
                  />
                  <Text style={styles.rowLabel}>Reminder At</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowValue}>Select the preset</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={newTheme.textSecondary}
                  />
                </View>
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.rowItem}>
                <View style={styles.rowLeft}>
                  <Ionicons
                    name="pricetag-outline"
                    size={20}
                    color={newTheme.textSecondary}
                  />
                  <Text style={styles.rowLabel}>Tags</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={styles.rowValue}>Select Tags</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={newTheme.textSecondary}
                  />
                </View>
              </TouchableOpacity> */}
            </View>

            {/* Spacer so content doesn't butt against the button */}
            <View style={{ height: 32 }} />
          </ScreenView>
        </ScrollView>

        {/* Submit button anchored above safe area */}
        <View
          style={[styles.submitWrap, { paddingBottom: insets.bottom || 16 }]}
        >
          <TouchableOpacity
            onPress={onSubmitClick}
            style={[styles.submitBtn, isLoading && { opacity: 0.8 }]}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <ActivityIndicator color={newTheme.background} />
            ) : (
              <RNText style={styles.submitText}>Submit</RNText>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

/* ----- Styles ----- */
const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    gestureContainer: { flex: 1 },
    header: { color: newTheme.textPrimary },

    emojiRow: {
      alignItems: "center",
      // marginTop: 6,
      marginBottom: 12,
    },
    emoji: { fontSize: 48 },
    underline: {
      width: 60,
      height: 4,
      backgroundColor: "rgba(255,255,255,0.12)",
      marginTop: 8,
      borderRadius: 2,
    },

    pillInput: {
      height: 54,
      borderRadius: 28,
      backgroundColor: newTheme.surface,
      paddingHorizontal: 18,
      fontSize: 16,
      includeFontPadding: false,
      alignSelf: "stretch",
      textAlign: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.03)",
    },

    swatchesRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 8,
      paddingHorizontal: 4,
    },
    colorCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 2,
    },
    colorSelectedOuter: {
      borderWidth: 3,
      borderColor: newTheme.textPrimary,
      transform: [{ scale: 1.02 }],
      shadowOpacity: 0.18,
    },

    formList: {
      marginTop: 10,
      backgroundColor: "transparent",
    },
    rowItem: {
      paddingVertical: 16,
      paddingHorizontal: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.03)",
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowLabel: { marginLeft: 8, color: newTheme.textSecondary, fontSize: 15 },
    rowRight: { flexDirection: "row", alignItems: "center", gap: 8 },
    rowValue: { color: newTheme.textPrimary, fontSize: 15, fontWeight: "600" },

    submitWrap: {
      paddingHorizontal: 16,
      backgroundColor: "transparent",
    },
    submitBtn: {
      height: 64,
      backgroundColor: newTheme.accent,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 2,
      marginTop: 6,
      shadowColor: newTheme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
      elevation: 6,
    },
    submitText: {
      color: newTheme.background,
      fontSize: 18,
      fontWeight: "700",
    },
  });
