import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text } from "@/components/Themed";
import HabitContext from "@/context/HabitContext";
import { Button, ScreenView } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import HabitDurationModal from "./Modal/HabitDurationModal";
import { Duration } from "./Modal/HabitDurationModal";
import styling from "./style/HabitInputStyle";
// import styling from "./style/HabitDurationInputStyle";

interface HabitDurationInputProps {
  onSelect: (value: any) => void;
}

const HabitDurationInput: React.FC<HabitDurationInputProps> = ({
  onSelect,
}) => {
  const [duration, setDuration] = useState<Duration>({ all_day: true });

  const [showDurationModal, setShowDurationModal] = useState(false);

  const { theme } = useContext(ThemeContext);

  const styles = styling(theme);

  const handleSave = (selectedDuration: any) => {
    // console.log(allDayEnabled, selection);
    if (selectedDuration.all_day) {
      onSelect({ all_day: true });
    } else {
      if (selectedDuration.start_time && selectedDuration.end_time) {
        onSelect({
          start_time: format(selectedDuration.start_time, "hh:mm:ss"),
          end_time: format(selectedDuration.end_time, "hh:mm:ss"),
          // start_time: pointTime,
        });
      } else {
        onSelect({
          start_time: format(selectedDuration.start_time, "hh:mm:ss"),
        });
      }
    }
  };

  // function to handle task duration
  const handleHabitDuration = (selectedDuration: any) => {
    // console.log(selectedDuration, "duration Habit Duration Input");
    setDuration(selectedDuration);
    // handleSave(selectedDuration);
    // onSelect(selectedDuration);
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
  }, [duration]);

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowDurationModal(true)}
      >
        <Ionicons
          style={styles.iconLeft}
          name="alarm-outline"
          size={20}
          color={themeColors[theme].text}
        />
        <View style={styles.inputField}>
          <Text style={styles.label}>Duration</Text>
          <Text
            style={styles.selectorText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {duration?.all_day === true
              ? "All Day"
              : duration.start_time && duration.end_time
              ? `From ${format(duration.start_time, "hh:mm: a")} To ${format(
                  duration.end_time,
                  "hh:mm: a"
                )}`
              : `Point Time: ${format(
                  duration.start_time ?? new Date(),
                  "hh:mm: a"
                )}`}
          </Text>
        </View>
        <Ionicons
          style={styles.iconRight}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
      </TouchableOpacity>

      <HabitDurationModal
        visible={showDurationModal}
        onClose={() => setShowDurationModal(false)}
        onSave={handleHabitDuration}
      />
    </>
  );
};

export default HabitDurationInput;
