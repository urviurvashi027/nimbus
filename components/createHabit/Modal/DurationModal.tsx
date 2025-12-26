import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";
import StyledSwitch from "@/components/common/themeComponents/StyledSwitch";
import TimeInput from "@/components/common/picker/TimeInput";

export type Duration = {
  all_day?: boolean;
  start_time?: Date;
  end_time?: Date;
};

interface DurationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (duration: Duration) => void;
  isEditMode?: Duration;
}

const PRESETS = [
  {
    id: "morning",
    label: "Morning (7:00 AM)",
    start: { h: 7, m: 0 },
    end: null,
  },
  {
    id: "evening",
    label: "Evening (7:00 PM)",
    start: { h: 19, m: 0 },
    end: null,
  },
  {
    id: "work",
    label: "Work (9:00 AM — 5:00 PM)",
    start: { h: 9, m: 0 },
    end: { h: 17, m: 0 },
  },
];

export default function HabitDurationModal({
  visible,
  onClose,
  onSave,
  isEditMode,
}: DurationModalProps) {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  // state
  const [allDayEnabled, setAllDayEnabled] = useState<boolean>(true);
  const [mode, setMode] = useState<"point" | "period">("point");
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isEditMode) {
      if (isEditMode.all_day) {
        setAllDayEnabled(true);
        setMode("point");
      } else if (isEditMode.start_time && isEditMode.end_time) {
        setAllDayEnabled(false);
        setStart(new Date(isEditMode.start_time));
        setEnd(new Date(isEditMode.end_time));
        setMode("period");
      } else if (isEditMode.start_time) {
        setAllDayEnabled(false);
        setStart(new Date(isEditMode.start_time));
        setMode("point");
      }
    } else {
      setAllDayEnabled(true);
      setMode("point");
      const now = new Date();
      now.setMinutes(0, 0, 0);
      setStart(now);
      const oneHour = new Date(now.getTime() + 60 * 60 * 1000);
      setEnd(oneHour);
    }
  }, [isEditMode, visible]);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    // build Date objects for today with preset hours
    const today = new Date();
    const s = new Date(today);
    s.setHours(p.start.h, p.start.m, 0, 0);
    setStart(s);

    if (p.end) {
      const e = new Date(today);
      e.setHours(p.end.h, p.end.m, 0, 0);
      setEnd(e);
      setMode("period");
      setAllDayEnabled(false);
    } else {
      setMode("point");
      setAllDayEnabled(false);
    }
    setError("");
  };

  const onChangeStart = (
    event: DateTimePickerEvent,
    selected?: Date | undefined
  ) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selected) {
      setStart(selected);
      setError("");
      // If period, ensure end is later; if not, push end one hour forward
      if (mode === "period" && selected >= end) {
        const next = new Date(selected.getTime() + 60 * 60 * 1000);
        setEnd(next);
      }
    }
  };

  const onChangeEnd = (
    event: DateTimePickerEvent,
    selected?: Date | undefined
  ) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selected) {
      setEnd(selected);
      if (selected <= start) {
        setError("End time must be after start time.");
      } else {
        setError("");
      }
    }
  };

  const handleSave = () => {
    if (allDayEnabled) {
      onSave({ all_day: true });
      onClose();
      return;
    }

    if (mode === "point") {
      onSave({ start_time: start });
      onClose();
      return;
    }

    // period
    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }
    onSave({ start_time: start, end_time: end });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centering}
      >
        <SafeAreaView style={{ width: "100%", paddingHorizontal: 20 }}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: newTheme.surface,
                borderColor: newTheme.divider,
              },
            ]}
          >
            {/* header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: newTheme.textPrimary }]}>
                Habit Duration
              </Text>
              <TouchableOpacity onPress={onClose} accessibilityLabel="Close">
                <Ionicons name="close" size={22} color={newTheme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* All day toggle + short help */}
            <View style={styles.rowBetween}>
              <View>
                <Text style={[styles.label, { color: newTheme.textSecondary }]}>
                  All day
                </Text>
                <Text style={[styles.help, { color: newTheme.textSecondary }]}>
                  Quick: choose a preset or set specific time
                </Text>
              </View>

              <StyledSwitch
                value={allDayEnabled}
                onValueChange={() => {
                  setAllDayEnabled((s) => !s);
                }}
                size="medium"
              />
            </View>

            {/* Presets */}
            {!allDayEnabled && (
              <View style={{ marginTop: 12, marginBottom: 6 }}>
                <View style={styles.presetsRow}>
                  {PRESETS.map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => applyPreset(p)}
                      style={[
                        styles.presetButton,
                        { backgroundColor: newTheme.background },
                      ]}
                    >
                      <Text style={{ color: newTheme.textPrimary }}>
                        {p.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Mode: Point / Period */}
            {!allDayEnabled && (
              <View style={[styles.row, { marginTop: 6 }]}>
                <TouchableOpacity
                  style={styles.radio}
                  onPress={() => setMode("point")}
                >
                  <Ionicons
                    name={
                      mode === "point" ? "radio-button-on" : "radio-button-off"
                    }
                    size={18}
                    color={
                      mode === "point"
                        ? newTheme.accent
                        : newTheme.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      {
                        color:
                          mode === "point"
                            ? newTheme.textPrimary
                            : newTheme.textSecondary,
                      },
                    ]}
                  >
                    Point time
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radio}
                  onPress={() => setMode("period")}
                >
                  <Ionicons
                    name={
                      mode === "period" ? "radio-button-on" : "radio-button-off"
                    }
                    size={18}
                    color={
                      mode === "period"
                        ? newTheme.accent
                        : newTheme.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      {
                        color:
                          mode === "period"
                            ? newTheme.textPrimary
                            : newTheme.textSecondary,
                      },
                    ]}
                  >
                    Time period
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Time pickers */}
            {!allDayEnabled && (
              <View style={{ marginTop: 12 }}>
                <TimeInput
                  label="Start"
                  value={start}
                  onChange={(next) => {
                    setStart(next);
                    setError("");
                    if (mode === "period" && next >= end) {
                      setEnd(new Date(next.getTime() + 60 * 60 * 1000));
                    }
                  }}
                  title="Start time"
                />

                {mode === "period" && (
                  <TimeInput
                    label="End"
                    value={end}
                    onChange={(next) => {
                      setEnd(next);
                      if (next <= start)
                        setError("End time must be after start time.");
                      else setError("");
                    }}
                    title="End time"
                  />
                )}
              </View>
            )}

            {error ? (
              <Text style={[styles.error, { color: newTheme.error }]}>
                {error}
              </Text>
            ) : null}

            {/* actions */}
            <View style={styles.actionsRow}>
              <StyledButton
                label="Cancel"
                onPress={onClose}
                variant="outline"
                style={{ minWidth: 140 }}
              />

              <StyledButton
                label="Save"
                onPress={() => handleSave()}
                disabled={!allDayEnabled && mode === "period" && end <= start}
                style={{ minWidth: 140 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      {/* native datetime pickers */}
      {/* {showStartPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={start}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeStart}
            is24Hour={false}
          />
          <View style={styles.pickerButtons}>
            <TouchableOpacity
              onPress={() => setShowStartPicker(false)}
              style={styles.pickerBtn}
            >
              <Text style={styles.pickerBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
      {/* {showEndPicker && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={end}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeEnd}
            is24Hour={false}
          />
          <View style={styles.pickerButtons}>
            <TouchableOpacity
              onPress={() => setShowEndPicker(false)}
              style={styles.pickerBtn}
            >
              <Text style={styles.pickerBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
    </Modal>
  );
}

/* ---------- styles ---------- */
const styling = (newTheme: any) =>
  StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.45)",
    },
    centering: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    card: {
      borderRadius: 14,
      padding: 18,
      borderWidth: 1,
      // subtle shadow
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 20,
        },
        android: { elevation: 10 },
      }),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
    },
    title: { fontSize: 20, fontWeight: "700" },
    label: { fontSize: 14, fontWeight: "600" },
    help: { fontSize: 12, marginTop: 4 },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    presetsRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" } as any,
    presetButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginRight: 8,
    },
    pickerContainer: {
      backgroundColor: newTheme.surface,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      paddingBottom: Platform.OS === "ios" ? 32 : 12,
      paddingTop: 8,
    },
    row: { flexDirection: "row", gap: 18, marginTop: 8 },
    radio: { flexDirection: "row", alignItems: "center", gap: 8 },
    radioLabel: { fontSize: 15 },
    selector: {
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginTop: 6,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
    error: { marginTop: 8, fontSize: 13 },
    actionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 18,
    },
    pickerButtons: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    pickerBtn: { paddingVertical: 10, paddingHorizontal: 18 },
    pickerBtnText: { color: newTheme.accent, fontWeight: "700", fontSize: 16 },
  });
