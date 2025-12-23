import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

import ThemeContext from "@/context/ThemeContext";

import { Duration } from "@/types/habitTypes";

import styling from "./style/HabitInputStyle";
import DurationModal from "./Modal/DurationModal";
import { formatDurationDisplay, toBackendDurationPayload } from "@/utils/time";

interface HabitDurationInputProps {
  onSelect: (value: any) => void;
  isEditMode?: Duration;
  style?: StyleProp<ViewStyle>;
}

const HabitDurationInput: React.FC<HabitDurationInputProps> = ({
  onSelect,
  style,
  isEditMode,
}) => {
  const [duration, setDuration] = useState<Duration>({ all_day: true });

  const [showDurationModal, setShowDurationModal] = useState(false);

  const { newTheme, spacing } = useContext(ThemeContext);

  const styles = styling(newTheme, spacing);

  const handleSave = (selectedDuration: any) => {
    console.log(selectedDuration, "selectedDuration");
    onSelect(toBackendDurationPayload(selectedDuration));
  };

  // function to handle task duration
  const handleHabitDuration = (selectedDuration: any) => {
    setDuration(selectedDuration);
    handleSave(selectedDuration);
  };

  useEffect(() => {
    if (duration.all_day) {
      onSelect({ all_day: true });
    } else {
      onSelect(toBackendDurationPayload(duration));
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setDuration(isEditMode);
    }
  }, [isEditMode]);

  return (
    <>
      <TouchableOpacity
        style={[styles.rowItem, style]}
        onPress={() => setShowDurationModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="time-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>How long it lasts</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue} numberOfLines={1} ellipsizeMode="tail">
            {formatDurationDisplay(duration, { allDayLabel: "All Day" })}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* The modal */}
      <DurationModal
        visible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        isEditMode={duration}
        onSave={handleHabitDuration}
      />
    </>
  );
};

export default HabitDurationInput;
