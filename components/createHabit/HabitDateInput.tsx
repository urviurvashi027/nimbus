import { Text } from "react-native";
import { View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { HabitDateType } from "./Modal/HabitDateModal";
import HabitDateModal from "./Modal/HabitDateModal";
// import styling from "./style/HabitDateInputStyle";
import styling from "./style/HabitInputStyle";

interface HabitDateInputProps {
  onSelect: (value: any) => void;
}

const HabitDateInput: React.FC<HabitDateInputProps> = ({ onSelect }) => {
  const [habitDate, setHabitDate] = useState<HabitDateType>({
    start_date: new Date(),
  });
  const [userDisplay, setUserDisplay] = useState<string>();

  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  const { theme } = useContext(ThemeContext);

  const styles = styling(theme);

  // function which will be called on
  const handleStartSave = (habitDate: HabitDateType) => {
    // const { start_date, end_date } = habitDate;
    // let result = {};
    setHabitDate(habitDate);
    // const userDisplay = end_date
    //   ? `${format(start_date, "dd-MM-yyyy")} - ${format(
    //       end_date,
    //       "yyyy-MM-dd"
    //     )}`
    //   : `${format(start_date, "dd-MM-yyyy")}`;

    // setUserDisplay(userDisplay);
    // if (start_date && end_date) {
    //   result = {
    //     start_date: format(start_date, "yyyy-MM-dd"),
    //     end_date: format(end_date, "yyyy-MM-dd"),
    //   };
    // } else {
    //   result = {
    //     start_date: format(start_date, "yyyy-MM-dd"),
    //   };
    // }
    setShowStartTaskModal(false);

    // onSelect(result);
  };

  useEffect(() => {
    const { start_date, ...rest } = habitDate;
    let result = {};

    const userDisplay = rest.end_date
      ? `${format(start_date, "dd-MM-yyyy")} - ${format(
          rest.end_date,
          "dd-MM-yyyy"
        )}`
      : `${format(start_date, "dd-MM-yyyy")}`;

    setUserDisplay(userDisplay);
    if (start_date && rest.end_date) {
      result = {
        start_date: format(start_date, "yyyy-MM-dd"),
        end_date: format(rest.end_date, "yyyy-MM-dd"),
      };
    } else {
      result = {
        start_date: format(start_date, "yyyy-MM-dd"),
      };
    }
    onSelect(result);
  }, [habitDate]);

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowStartTaskModal(true)}
      >
        <Ionicons
          style={styles.iconLeft}
          name="calendar-outline"
          size={20}
          color={themeColors[theme].text}
        />
        <View style={styles.inputField}>
          <Text style={styles.label}>Start Date</Text>
          <Text
            style={[styles.selectorText, { width: 130 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {habitDate ? userDisplay : "Select Date"}
          </Text>
        </View>
        <Ionicons
          style={styles.iconRight}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
      </TouchableOpacity>

      <HabitDateModal
        visible={showStartTaskModal}
        onClose={() => setShowStartTaskModal(false)}
        onSave={handleStartSave}
      />
    </>
  );
};

export default HabitDateInput;
