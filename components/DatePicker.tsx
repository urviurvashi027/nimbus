import React, { useContext, useEffect, useState } from "react";
import { Button, TouchableOpacity, View, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Text } from "./Themed";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";

type ThemeKey = "basic" | "light" | "dark";

interface DatePicker {
  label: string;
  selectedDateValue: Date;
  onConfirmDate: (selectedDate: Date) => void;
  minimumDate: Date;
}

const DatePicker = (props: DatePicker) => {
  const { onConfirmDate, label, minimumDate, selectedDateValue } = props;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  useEffect(() => {
    setSelectedDate(selectedDateValue);
  }, [selectedDateValue]);

  const handleConfirm = (date: any) => {
    hideDatePicker();
    setSelectedDate(date);
    onConfirmDate(date);
  };

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <View>
      {/* <Button title="Show Date Picker" onPress={showDatePicker} /> */}

      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={showDatePicker}
      >
        <Text style={styles.timePickerText}>
          Select {label}: {format(selectedDate, "dd MMMM yyyy")}
        </Text>
        <Ionicons
          name="time-outline"
          size={24}
          color={themeColors[theme].text}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={minimumDate}
        // buttonTextColorIOS="red"
      />
    </View>
  );
};

export default DatePicker;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    label: {
      fontSize: 16,
    },
    timePickerButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    timePickerText: {
      fontSize: 16,
      color: themeColors[theme].text,
    },
  });
