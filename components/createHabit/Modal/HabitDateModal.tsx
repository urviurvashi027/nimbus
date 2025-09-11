import React, { useContext, useEffect, useState } from "react";
import { View, Modal, Switch, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FormInput, Text } from "../../Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/theme/Colors";
import DatePicker from "../../DatePicker";
import styling from "../style/HabitDateModalStyle";

export type HabitDateType = {
  start_date: Date;
  end_date?: Date;
  frequency_type?: string;
  interval?: number;

  days_of_week?: string[];
  days_of_month?: number[];
};

export type ReminderOutput = {
  frequency_type: "daily" | "weekly" | "monthly";
  interval: number;
  days_of_week?: string[];
  days_of_month?: number[];
};

interface HabitDateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (habitDate: HabitDateType) => void;
  isEditMode?: HabitDateType;
}

// export type FrequencyObj = {
//   frequency_type: string;
//   interval: number;

//   days_of_week?: string[];
//   days_of_month?: number[];
// };

// export type FormattedFrequency = {
//   userDisplay: string;
//   parsedFreq: ReminderOutput;
// };

// type ThemeKey = "basic" | "light" | "dark";

export type Frequency =
  | { frequency_type: "Daily"; interval: number }
  | { frequency_type: "Weekly"; days_of_week: string[]; interval: number }
  | { frequency_type: "Monthly"; days_of_month: number[]; interval: number };

