// HabitReminderModal.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Text as RNText,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Text } from "../../Themed";
import ThemeContext from "@/context/ThemeContext";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton";

export interface ReminderAt {
  time?: string | undefined;
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
}

type EditData = {
  time?: Date | undefined | null;
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
};

interface ReminderAtModalProps {
  visible: boolean;
  isAllDayEnabled: boolean;
  onClose: () => void;
  onSave: (duration: ReminderAt) => void;
  isEditMode?: EditData | null;
}

const PRESET_10 = "ten_min_before";
const PRESET_30 = "thirty_min_before";

const HabitReminderModal: React.FC<ReminderAtModalProps> = ({
  visible,
  onClose,
  isAllDayEnabled,
  onSave,
  isEditMode,
}) => {
  const { theme, newTheme } = useContext(ThemeContext);

  // UI state
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderAt, setReminderAt] = useState<Date>(new Date());
  const [preset, setPreset] = useState<string | null>(null);
  const [isSpecified, setIsSpecified] = useState<boolean>(false); // when we want a specific time
  const [error, setError] = useState<string>("");

  // Init from edit mode & isAllDay behavior
  useEffect(() => {
    if (isAllDayEnabled) {
      // When habit duration is "All day" we prefer explicit time selection
      setIsSpecified(true);
      setShowTimePicker(false); // show only when user taps Select Time
      if (isEditMode?.time) {
        // incoming edit mode may have a Date in older format; guard it
        try {
          const d = isEditMode.time as unknown as Date;
          if (d) setReminderAt(new Date(d));
        } catch {
          // ignore
        }
      }
      setPreset(null);
    } else {
      // Not all-day -> show presets by default
      setIsSpecified(false);
      // restore preset from edit mode
      if (isEditMode?.ten_min_before) setPreset(PRESET_10);
      else if (isEditMode?.thirty_min_before) setPreset(PRESET_30);
      else setPreset(null);
    }
  }, [isAllDayEnabled, isEditMode, visible]);

  // DateTimePicker onChange handler (works for Android/iOS)
  const onDateTimeChange = (
    event: DateTimePickerEvent,
    selected?: Date | undefined
  ) => {
    // On iOS selected may be undefined only when user cancels? guard:
    if (event.type === "dismissed") {
      setShowTimePicker(false);
      return;
    }
    const current = selected ?? reminderAt;
    setShowTimePicker(Platform.OS === "ios"); // keep open on iOS in some flows, close on Android
    setReminderAt(current);
    setIsSpecified(true);
    setPreset(null); // clear preset if user picked exact time
    setError("");
  };

  const openTimePicker = () => {
    setShowTimePicker(true);
  };

  const handlePresetPress = (p: string) => {
    setPreset((prev) => (prev === p ? null : p));
    setIsSpecified(false);
    setError("");
  };

  const getFormattedResult = (): ReminderAt | null => {
    if (isSpecified) {
      // Save as hh:mm:ss (server expected format you used before)
      return { time: format(reminderAt, "HH:mm:ss") };
    } else {
      if (preset === PRESET_10) return { ten_min_before: true };
      if (preset === PRESET_30) return { thirty_min_before: true };
      // nothing selected
      return null;
    }
  };

  const handleSave = () => {
    setError("");
    const payload = getFormattedResult();
    if (!payload) {
      setError("Please choose a time or a preset before saving.");
      return;
    }
    onSave(payload);
    onClose();
  };

  // Microcopy text helper
  const getMicrocopy = () => {
    if (isAllDayEnabled) {
      return "Pick a specific time — this reminder will trigger at the chosen time (relative to the habit's day).";
    } else {
      return "Choose a preset; the reminder will be sent relative to your habit time (e.g. 10 minutes before).";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.45)" }]} />

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
                Reminder At
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={newTheme.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* microcopy */}
            <Text style={[styles.micro, { color: newTheme.textSecondary }]}>
              {getMicrocopy()}
            </Text>

            {/* If all-day => allow user to pick explicit time */}
            {isAllDayEnabled ? (
              <View style={{ marginTop: 16 }}>
                <TouchableOpacity
                  style={[
                    styles.selector,
                    {
                      borderColor: newTheme.divider,
                      backgroundColor: newTheme.background,
                    },
                  ]}
                  onPress={openTimePicker}
                >
                  <Text style={{ color: newTheme.textPrimary }}>
                    {isSpecified
                      ? `Selected time: ${format(reminderAt, "hh:mm a")}`
                      : "Select reminder time"}
                  </Text>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={newTheme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              // not all day -> show segmented preset pills
              <View style={{ marginTop: 14 }}>
                <View style={styles.pillRow}>
                  <TouchableOpacity
                    onPress={() => handlePresetPress(PRESET_10)}
                    style={[
                      styles.pill,
                      preset === PRESET_10 && {
                        backgroundColor: newTheme.accent,
                        borderColor: newTheme.accent,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        preset === PRESET_10 && { color: newTheme.background },
                      ]}
                    >
                      10 minutes before
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handlePresetPress(PRESET_30)}
                    style={[
                      styles.pill,
                      preset === PRESET_30 && {
                        backgroundColor: newTheme.accent,
                        borderColor: newTheme.accent,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pillText,
                        preset === PRESET_30 && { color: newTheme.background },
                      ]}
                    >
                      30 minutes before
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.micro,
                    { marginTop: 10, color: newTheme.textSecondary },
                  ]}
                >
                  Presets trigger relative to the habit time you set in the
                  habit.
                </Text>
              </View>
            )}

            {/* inline DateTimePicker */}
            {showTimePicker && (
              <View style={{ marginTop: 12 }}>
                <DateTimePicker
                  value={reminderAt}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "clock"}
                  is24Hour={false}
                  onChange={onDateTimeChange}
                  //   textColor={newTheme.textPrimary} // iOS only
                />
                {Platform.OS === "android" && (
                  // on Android the picker opens native modal; we just close it after user selects
                  // nothing extra needed here — but keep the flag false after selection (handled in onDateTimeChange)
                  <></>
                )}
              </View>
            )}

            {/* error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* CTA */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: newTheme.divider }]}
                onPress={onClose}
              >
                <Text
                  style={[styles.cancelText, { color: newTheme.textSecondary }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <StyledButton
                label="Save"
                onPress={() => handleSave()}
                disabled={
                  !isSpecified && !preset // require something selected
                }
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default HabitReminderModal;

/* styles */
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  centering: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    maxWidth: 720,
    alignSelf: "center",
    // subtle elevation
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.36,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 18, fontWeight: "700" },
  micro: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },
  selector: {
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pillRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-start",
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    backgroundColor: "transparent",
    marginRight: 8,
  },
  pillText: {
    fontSize: 14,
    color: "#BFC6BC",
    fontWeight: "600",
  },
  footer: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    marginTop: 10,
    color: "#FF7A7A",
    textAlign: "center",
  },
});
