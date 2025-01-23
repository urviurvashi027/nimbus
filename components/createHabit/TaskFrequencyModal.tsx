import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FrequencyModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (frequency: FormattedFrequency) => void;
}

export type FormattedFrequency = {
  userDisplay: string;
  parsedFreq: ReminderOutput;
};

export type Frequency =
  | { type: "Daily"; count: number }
  | { type: "Weekly"; days: string[]; count: number }
  | { type: "Monthly"; count: number; dates: number[] };

export type ReminderOutput = {
  frequencyType: "daily" | "weekly" | "monthly";
  details: {
    interval: number;
    daysOfWeek?: string[];
    specificDate?: number[];
  };
};

const FrequencyModal: React.FC<FrequencyModalProps> = ({
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
      Mo: "Monday",
      Tu: "Tuesday",
      We: "Wednesday",
      Th: "Thursday",
      Fr: "Friday",
      Sa: "Saturday",
      Su: "Sunday",
    };
    return daysMap[day] || "Invalid day";
  }

  function convertToReminder(input: Frequency): ReminderOutput {
    let reminder: ReminderOutput = {
      frequencyType: input.type.toLowerCase() as "daily" | "weekly" | "monthly",
      details: {
        interval: input.count,
      },
    };

    switch (input.type) {
      case "Daily":
        // No extra fields are needed for Daily.
        break;

      case "Weekly":
        if ("days" in input) {
          reminder.details.daysOfWeek = input.days.map((day) =>
            convertDayAbbreviation(day)
          );
        }
        break;

      case "Monthly":
        if ("dates" in input) {
          reminder.details.specificDate = input.dates;
        }
        break;

      default:
        throw new Error("Unsupported frequency type");
    }

    return reminder;
  }

  function formatReminder(reminder: any) {
    let { frequencyType, details } = reminder;
    let displayString = "";

    switch (frequencyType) {
      case "daily":
        if (details.interval === 1) {
          displayString = "Daily";
        } else {
          displayString = `Every ${details.interval} days`;
        }
        break;

      case "weekly":
        if (details.interval === 1) {
          displayString = "Weekly";
        } else {
          displayString = `Every ${details.interval} weeks`;
        }
        if (details.daysOfWeek && details.daysOfWeek.length > 0) {
          displayString += ` on ${details.daysOfWeek.join(" and ")}`;
        }
        break;

      case "monthly":
        if (details.interval === 1) {
          displayString = "Monthly";
        } else {
          displayString = `Every ${details.interval} months`;
        }
        if (details.specificDate) {
          displayString += ` on the ${details.specificDate}th`;
        }
        if (details.monthsOfYear && details.monthsOfYear.length > 0) {
          const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          const selectedMonths = details.monthsOfYear.map(
            (monthIndex: number) => monthNames[monthIndex - 1]
          );
          displayString += ` in ${selectedMonths.join(", ")}`;
        }
        break;

      default:
        displayString = "Unknown frequency";
    }

    return displayString;
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

    // console.log(frequency, "----------------from frequency modal-------------");

    let parsedFrequency = convertToReminder(frequency);
    let userDisplayFreq = formatReminder(parsedFrequency);
    let result = {
      userDisplay: userDisplayFreq,
      parsedFreq: parsedFrequency,
    };

    // console.log("for user diaply format", )
    onSave(result);
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
            <Text style={styles.title}>Select Frequency</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
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
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={dailyCount.toString()}
                onChangeText={(text) => setDailyCount(Number(text))}
                maxLength={2}
              />
              <Text style={styles.label}>days</Text>
            </View>
          )}

          {selectedFrequency === "Weekly" && (
            <View>
              <Text style={styles.label}>Select Days:</Text>
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
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={weeklyCount.toString()}
                  onChangeText={(text) => setWeeklyCount(Number(text))}
                  maxLength={2}
                />
                <Text style={styles.label}>weeks</Text>
              </View>
            </View>
          )}

          {selectedFrequency === "Monthly" && (
            <View>
              <Text style={styles.label}>Select Day:</Text>
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
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={monthlyCount.toString()}
                  onChangeText={(text) => setMonthlyCount(Number(text))}
                  maxLength={2}
                />
                <Text style={styles.label}>months</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  pill: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  selectedPill: {
    backgroundColor: "#007AFF",
  },
  pillText: {
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginRight: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    width: 50,
    textAlign: "center",
  },
  dayContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  dayPill: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
    margin: 5,
  },
  selectedDayPill: {
    backgroundColor: "#007AFF",
  },
  dayText: {
    color: "#333",
  },
  monthDay: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  selectedMonthDay: {
    backgroundColor: "#007AFF",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FrequencyModal;