const HabitDateModal: React.FC<HabitDateModalProps> = ({
  visible,
  onClose,
  onSave,
  isEditMode,
}) => {
  const [selectedFrequency, setSelectedFrequency] = useState<
    "Daily" | "Weekly" | "Monthly" | ""
  >("");
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
  const [weeklyCount, setWeeklyCount] = useState<number>(1);
  const [monthlyCount, setMonthlyCount] = useState<number>(1);
  const [monthlyDates, setMonthlyDates] = useState<number[]>([]);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isEndDateEnabled, setIsEndDateEnabled] = useState(false);
  const [isReapeatEnabled, setIsRepeatEnabled] = useState(false);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    if (isEditMode) {
      setStartDate(isEditMode.start_date);
      if (isEditMode.end_date) {
        setIsEndDateEnabled(true);
        setEndDate(isEditMode.end_date);
      }
      if (isEditMode.frequency_type) {
        setFrequencyDetails(isEditMode);
        // setSelectedFrequency(isEditMode.frequency_type)
      }
    } else {
      console.log("Edit mode is off modal");
    }
  }, [isEditMode]);

  const setFrequencyDetails = (data: any) => {
    const { frequency_type, interval, ...rest } = data;
    setIsRepeatEnabled(true);
    setSelectedFrequency(frequency_type);
    switch (frequency_type) {
      case "Daily":
        setDailyCount(interval);
        break;

      case "Weekly":
        setWeeklyCount(interval);
        setWeeklyDays(rest.days_of_week);
        break;

      case "Monthly":
        setMonthlyCount(interval);
        setMonthlyDates(rest.days_of_month);
        break;

      default:
        throw new Error("Unsupported frequency type");
    }
  };

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

  const handleStartDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (selectedDate: Date) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
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

  function convertToReminder() {
    // let reminder: ReminderOutput = {
    //   frequency_type: input.frequency_type.toLowerCase() as
    //     | "daily"
    //     | "weekly"
    //     | "monthly",
    //   interval: input.interval,
    // };

    let frequency: Frequency | {} = {};

    switch (selectedFrequency) {
      case "Daily":
        frequency = { frequency_type: "daily", interval: dailyCount };
        break;

      case "Weekly":
        let days: string[] = [];
        // if ("days" in input) {
        days = weeklyDays.map((day) => convertDayAbbreviation(day));
        // }
        frequency = {
          frequency_type: "weekly",
          days_of_week: days,
          interval: weeklyCount,
        };
        break;

      case "Monthly":
        frequency = {
          frequency_type: "monthly",
          interval: monthlyCount,
          days_of_month: monthlyDates,
        };
        break;

      default:
        throw new Error("Unsupported frequency type");
    }
    return frequency;
  }

  const handleSave = () => {
    let frequency: Frequency | {} = convertToReminder();
    // if (selectedFrequency === "Daily") {
    //   frequency = { frequency_type: "daily", interval: dailyCount };
    // } else if (selectedFrequency === "Weekly") {
    //   frequency = {
    //     frequency_type: "weekly",
    //     days_of_week: weeklyDays,
    //     interval: weeklyCount,
    //   };
    // } else if (selectedFrequency === "Monthly") {
    //   frequency = {
    //     frequency_type: "monthly",
    //     interval: monthlyCount,
    //     days_of_month: monthlyDates,
    //   };
    // }
    let parsedValue = {
      start_date: startDate,
      end_date: isEndDateEnabled ? endDate : undefined,
      ...frequency,
    };
    onSave(parsedValue);
    onClose();
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
            <Text style={styles.title}>Select Start Date</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={themeColors[theme].text}
              />
            </TouchableOpacity>
          </View>

          <DatePicker
            onConfirmDate={handleStartDateChange}
            label="Start Date"
            selectedDateValue={startDate}
            minimumDate={new Date()}
          ></DatePicker>

          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Repeat</Text>
            <Switch
              value={isReapeatEnabled}
              thumbColor={themeColors.basic.primaryColor}
              trackColor={{
                true: `${themeColors.basic.tertiaryColor}`,
              }}
              onValueChange={(value) => {
                setIsRepeatEnabled(value);
              }}
            />
          </View>

          {isReapeatEnabled && (
            <>
              <View>
                {/* <View style={styles.toggleContainer}>
                  <Text style={styles.label}>Repeat</Text>
                  <Switch
                    value={isReapeatEnabled}
                    thumbColor={themeColors.basic.primaryColor}
                    trackColor={{
                      true: `${themeColors.basic.tertiaryColor}`,
                    }}
                    onValueChange={(value) => {
                      setIsRepeatEnabled(value);
                    }}
                  />
                </View> */}
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
                    <Text style={styles.labelFreq}>Every</Text>
                    <FormInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={dailyCount.toString()}
                      onChangeText={(text: any) => setDailyCount(Number(text))}
                      maxLength={2}
                    />
                    <Text style={styles.labelFreq}>days</Text>
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
                      <Text style={styles.labelFreq}>Every</Text>
                      <FormInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={weeklyCount.toString()}
                        onChangeText={(text: any) =>
                          setWeeklyCount(Number(text))
                        }
                        maxLength={2}
                      />
                      <Text style={styles.labelFreq}>weeks</Text>
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
                            monthlyDates.includes(i + 1) &&
                              styles.selectedMonthDay,
                          ]}
                          onPress={() => toggleDateSelection(i + 1)}
                        >
                          <Text style={styles.dayText}>{i + 1}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.labelFreq}>Every</Text>
                      <FormInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={monthlyCount.toString()}
                        onChangeText={(text: any) =>
                          setMonthlyCount(Number(text))
                        }
                        maxLength={2}
                      />
                      <Text style={styles.labelFreq}>months</Text>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.toggleContainer}>
                <Text style={styles.label}>Set End Date</Text>
                <Switch
                  value={isEndDateEnabled}
                  thumbColor={themeColors.basic.primaryColor}
                  trackColor={{
                    true: `${themeColors.basic.tertiaryColor}`,
                  }}
                  onValueChange={(value) => {
                    setIsEndDateEnabled(value);
                  }}
                />
              </View>
              {isEndDateEnabled && (
                <>
                  <DatePicker
                    onConfirmDate={handleEndDateChange}
                    label="End Date"
                    selectedDateValue={endDate}
                    minimumDate={startDate}
                  ></DatePicker>
                </>
              )}
            </>
            // ) &&
            // isEndDateEnabled && (
            //   <>
            //     <DatePicker
            //       onConfirmDate={handleEndDateChange}
            //       label="End Date"
            //       selectedDateValue={endDate}
            //       minimumDate={startDate}
            //     ></DatePicker>
            //   </>
            // )}
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

export default HabitDateModal;
