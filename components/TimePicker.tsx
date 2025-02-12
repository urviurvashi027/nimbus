import React, { useContext, useState } from "react";
import { Button, View, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { Text } from "./Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "../context/ThemeContext";

interface TimePicker {
  label: string;
  onConfirmTime: (selectedDate: Date) => void;
}

type ThemeKey = "basic" | "light" | "dark";

const TimePicker = (props: TimePicker) => {
  const { onConfirmTime, label } = props;

  const [selectedTime, setSelectedTime] = useState<Date>(new Date());

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    onConfirmTime(date);
    setSelectedTime(date);
    hideDatePicker();
  };
  return (
    <View>
      {/* <Button title="Show Time Picker" onPress={showTimePicker} /> */}

      <TouchableOpacity
        style={styles.timePickerButton}
        onPress={showTimePicker}
      >
        <Text style={styles.timePickerText}>
          Select {label}: {format(selectedTime, "hh:mm a")}
        </Text>
        <Ionicons
          name="time-outline"
          size={24}
          color={themeColors[theme].text}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        // buttonTextColorIOS="red"
      />
    </View>
  );
};

export default TimePicker;

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
