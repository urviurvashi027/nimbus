import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import styling from "./style/HabitInputStyle";
import ReminderModal from "./Modal/ReminderModal";
import {
  formatReminderDisplay,
  toBackendTime,
  parseBackendTimeToDate,
} from "@/utils/time";

export type ReminderAt = {
  time?: string; // "HH:mm:ss"
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
};

type EditData = {
  time?: Date | undefined | null;
  ten_min_before?: boolean;
  thirty_min_before?: boolean;
};

interface HabitReminderInputProps {
  isAllDayEnabled: boolean;
  onSelect: (value: any) => void;
  style?: StyleProp<ViewStyle>;
  isEditMode?: EditData;
}

const HabitReminderInput: React.FC<HabitReminderInputProps> = ({
  onSelect,
  isAllDayEnabled,
  isEditMode,
  style,
}) => {
  const { newTheme, spacing } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing);

  const [showReminderAtModal, setShowReminderAtModal] = useState(false);

  // ✅ single source of truth stored here
  const [reminderAt, setReminderAt] = useState<ReminderAt>({});

  // ✅ initialize from edit data once
  useEffect(() => {
    if (!isEditMode) return;

    if (isEditMode.time) {
      const payload: ReminderAt = { time: toBackendTime(isEditMode.time) };
      setReminderAt(payload);
      onSelect(payload);
      return;
    }
    if (isEditMode.ten_min_before) {
      const payload: ReminderAt = { ten_min_before: true };
      setReminderAt(payload);
      onSelect(payload);
      return;
    }
    if (isEditMode.thirty_min_before) {
      const payload: ReminderAt = { thirty_min_before: true };
      setReminderAt(payload);
      onSelect(payload);
    }
  }, [isEditMode, onSelect]);

  console.log("HabitReminderInput rendered", isAllDayEnabled);

  // ✅ consistent UI time across app
  const userDisplay = useMemo(() => {
    return formatReminderDisplay(reminderAt, { fallback: "Select the preset" });
  }, [reminderAt]);

  const handleHabitReminder = (next: ReminderAt) => {
    setReminderAt(next);
    onSelect(next); // ✅ time OR preset goes up
  };

  // ✅ convert current state into modal editMode shape (Date for time)
  const modalEditMode = useMemo(() => {
    if (reminderAt.time) {
      return { time: parseBackendTimeToDate(reminderAt.time) };
    }
    if (reminderAt.ten_min_before) return { ten_min_before: true };
    if (reminderAt.thirty_min_before) return { thirty_min_before: true };
    return null;
  }, [reminderAt]);

  useEffect(() => {
    if (isAllDayEnabled) {
      setReminderAt({});
      onSelect({}); // clear reminder in parent
    }
  }, [isAllDayEnabled, onSelect]);

  return (
    <>
      <TouchableOpacity
        style={[styles.rowItem, style]}
        onPress={() => setShowReminderAtModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="alarm-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>Your daily nudge</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue} numberOfLines={1} ellipsizeMode="tail">
            {userDisplay}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textSecondary}
          />
        </View>
      </TouchableOpacity>

      <ReminderModal
        visible={showReminderAtModal}
        onClose={() => setShowReminderAtModal(false)}
        isAllDayEnabled={isAllDayEnabled}
        onSave={handleHabitReminder}
        isEditMode={modalEditMode} // ✅ IMPORTANT: pass current value
      />
    </>
  );
};

export default HabitReminderInput;
