import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Modal,
  Switch,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Text } from "../../Themed";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import { FormInput } from "../../Themed"; // your existing input component
import { HabitDateType } from "@/types/habitTypes"; // optional: if you keep type shared elsewhere
import DatePicker from "@/components/common/ThemedComponent/DatePicker";

// Keep props signature unchanged
interface HabitDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habitDate: HabitDateType) => void;
  isEditMode?: HabitDateType | null;
}

/* Helper to convert day abbreviations (UI => backend) */
const convertDayAbbreviation = (day: string) => {
  const map: Record<string, string> = {
    Mo: "mon",
    Tu: "tue",
    We: "wed",
    Th: "thu",
    Fr: "fri",
    Sa: "sat",
    Su: "sun",
  };
  return map[day] ?? day.toLowerCase();
};

export default function HabitDateModal({
  visible,
  onClose,
  onSave,
  isEditMode,
}: HabitDateModalProps) {
  const { theme, newTheme } = useContext(ThemeContext);
  const styles = useMemo(() => styling(newTheme), [newTheme]);

  // modal fields
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isEndDateEnabled, setIsEndDateEnabled] = useState<boolean>(false);

  const [isRepeatEnabled, setIsRepeatEnabled] = useState<boolean>(false);
  const [selectedFrequency, setSelectedFrequency] = useState<
    "Daily" | "Weekly" | "Monthly" | ""
  >("");

  const [dailyCount, setDailyCount] = useState<string>("1");
  const [weeklyInterval, setWeeklyInterval] = useState<string>("1");
  const [monthlyInterval, setMonthlyInterval] = useState<string>("1");

  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [monthlyDates, setMonthlyDates] = useState<number[]>([]);

  // native datetime picker controlled
  const [showPickerFor, setShowPickerFor] = useState<"start" | "end" | null>(
    null
  );

  const [error, setError] = useState<string>("");

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // init from edit mode
  useEffect(() => {
    if (isEditMode) {
      setStartDate(
        isEditMode.start_date ? new Date(isEditMode.start_date) : new Date()
      );
      if (isEditMode.end_date) {
        setEndDate(new Date(isEditMode.end_date));
        setIsEndDateEnabled(true);
      } else {
        setIsEndDateEnabled(false);
      }

      if (isEditMode.frequency_type) {
        setIsRepeatEnabled(true);
        setSelectedFrequency(isEditMode.frequency_type as any);

        if (isEditMode.interval !== undefined) {
          const int = String(isEditMode.interval ?? 1);
          if (isEditMode.frequency_type === "Daily") setDailyCount(int);
          if (isEditMode.frequency_type === "Weekly") setWeeklyInterval(int);
          if (isEditMode.frequency_type === "Monthly") setMonthlyInterval(int);
        }

        if (isEditMode.days_of_week) {
          const revMap: Record<string, string> = {
            mon: "Mo",
            tue: "Tu",
            wed: "We",
            thu: "Th",
            fri: "Fr",
            sat: "Sa",
            sun: "Su",
          };
          setWeeklyDays(
            (isEditMode.days_of_week || []).map((d) => revMap[d] ?? d)
          );
        }
        if (isEditMode.days_of_month)
          setMonthlyDates(isEditMode.days_of_month || []);
      } else {
        setIsRepeatEnabled(false);
        setSelectedFrequency("");
      }
    } else {
      // reset defaults when modal opens fresh
      setStartDate(new Date());
      setEndDate(new Date());
      setIsEndDateEnabled(false);
      setIsRepeatEnabled(false);
      setSelectedFrequency("");
      setDailyCount("1");
      setWeeklyInterval("1");
      setMonthlyInterval("1");
      setWeeklyDays([]);
      setMonthlyDates([]);
      setError("");
    }
  }, [isEditMode, visible]);

  // toggle utilities
  const toggleWeeklyDay = (day: string) =>
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((p) => p !== day) : [...prev, day]
    );

  const toggleMonthlyDate = (n: number) =>
    setMonthlyDates((prev) =>
      prev.includes(n) ? prev.filter((p) => p !== n) : [...prev, n]
    );

  // native picker event
  const onDateTimeChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === "dismissed") {
      setShowPickerFor(null);
      return;
    }
    if (!selected) return;
    setShowPickerFor(null);
    if (showPickerFor === "start") {
      setStartDate(selected);
      if (isEndDateEnabled && endDate < selected) setEndDate(selected);
    } else {
      setEndDate(selected);
    }
  };

  // validation and conversion
  const convertToHabitDate = (): HabitDateType | null => {
    const daily = Math.max(1, Number(dailyCount || 1));
    const weekly = Math.max(1, Number(weeklyInterval || 1));
    const monthly = Math.max(1, Number(monthlyInterval || 1));

    if (isEndDateEnabled && endDate < startDate) {
      setError("End date cannot be before start date.");
      return null;
    }

    if (!isRepeatEnabled) {
      return {
        start_date: startDate,
        end_date: isEndDateEnabled ? endDate : undefined,
      };
    }

    if (selectedFrequency === "Daily") {
      return {
        start_date: startDate,
        end_date: isEndDateEnabled ? endDate : undefined,
        frequency_type: "daily",
        interval: daily,
      };
    }
    if (selectedFrequency === "Weekly") {
      if (weeklyDays.length === 0) {
        setError("Select at least one day.");
        return null;
      }
      return {
        start_date: startDate,
        end_date: isEndDateEnabled ? endDate : undefined,
        frequency_type: "weekly",
        interval: weekly,
        days_of_week: weeklyDays.map(convertDayAbbreviation),
      };
    }
    if (selectedFrequency === "Monthly") {
      if (monthlyDates.length === 0) {
        setError("Select at least one date.");
        return null;
      }
      return {
        start_date: startDate,
        end_date: isEndDateEnabled ? endDate : undefined,
        frequency_type: "monthly",
        interval: monthly,
        days_of_month: monthlyDates,
      };
    }

    setError("Select a repeat frequency.");
    return null;
  };

  const handleSave = () => {
    setError("");
    const parsed = convertToHabitDate();
    // console.log(parsed, "parsed parsed started modal 00000000");
    if (!parsed) return;
    onSave(parsed);
    onClose();
  };

  const isPillSelected = (p: "Daily" | "Weekly" | "Monthly") =>
    selectedFrequency === p;

  useEffect(() => {
    console.log(showPickerFor, "showpicker for");
  }, [showPickerFor]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centering}
      >
        <SafeAreaView style={{ width: "100%", paddingHorizontal: 20 }}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>Select Start Date</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={newTheme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Start date picker field (opens native picker) */}
            <DatePicker
              label="Start Date"
              selectedDateValue={startDate}
              minimumDate={new Date()}
              mode="date"
              iosDisplay="spinner"
              onConfirmDate={(d) => setStartDate(d)}
            />

            {/* Repeat toggle */}
            <View style={styles.rowBetween}>
              <Text style={styles.label}>Repeat</Text>
              <Switch
                value={isRepeatEnabled}
                trackColor={{
                  true: newTheme.accentPressed,
                  false: newTheme.background,
                }}
                thumbColor={
                  isRepeatEnabled ? newTheme.accent : newTheme.surface
                }
                onValueChange={(v) => {
                  setIsRepeatEnabled(v);
                  if (!v) {
                    setSelectedFrequency("");
                    setWeeklyDays([]);
                    setMonthlyDates([]);
                  }
                }}
              />
            </View>

            {isRepeatEnabled && (
              <>
                <View style={styles.frequencyRow}>
                  {(["Daily", "Weekly", "Monthly"] as const).map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.pill,
                        isPillSelected(p) && styles.pillSelected,
                      ]}
                      onPress={() => {
                        setSelectedFrequency(p);
                        setError("");
                      }}
                    >
                      <Text
                        style={[
                          styles.pillText,
                          isPillSelected(p) && styles.pillTextSelected,
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Daily */}
                {selectedFrequency === "Daily" && (
                  <View style={styles.inlineRow}>
                    <Text style={styles.smallLabel}>Every</Text>
                    <TextInput
                      keyboardType="numeric"
                      value={dailyCount}
                      onChangeText={(t) =>
                        setDailyCount(t.replace(/[^0-9]/g, ""))
                      }
                      style={[
                        styles.numberInput,
                        {
                          borderColor: newTheme.divider,
                          color: newTheme.textPrimary,
                        },
                      ]}
                    />
                    <Text style={styles.smallLabel}>days</Text>
                  </View>
                )}

                {/* Weekly */}
                {selectedFrequency === "Weekly" && (
                  <>
                    <Text style={styles.smallLabel}>Select days</Text>
                    <View style={styles.daysRow}>
                      {daysOfWeek.map((d) => (
                        <TouchableOpacity
                          key={d}
                          onPress={() => toggleWeeklyDay(d)}
                          style={[
                            styles.dayPill,
                            weeklyDays.includes(d) && styles.dayPillSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              weeklyDays.includes(d) && styles.dayTextSelected,
                            ]}
                          >
                            {d}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.inlineRow}>
                      <Text style={styles.smallLabel}>Every</Text>
                      <TextInput
                        value={weeklyInterval}
                        onChangeText={(t) =>
                          setWeeklyInterval(t.replace(/[^0-9]/g, ""))
                        }
                        keyboardType="numeric"
                        style={[
                          styles.numberInput,
                          {
                            borderColor: newTheme.divider,
                            color: newTheme.textPrimary,
                          },
                        ]}
                      />
                      <Text style={styles.smallLabel}>weeks</Text>
                    </View>
                  </>
                )}

                {/* Monthly */}
                {selectedFrequency === "Monthly" && (
                  <>
                    <Text style={styles.smallLabel}>Select day of month</Text>
                    <View style={styles.monthGrid}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                        <TouchableOpacity
                          key={n}
                          onPress={() => toggleMonthlyDate(n)}
                          style={[
                            styles.monthDay,
                            monthlyDates.includes(n) && styles.monthDaySelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.monthDayText,
                              monthlyDates.includes(n) &&
                                styles.monthDayTextSelected,
                            ]}
                          >
                            {n}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.inlineRow}>
                      <Text style={styles.smallLabel}>Every</Text>
                      <TextInput
                        value={monthlyInterval}
                        onChangeText={(t) =>
                          setMonthlyInterval(t.replace(/[^0-9]/g, ""))
                        }
                        keyboardType="numeric"
                        style={[
                          styles.numberInput,
                          {
                            borderColor: newTheme.divider,
                            color: newTheme.textPrimary,
                          },
                        ]}
                      />
                      <Text style={styles.smallLabel}>months</Text>
                    </View>
                  </>
                )}

                {/* End date toggle + field */}
                <View style={[styles.rowBetween, { marginTop: 14 }]}>
                  <Text style={styles.label}>Set end date</Text>
                  <Switch
                    value={isEndDateEnabled}
                    trackColor={{
                      true: newTheme.accentPressed,
                      false: newTheme.background,
                    }}
                    thumbColor={
                      isEndDateEnabled ? newTheme.accent : newTheme.surface
                    }
                    onValueChange={(v) => {
                      setIsEndDateEnabled(v);
                      if (!v) setEndDate(startDate);
                    }}
                  />
                </View>

                {isEndDateEnabled && (
                  <>
                    <DatePicker
                      label="End Date"
                      selectedDateValue={endDate}
                      minimumDate={startDate}
                      mode="date"
                      iosDisplay="spinner"
                      onConfirmDate={(d) => setEndDate(d)}
                    />
                  </>
                )}
              </>
            )}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* footer: cancel + save */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <StyledButton
                label="Save"
                onPress={handleSave}
                disabled={isRepeatEnabled && selectedFrequency === ""}
                style={styles.saveBtn}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/* Styles — tuned to Nimbus theme */
const styling = (newTheme: any) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    centering: {
      flex: 1,
      justifyContent: "center",
    },
    container: {
      backgroundColor: newTheme.surface,
      borderRadius: 14,
      padding: 18,
      borderWidth: 1,
      borderColor: newTheme.divider,
      maxWidth: 720,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: { fontSize: 20, fontWeight: "700", color: newTheme.textPrimary },
    field: {
      borderRadius: 10,
      borderWidth: 1,
      paddingVertical: 12,
      paddingHorizontal: 14,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    fieldText: { color: newTheme.textSecondary },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 14,
    },
    label: { color: newTheme.textPrimary, fontSize: 16, fontWeight: "600" },
    frequencyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 14,
    },
    pill: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 22,
      backgroundColor: newTheme.background,
      borderWidth: 1,
      borderColor: newTheme.divider,
      marginHorizontal: 6,
    },
    pillSelected: {
      backgroundColor: newTheme.accent,
      borderColor: newTheme.accent,
    },
    pillText: { color: newTheme.textSecondary, fontWeight: "600" },
    pillTextSelected: { color: newTheme.background, fontWeight: "700" },

    inlineRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
    smallLabel: {
      color: newTheme.textSecondary,
      fontSize: 15,
      marginRight: 10,
    },
    numberInput: {
      width: 64,
      height: 44,
      borderRadius: 10,
      borderWidth: 1,
      paddingHorizontal: 10,
      backgroundColor: newTheme.surface,
      textAlign: "center",
      fontSize: 16,
    },

    daysRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
    dayPill: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: newTheme.background,
      borderWidth: 1,
      borderColor: newTheme.divider,
      alignItems: "center",
      justifyContent: "center",
      margin: 6,
    },
    dayPillSelected: {
      backgroundColor: newTheme.accent,
      borderColor: newTheme.accent,
    },
    dayText: { color: newTheme.textPrimary },
    dayTextSelected: { color: newTheme.background },

    monthGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
    monthDay: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: newTheme.background,
      borderWidth: 1,
      borderColor: newTheme.divider,
      alignItems: "center",
      justifyContent: "center",
      margin: 6,
    },
    monthDaySelected: {
      backgroundColor: newTheme.accent,
      borderColor: newTheme.accent,
    },
    monthDayText: { color: newTheme.textPrimary, fontSize: 12 },
    monthDayTextSelected: { color: newTheme.background, fontWeight: "700" },

    error: { color: "#FF7A7A", marginTop: 8, textAlign: "center" },

    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    cancelBtn: {
      flex: 1,
      marginRight: 10,
      borderRadius: 12,
      backgroundColor: newTheme.background,
      borderWidth: 1,
      borderColor: newTheme.divider,
      paddingVertical: 12,
      alignItems: "center",
    },
    cancelText: { color: newTheme.textSecondary, fontWeight: "700" },
    saveBtn: { flex: 1, borderRadius: 12 },
  });
