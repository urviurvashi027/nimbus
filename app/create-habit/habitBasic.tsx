import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import HabitContext from "@/context/HabitContext";
import { Button, FormInput, ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { Text } from "@/components/Themed";
import HabitTypeInput from "@/components/createHabit/HabitTypeInput";
import HabitTagsInput from "@/components/createHabit/HabitTagsInput";
import { ThemeKey } from "@/components/Themed";
import { HabitCreateRequest, HabitType } from "@/types/habitTypes";
import HabitMetricInput from "@/components/createHabit/HabitMetricInput";
import HabitFrequencyInput from "@/components/createHabit/HabitFrequencyInput";
import HabitDurationInput from "@/components/createHabit/HabitDurationInput";
import HabitDateInput from "@/components/createHabit/HabitDateInput";
import HabitReminderInput from "@/components/createHabit/HabitReminderInput";
import { MetricFormat } from "@/components/createHabit/Modal/HabitMetricModal";
import { FrequencyObj } from "@/components/createHabit/Modal/HabitFrequencyModal";
import { Duration } from "@/components/createHabit/Modal/HabitDurationModal";
import { HabitDateType } from "@/components/createHabit/Modal/HabitDateModal";
import { ReminderAt } from "@/components/createHabit/Modal/HabitReminderModal";
import { createHabit } from "@/services/habitService";
import SubtaskInput from "@/components/createHabit/HabitSubTaskInput";

export default function HabitBasic() {
  // form state
  const [colorSchema, setColorSchema] = useState<
    "red" | "blue" | "green" | "yellow" | "black"
  >("red");
  const [name, setName] = useState("");
  const [habitTypeId, sethabitTypeId] = useState<number>(0);
  const [tags, setTags] = useState<any>([]);
  const [metric, setMetric] = useState<MetricFormat | null>(null);
  const [frequency, setFrequency] = useState<FrequencyObj | null>(null);
  const [duration, setDuration] = useState<Duration>({ all_day: true });
  const [date, setDate] = useState<HabitDateType>();
  const [reminderAt, setReminderAt] = useState<ReminderAt | null>(null);

  // context
  const { habitData, setHabitData } = useContext(HabitContext);
  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  // navigation setting
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Habit Basic Details",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header,
        paddingTop: 5,
        height: 40,
      },
    });
  }, [navigation]);

  // function to handle color selection
  const handleColorSelect = (
    color: "red" | "blue" | "green" | "yellow" | "black"
  ) => {
    setColorSchema(color);
  };

  // function to hanlde color selection
  const handleHabitTypeSelect = (habitTypeId: number) => {
    console.log("selected type id", habitTypeId);
    sethabitTypeId(habitTypeId);
  };

  // function to handle habit tags selection
  const handleHabitTagSelection = (selectedTags: any) => {
    console.log(
      selectedTags,
      "selectedTags selectedTags handleHabitTagSelection-------------"
    );
    setTags(selectedTags);
  };

  // function to handle metric selection
  const handleMetricSelect = (value: any) => {
    console.log(value, "habit metric is selected");
    setMetric(value);
  };

  // function to handle frequency selection
  const handleFrequencySelect = (value: any) => {
    console.log(value, "habit metric:: handleFrequencySelect:: value");
    setFrequency(value);
  };

  // function to hanlde duration selection
  const handleDurationSelect = (value: any) => {
    console.log(value, "habit metric:: handleDurationSelect:: value");
    setDuration(value);
  };

  // function to hanlde date selection
  const handleHabitStartDate = (value: any) => {
    console.log(value, "handleHabitStartDate from schedules");
    setDate(value);
  };

  // function to handle reminder selection
  const handleReminderSelect = (value: any) => {
    console.log(value, "handleReminderSelect from schedules");
    setReminderAt(value);
  };

  // parsed value selection
  const getSelectedTag = () => {
    const tagNames = tags.map((tag: any) => tag.name);
    return tagNames;
  };

  const isAllDayEnabled = () => {
    console.log(duration.all_day ? true : false, "from value set");
    return duration.all_day ? true : false;
  };

  const getFrequencyDetail = () => {
    return { ...frequency, ...date };
  };

  const getCreateHabitData = (): HabitCreateRequest => {
    const freq = getFrequencyDetail();

    let result = {
      name: name,
      habit_type_id: habitTypeId,
      color: colorSchema,
      habit_metric: metric,
      habit_duration: duration,
      habit_frequency: freq,
      remind_at: reminderAt,
    };

    const res = tags.length ? { result, tag: tags } : result;

    creatHabitApi(res);

    console.log(result, "from habit create data --------------------");
    return {
      name: "Water Intake 2",
      description: "Drink 3 liters of water daily",
      habit_type_id: 1,
      habit_metric: {
        unit: "liters",
        count: 3.0,
      },
      habit_duration: {
        start_time: "09:00:00",
        end_time: "21:00:00",
        all_day: false,
      },
      habit_frequency: {
        frequency_type: "daily",
        interval: 1,
        start_date: "2025-01-01",
        end_date: "2025-12-31",
      },

      color: "#2f2f2f",
      tags: ["Hydration", "Health"],

      remind_at: {
        ten_min_before: true,
      },
      subtasks: ["Drink 1L before lunch", "Drink 1L after lunch"],
    };
  };

  const creatHabitApi = async (data: any) => {
    const result = await createHabit(data);
    if (result && result.success) {
      // console.log(result, "succesfully created");
      router.replace("/(auth)/(tabs)");
    }
    if (result && result.error) {
      alert(result);
    }
  };

  // function to handle continue click
  const onSubmitClick = () => {
    getCreateHabitData();

    // if (!name && habitTypeId) {
    //   alert("Please fill in the required field");
    // } else {
    //   setHabitData({
    //     ...habitData,
    //     color: colorSchema,
    //     name: name,
    //     habit_type_id: habitTypeId,
    //     tags: getSelectedTag(),
    //   });
    //   router.push("/create-habit/habitMetric");
    // }
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <SafeAreaView style={styles.gestureContainer}>
        <ScrollView>
          <ScreenView
            style={{
              paddingTop: Platform.OS === "ios" ? 20 : 20,
            }}
          >
            {/* <View style={{ backgroundColor: "#dfd9f9" }}> */}
            <View>
              <View style={styles.colorOptionsContainer}>
                {["red", "blue", "green", "yellow", "black"].map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      colorSchema === color && styles.selectedColor,
                    ]}
                    onPress={() =>
                      handleColorSelect(
                        color as "red" | "blue" | "green" | "yellow" | "black"
                      )
                    }
                  />
                ))}
              </View>

              {/* Task Name */}
              <Text style={styles.label}>Task Name</Text>
              <FormInput
                style={styles.input}
                placeholderTextColor={themeColors.basic.mediumGrey}
                placeholder="Enter task name"
                value={name}
                onChangeText={setName}
              />

              <HabitTypeInput onSelect={handleHabitTypeSelect} />

              <HabitMetricInput onSelect={handleMetricSelect} />
              <HabitFrequencyInput onSelect={handleFrequencySelect} />
              <HabitDurationInput onSelect={handleDurationSelect} />
              <HabitDateInput onSelect={handleHabitStartDate} />
              <HabitReminderInput
                isAllDayEnabled={isAllDayEnabled()}
                onSelect={handleReminderSelect}
              />
              <HabitTagsInput onSelect={handleHabitTagSelection} />
              {/* <SubtaskInput /> */}
            </View>
            <Button
              style={styles.btn}
              textStyle={styles.btnText}
              title="Submit"
              onPress={onSubmitClick}
            />
          </ScreenView>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    gestureContainer: {
      flex: 1,
      backgroundColor: themeColors[theme].background,
    },
    header: {
      color: themeColors[theme]?.text,
    },
    container: {
      marginTop: 60,
    },
    btn: {
      marginTop: 30,
      backgroundColor: themeColors[theme]?.primaryColor,
      padding: 20,
      alignItems: "center",
      borderRadius: 10,
    },
    btnText: {
      color: themeColors[theme]?.text,
      fontWeight: 800,
      fontSize: 18,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      color: "#333",
    },
    label: {
      fontSize: 16,
      marginBottom: 10,
      marginTop: 10,
    },
    colorCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    selectedColor: {
      borderColor: "blue",
    },
    colorOptionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      paddingTop: 30,
    },
  });
