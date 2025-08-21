import React, { useContext, useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { FormInput, Text } from "../../Themed";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import styling from "../style/HabitFrequencyModalStyle";

interface FrequencyModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (frequency: FrequencyObj) => void;
}

export type FrequencyObj = {
  frequency_type: string;
  interval: number;

  days_of_week?: string[];
  days_of_month?: number[];
};

// export type FormattedFrequency = {
//   userDisplay: string;
//   parsedFreq: ReminderOutput;
// };

type ThemeKey = "basic" | "light" | "dark";

export type Frequency =
  | { type: "Daily"; count: number }
  | { type: "Weekly"; days: string[]; count: number }
  | { type: "Monthly"; count: number; dates: number[] };

export type ReminderOutput = {
  frequency_type: "daily" | "weekly" | "monthly";
  interval: number;
  days_of_week?: string[];
  days_of_month?: number[];
};

const HabitFrequencyModal: React.FC<FrequencyModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState<
    "Daily" | "Weekly" | "Monthly"
  >("Daily");
  const [dailyCount, setDailyCount] = useState<number>(1);
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [weeklyCount, setWeeklyCount] = useState<number>(1);
  const [monthlyCount, setMonthlyCount] = useState<number>(1);
  const [monthlyDates, setMonthlyDates] = useState<number[]>([]);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // helper function
  function convertDayAbbreviation(day: string): string {
    const daysMap: { [key: string]: string } = {
      Mo: "mon",
      Tu: "tue",
      We: "wed",
      Th: "thu",
      Fr: "fri",
      Sa: "sat",
      Su: "sun",
    };
    return daysMap[day] || "Invalid day";
  }

  function convertToReminder(input: Frequency): ReminderOutput {
    let reminder: ReminderOutput = {
      frequency_type: input.type.toLowerCase() as
        | "daily"
        | "weekly"
        | "monthly",
      interval: input.count,
    };

    switch (input.type) {
      case "Daily":
        // No extra fields are needed for Daily.
        break;

      case "Weekly":
        if ("days" in input) {
          reminder.days_of_week = input.days.map((day) =>
            convertDayAbbreviation(day)
          );
        }
        break;

      case "Monthly":
        if ("dates" in input) {
          reminder.days_of_month = input.dates;
        }
        break;

      default:
        throw new Error("Unsupported frequency type");
    }
    return reminder;
  }

  const handleSave = () => {
    let frequency: Frequency;
    if (selectedFrequency === "Daily") {
      frequency = { type: "Daily", count: dailyCount };
    } else if (selectedFrequency === "Weekly") {
      frequency = { type: "Weekly", days: weeklyDays, count: weeklyCount };
    } else {
      frequency = { type: "Monthly", count: monthlyCount, dates: monthlyDates };
    }

    let parsedFrequency = convertToReminder(frequency);
    onSave(parsedFrequency);
    onClose();
  };

  const toggleDaySelection = (day: string) => {
    setWeeklyDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleDateSelection = (date: number) => {
    setMonthlyDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Selectt Frequency</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.frequencyContainer}>
            {["Daily", "Weekly", "Monthly"].map((frequency) => (
              <TouchableOpacity
                key={frequency}
                style={[
                  styles.pill,
                  selectedFrequency === frequency && styles.selectedPill,
                ]}
                onPress={() =>
                  setSelectedFrequency(
                    frequency as "Daily" | "Weekly" | "Monthly"
                  )
                }
              >
                <Text style={styles.pillText}>{frequency}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedFrequency === "Daily" && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Every</Text>
              <FormInput
                style={styles.input}
                keyboardType="numeric"
                value={dailyCount.toString()}
                onChangeText={(text: any) => setDailyCount(Number(text))}
                maxLength={2}
              />
              <Text style={styles.label}>days</Text>
            </View>
          )}

          {selectedFrequency === "Weekly" && (
            <View>
              <Text style={styles.inputLabel}>Select Days:</Text>
              <View style={styles.dayContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayPill,
                      weeklyDays.includes(day) && styles.selectedDayPill,
                    ]}
                    onPress={() => toggleDaySelection(day)}
                  >
                    <Text style={styles.dayText}>{day}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Every</Text>
                <FormInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weeklyCount.toString()}
                  onChangeText={(text: any) => setWeeklyCount(Number(text))}
                  maxLength={2}
                />
                <Text style={styles.label}>weeks</Text>
              </View>
            </View>
          )}

          {selectedFrequency === "Monthly" && (
            <View>
              <Text style={styles.inputLabel}>Select Day:</Text>
              <View style={styles.dayContainer}>
                {Array.from({ length: 31 }, (_, i) => (
                  <TouchableOpacity
                    key={i + 1}
                    style={[
                      styles.monthDay,
                      monthlyDates.includes(i + 1) && styles.selectedMonthDay,
                    ]}
                    onPress={() => toggleDateSelection(i + 1)}
                  >
                    <Text style={styles.dayText}>{i + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Every</Text>
                <FormInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={monthlyCount.toString()}
                  onChangeText={(text: any) => setMonthlyCount(Number(text))}
                  maxLength={2}
                />
                <Text style={styles.label}>months</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <View>
              <Text style={styles.saveButtonText}>Save</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default HabitFrequencyModal;
