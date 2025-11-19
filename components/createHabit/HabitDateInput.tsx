import { Text } from "react-native";
import { View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import ThemeContext from "@/context/ThemeContext";
import { HabitDateType } from "@/types/habitTypes";
// import HabitDateModal from "./Modal/HabitDateModal";
// import styling from "./style/HabitDateInputStyle";
import styling from "./style/HabitInputStyle";
import StartDateModal from "./Modal/StartDateModal";

interface HabitDateInputProps {
  onSelect: (value: any) => void;
  isEditMode?: HabitDateType;
}

const HabitDateInput: React.FC<HabitDateInputProps> = ({
  onSelect,
  isEditMode,
}) => {
  const [habitDate, setHabitDate] = useState<HabitDateType>({
    start_date: new Date(),
  });
  const [userDisplay, setUserDisplay] = useState<string>();

  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  // function which will be called on
  const handleStartSave = (habitDate: HabitDateType) => {
    console.log(habitDate, "habitDate");
    setHabitDate(habitDate);

    setShowStartTaskModal(false);
    handleSave(habitDate);
  };

  const handleSave = (habitDate: HabitDateType) => {
    const { start_date, end_date, ...rest } = habitDate;
    let result = {};
    if (start_date && end_date) {
      result = {
        start_date: format(start_date, "yyyy-MM-dd"),
        end_date: format(end_date, "yyyy-MM-dd"),
      };
    } else {
      result = {
        start_date: format(start_date, "yyyy-MM-dd"),
      };
    }

    if (rest.frequency_type) {
      result = {
        ...result,
        ...rest,
      };
      console.log(result, "going to parent");
    }
    onSelect(result);
  };

  useEffect(() => {
    if (isEditMode) {
      setHabitDate(habitDate);
    } else {
      // console.log("Edit mode is off");
    }
  }, [isEditMode]);

  useEffect(() => {
    const { start_date, end_date, ...rest } = habitDate;
    // let result = {};

    const userDisplay = end_date
      ? `${format(start_date, "dd-MM-yyyy")} - ${format(
          end_date,
          "dd-MM-yyyy"
        )}`
      : `${format(start_date, "dd-MM-yyyy")}`;

    setUserDisplay(userDisplay);
    handleSave(habitDate);
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

    // if (rest.frequency_type) {
    //   result = {
    //     ...result,
    //     ...rest,
    //   };
    // }
    // onSelect(result);
  }, []);

  return (
    <>
      <TouchableOpacity
        style={styles.rowItem}
        onPress={() => setShowStartTaskModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="calendar-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>When</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue}>
            {habitDate ? userDisplay : "Select Date"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* The modal itself */}
      <StartDateModal
        visible={showStartTaskModal}
        onClose={() => setShowStartTaskModal(false)}
        // visible={dateModalVisible}
        // onClose={() => setDateModalVisible(false)}
        isEditMode={habitDate || undefined} // pass existing data for editing
        onSave={handleStartSave}
        // onSave={(value) => {
        //   setHabitDate(value); // save to state
        //   setDateModalVisible(false);
        // }}
      />

      {/* <HabitDateModal
        visible={showStartTaskModal}
        onClose={() => setShowStartTaskModal(false)}
        onSave={handleStartSave}
        isEditMode={isEditMode}
      /> */}
    </>
  );
};

export default HabitDateInput;
