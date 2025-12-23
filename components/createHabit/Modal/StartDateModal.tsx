import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "../../Themed";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import StyledSwitch from "@/components/common/themeComponents/StyledSwitch";
import { HabitDateType } from "@/types/habitTypes";

// ✅ Nimbus-style date input (should open DatePickerSheet like TimeInput opens TimePickerSheet)
import DateInput from "@/components/common/picker/DateInput";

type UIFreq = "Daily" | "Weekly" | "Monthly" | "";
type BackendFreq = "daily" | "weekly" | "monthly" | "";

const toUIFreq = (f?: string | null): UIFreq => {
  if (!f) return "";
  const v = f.toLowerCase();
  if (v === "daily") return "Daily";
  if (v === "weekly") return "Weekly";
  if (v === "monthly") return "Monthly";
  // if someone accidentally stored UI casing
  if (f === "Daily" || f === "Weekly" || f === "Monthly") return f as UIFreq;
  return "";
};

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

interface HabitDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habitDate: HabitDateType) => void;
  isEditMode?: HabitDateType | null;
}

export default function StartDateModal({
  visible,
  onClose,
  onSave,
  isEditMode,
}: HabitDateModalProps) {
  const { newTheme } = useContext(ThemeContext);
  const styles = useMemo(() => styling(newTheme), [newTheme]);

  // modal fields (LOGIC UNCHANGED)
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

  const [error, setError] = useState<string>("");

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // init from edit mode (LOGIC UNCHANGED)
  useEffect(() => {
    if (!visible) return;

    if (isEditMode) {
      const sd = isEditMode.start_date
        ? new Date(isEditMode.start_date)
        : new Date();
      const ed = isEditMode.end_date
        ? new Date(isEditMode.end_date)
        : undefined;

      setStartDate(sd);

      if (ed) {
        setEndDate(ed);
        setIsEndDateEnabled(true);
      } else {
        setEndDate(sd);
        setIsEndDateEnabled(false);
      }

      // ✅ map backend -> UI
      const uiFreq = toUIFreq(isEditMode.frequency_type as any);

      if (uiFreq) {
        setIsRepeatEnabled(true);
        setSelectedFrequency(uiFreq);

        const int = String(isEditMode.interval ?? 1);
        if (uiFreq === "Daily") setDailyCount(int);
        if (uiFreq === "Weekly") setWeeklyInterval(int);
        if (uiFreq === "Monthly") setMonthlyInterval(int);

        // days_of_week backend -> UI
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
        } else {
          setWeeklyDays([]);
        }

        setMonthlyDates(isEditMode.days_of_month || []);
      } else {
        setIsRepeatEnabled(false);
        setSelectedFrequency("");
        setWeeklyDays([]);
        setMonthlyDates([]);
      }

      setError("");
      return;
    }

    // fresh open defaults
    const now = new Date();
    setStartDate(now);
    setEndDate(now);
    setIsEndDateEnabled(false);

    setIsRepeatEnabled(false);
    setSelectedFrequency("");

    setDailyCount("1");
    setWeeklyInterval("1");
    setMonthlyInterval("1");

    setWeeklyDays([]);
    setMonthlyDates([]);
    setError("");
  }, [isEditMode, visible]);

  // toggle utilities (LOGIC UNCHANGED)
  const toggleWeeklyDay = (day: string) =>
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((p) => p !== day) : [...prev, day]
    );

  const toggleMonthlyDate = (n: number) =>
    setMonthlyDates((prev) =>
      prev.includes(n) ? prev.filter((p) => p !== n) : [...prev, n]
    );

  // validation and conversion (LOGIC UNCHANGED)
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
    if (!parsed) return;
    onSave(parsed);
    onClose();
  };

  const isPillSelected = (p: "Daily" | "Weekly" | "Monthly") =>
    selectedFrequency === p;

  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centering}
      >
        <SafeAreaView style={styles.safe}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={styles.title}>Start date</Text>
                <Text style={styles.subtitle}>
                  Choose when this habit begins — and optionally repeats.
                </Text>
              </View>

              <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
                <Ionicons name="close" size={22} color={newTheme.textPrimary} />
              </TouchableOpacity>
              {/* 
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={newTheme.textPrimary} />
              </TouchableOpacity> */}
            </View>

            {/* Scroll content */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.content, { paddingBottom: 24 }]}
              // contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              {/* Start */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Start</Text>

                <DateInput
                  label="Start date"
                  title="Start date"
                  value={startDate}
                  minimumDate={new Date()}
                  onChange={(d: Date) => {
                    setStartDate(d);
                    setError("");
                    if (isEndDateEnabled && endDate < d) setEndDate(d);
                  }}
                  // optional: remove year in display if your DateInput supports it
                  showYear={true}
                />
              </View>

              {/* Repeat */}
              <View style={styles.section}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.sectionLabel}>Repeat</Text>
                    <Text style={styles.sectionHint}>
                      Turn on to set a schedule.
                    </Text>
                  </View>

                  {/* ✅ StyledSwitch (same as Duration modal) */}
                  <StyledSwitch
                    value={isRepeatEnabled}
                    onValueChange={() => {
                      setIsRepeatEnabled((s) => {
                        const next = !s;

                        if (!next) {
                          setSelectedFrequency("");
                          setWeeklyDays([]);
                          setMonthlyDates([]);
                          return next;
                        }

                        // ✅ only set Daily if nothing selected yet
                        setSelectedFrequency((cur) => (cur ? cur : "Daily"));
                        setError("");
                        return next;
                      });
                    }}
                    size="medium"
                  />
                </View>

                {isRepeatEnabled && (
                  <>
                    {/* Frequency chips */}
                    <View style={styles.pillsRow}>
                      {(["Daily", "Weekly", "Monthly"] as const).map((p) => {
                        const selected = isPillSelected(p);
                        return (
                          <TouchableOpacity
                            key={p}
                            style={[
                              styles.pill,
                              selected && styles.pillSelected,
                            ]}
                            onPress={() => {
                              setSelectedFrequency(p);
                              setError("");
                            }}
                            activeOpacity={0.9}
                          >
                            <Text
                              style={[
                                styles.pillText,
                                selected && styles.pillTextSelected,
                              ]}
                            >
                              {p}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Daily */}
                    {selectedFrequency === "Daily" && (
                      <View style={styles.block}>
                        <Text style={styles.blockTitle}>Daily rhythm</Text>

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
                              { color: newTheme.textPrimary },
                            ]}
                            placeholder="1"
                            placeholderTextColor={newTheme.textSecondary}
                          />
                          <Text style={styles.smallLabel}>
                            {Number(dailyCount || 1) === 1 ? "day" : "days"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Weekly */}
                    {selectedFrequency === "Weekly" && (
                      <View style={styles.block}>
                        <Text style={styles.blockTitle}>Weekly rhythm</Text>
                        <Text style={styles.smallHint}>Choose days</Text>

                        <View style={styles.daysRow}>
                          {daysOfWeek.map((d) => {
                            const selected = weeklyDays.includes(d);
                            return (
                              <TouchableOpacity
                                key={d}
                                onPress={() => toggleWeeklyDay(d)}
                                style={[
                                  styles.dayPill,
                                  selected && styles.dayPillSelected,
                                ]}
                                activeOpacity={0.9}
                              >
                                <Text
                                  style={[
                                    styles.dayText,
                                    selected && styles.dayTextSelected,
                                  ]}
                                >
                                  {d}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
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
                              { color: newTheme.textPrimary },
                            ]}
                            placeholder="1"
                            placeholderTextColor={newTheme.textSecondary}
                          />
                          <Text style={styles.smallLabel}>
                            {Number(weeklyInterval || 1) === 1
                              ? "week"
                              : "weeks"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Monthly */}
                    {selectedFrequency === "Monthly" && (
                      <View style={styles.block}>
                        <Text style={styles.blockTitle}>Monthly rhythm</Text>
                        <Text style={styles.smallHint}>Choose dates</Text>

                        <View style={styles.monthGrid}>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (n) => {
                              const selected = monthlyDates.includes(n);
                              return (
                                <TouchableOpacity
                                  key={n}
                                  onPress={() => toggleMonthlyDate(n)}
                                  style={[
                                    styles.monthDay,
                                    selected && styles.monthDaySelected,
                                  ]}
                                  activeOpacity={0.9}
                                >
                                  <Text
                                    style={[
                                      styles.monthDayText,
                                      selected && styles.monthDayTextSelected,
                                    ]}
                                  >
                                    {n}
                                  </Text>
                                </TouchableOpacity>
                              );
                            }
                          )}
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
                              { color: newTheme.textPrimary },
                            ]}
                            placeholder="1"
                            placeholderTextColor={newTheme.textSecondary}
                          />
                          <Text style={styles.smallLabel}>
                            {Number(monthlyInterval || 1) === 1
                              ? "month"
                              : "months"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* End date */}
                    <View style={[styles.block, { marginTop: 8 }]}>
                      <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.blockTitle}>End date</Text>
                          <Text style={styles.smallHint}>
                            Leave off to continue indefinitely.
                          </Text>
                        </View>

                        {/* ✅ StyledSwitch (same as Duration modal) */}
                        <StyledSwitch
                          value={isEndDateEnabled}
                          onValueChange={() => {
                            setIsEndDateEnabled((s) => {
                              const next = !s;
                              if (!next) setEndDate(startDate);
                              return next;
                            });
                          }}
                          size="medium"
                        />
                      </View>

                      {isEndDateEnabled && (
                        <View style={{ marginTop: 10 }}>
                          <DateInput
                            label="End date"
                            title="End date"
                            value={endDate}
                            minimumDate={startDate}
                            onChange={(d: Date) => {
                              setEndDate(d);
                              setError("");
                            }}
                            showYear={true}
                          />
                        </View>
                      )}
                    </View>
                  </>
                )}
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </ScrollView>

            {/* Sticky footer */}
            <View style={styles.footer}>
              <StyledButton
                label="Cancel"
                onPress={onClose}
                variant="outline"
                style={styles.footerBtn}
              />
              <StyledButton
                label="Save"
                onPress={handleSave}
                disabled={isRepeatEnabled && selectedFrequency === ""}
                style={styles.footerBtn}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styling = (t: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.52)",
    },

    centering: { flex: 1, justifyContent: "center" },

    safe: {
      width: "100%",
      paddingHorizontal: 18, // matches HabitDuration feel
    },

    card: {
      backgroundColor: t.surface,
      borderRadius: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: t.divider,
      overflow: "hidden",
      maxWidth: 720,
      alignSelf: "center",
      width: "100%",
      maxHeight: "86%", // ✅ footer never goes out
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.26,
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 28,
        },
        android: { elevation: 14 },
      }),
    },

    header: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    closeBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.06)",
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: t.textPrimary,
      letterSpacing: 0.2,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 13,
      color: t.textSecondary,
      lineHeight: 18,
    },

    content: {
      paddingHorizontal: 18,
      paddingBottom: 14,
    },

    section: {
      paddingTop: 8,
      paddingBottom: 6,
    },
    sectionLabel: {
      fontSize: 14,
      fontWeight: "700",
      color: t.textPrimary,
      marginBottom: 8,
    },
    sectionHint: {
      marginTop: 4,
      fontSize: 12,
      color: t.textSecondary,
    },

    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    pillsRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 12,
    } as any,

    pill: {
      flex: 1,
      height: 44,
      borderRadius: 999,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.06)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.08)",
    },
    pillSelected: {
      backgroundColor: t.accent,
      borderColor: t.accent,
    },
    pillText: {
      color: t.textSecondary,
      fontWeight: "700",
      fontSize: 14,
    },
    pillTextSelected: { color: t.background },

    block: {
      marginTop: 12,
      padding: 12,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.04)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.06)",
    },
    blockTitle: {
      fontSize: 14,
      fontWeight: "800",
      color: t.textPrimary,
    },
    smallHint: {
      marginTop: 4,
      fontSize: 12,
      color: t.textSecondary,
      lineHeight: 16,
    },

    inlineRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 12,
    },
    smallLabel: {
      color: t.textSecondary,
      fontSize: 14,
      marginRight: 10,
      fontWeight: "600",
    },

    numberInput: {
      width: 72,
      height: 44,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.10)",
      backgroundColor: "rgba(0,0,0,0.18)",
      textAlign: "center",
      fontSize: 16,
      fontWeight: "700",
      paddingHorizontal: 10,
      marginRight: 10,
    },

    daysRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 10,
    } as any,
    dayPill: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.18)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.08)",
    },
    dayPillSelected: { backgroundColor: t.accent, borderColor: t.accent },
    dayText: { color: t.textPrimary, fontWeight: "700" },
    dayTextSelected: { color: t.background },

    monthGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 10,
    } as any,
    monthDay: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0,0,0,0.18)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: "rgba(255,255,255,0.08)",
    },
    monthDaySelected: { backgroundColor: t.accent, borderColor: t.accent },
    monthDayText: { color: t.textPrimary, fontSize: 12, fontWeight: "700" },
    monthDayTextSelected: { color: t.background },

    error: {
      color: t.error ?? "#FF7A7A",
      marginTop: 10,
      textAlign: "center",
      fontWeight: "600",
    },

    footer: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 16,
      flexDirection: "row",
      gap: 10,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: "rgba(255,255,255,0.06)",
    } as any,
    footerBtn: { flex: 1 },
  });
