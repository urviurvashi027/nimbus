import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text } from "@/components/Themed";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
// import HabitDurationModal from "./Modal/HabitDurationModal";
import { Duration } from "@/types/habitTypes";
import styling from "./style/HabitInputStyle";
import DurationModal from "./Modal/DurationModal";
// import styling from "./style/HabitDurationInputStyle";

interface HabitDurationInputProps {
  onSelect: (value: any) => void;
  isEditMode?: Duration;
}

const HabitDurationInput: React.FC<HabitDurationInputProps> = ({
  onSelect,
  isEditMode,
}) => {
  const [duration, setDuration] = useState<Duration>({ all_day: true });

  const [showDurationModal, setShowDurationModal] = useState(false);

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  const handleSave = (selectedDuration: any) => {
    console.log(selectedDuration, "selectedDuration");
    if (selectedDuration.all_day) {
      console.log(selectedDuration.all_day, "selectedDuration.all_day all day");
      onSelect({ all_day: true });
    } else {
      if (selectedDuration.start_time && selectedDuration.end_time) {
        console.log(
          selectedDuration.start_time,
          format(selectedDuration.start_time, "hh:mm:ss"),
          "selectedDuration.start_time both"
        );
        console.log(
          selectedDuration.end_time,
          format(selectedDuration.end_time, "hh:mm:ss"),
          "selectedDuration.end_time both"
        );
        onSelect({
          start_time: format(selectedDuration.start_time, "hh:mm:ss"),
          end_time: format(selectedDuration.end_time, "hh:mm:ss"),
          // start_time: pointTime,
        });
      } else {
        console.log(
          selectedDuration.start_time,
          "selectedDuration.start_time else"
        );
        onSelect({
          start_time: format(selectedDuration.start_time, "hh:mm:ss"),
        });
      }
    }
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
      if (duration.start_time && duration.end_time) {
        onSelect({
          start_time: format(duration.start_time, "hh:mm:ss"),
          end_time: format(duration.end_time, "hh:mm:ss"),
          // start_time: pointTime,
        });
      } else {
        onSelect({
          start_time: format(duration.start_time || new Date(), "hh:mm:ss"),
        });
      }
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
        style={styles.rowItem}
        // style={styles.selectorButton}
        onPress={() => setShowDurationModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="ticket-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>Duration</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue} numberOfLines={1} ellipsizeMode="tail">
            {duration?.all_day === true
              ? "All Day"
              : duration.start_time && duration.end_time
              ? `${format(duration.start_time, "hh:mm a")} - ${format(
                  duration.end_time,
                  "hh:mm a"
                )}`
              : `Point Time: ${format(
                  duration.start_time ?? new Date(),
                  "hh:mm a"
                )}`}
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
        // visible={durationModalOpen}
        isEditMode={duration}
        // onClose={() => setDurationModalOpen(false)}
        onSave={handleHabitDuration}
        // onSave={(d) => {
        //   setDuration(d);
        //   setDurationModalOpen(false);
        // }}
      />

      {/* <HabitDurationModal
        visible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onSave={handleHabitDuration}
        isEditMode={isEditMode}
      /> */}
    </>
  );
};

export default HabitDurationInput;
