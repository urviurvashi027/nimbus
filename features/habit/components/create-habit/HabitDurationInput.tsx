import {
  View,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
// import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

import ThemeContext from "@/contexts/ThemeContext";

import { Duration } from "@/features/habit/types/habitTypes";

import styling from "./style/HabitInputStyle";
import DurationModal from "./Modal/DurationModal";
import { formatDurationDisplay, toBackendDurationPayload } from "@/utils/date-time";

interface HabitDurationInputProps {
  onSelect: (value: any) => void;
  isEditMode?: Duration;
  style?: StyleProp<ViewStyle>;
  label?: string;
  compact?: boolean;
  showLabel?: boolean;
  showIcon?: boolean;
}

const HabitDurationInput: React.FC<HabitDurationInputProps> = ({
  onSelect,
  style,
  isEditMode,
  label = "Rhythm",
  compact = false,
  showLabel = true,
  showIcon = true,
}) => {
  const [duration, setDuration] = useState<Duration>({ all_day: true });

  const [showDurationModal, setShowDurationModal] = useState(false);

  const { newTheme, spacing } = useContext(ThemeContext);

  const styles = styling(newTheme, spacing);
  const showLeftContent = showLabel || showIcon;
  const compactRow = compact || !showLeftContent;

  const handleSave = (selectedDuration: any) => {
    onSelect(toBackendDurationPayload(selectedDuration));
  };

  const handleHabitDuration = (selectedDuration: any) => {
    setDuration(selectedDuration);
    handleSave(selectedDuration);
  };

  useEffect(() => {
    if (isEditMode) {
      setDuration(isEditMode);
    }
  }, [isEditMode]);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.rowItem,
          compactRow && { alignSelf: "flex-start", justifyContent: "space-between" },
          style,
        ]}
        onPress={() => setShowDurationModal(true)}
      >
        {showLeftContent && (
          <View style={styles.rowLeft}>
            {showIcon && (
              <Ionicons
                style={styles.iconLeft}
                name="time-outline"
                size={20}
                color={newTheme.textSecondary}
              />
            )}
            {showLabel && <Text style={styles.rowLabel}>{label}</Text>}
          </View>
        )}

        <View style={[styles.rowRight, compactRow && { maxWidth: "100%" }]}>
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
        title="Rhythm"
        subtitle="Choose whether this habit runs all day or within a focused window."
      />
    </>
  );
};

export default HabitDurationInput;
