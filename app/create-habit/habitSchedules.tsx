import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Text, ThemeKey, Button, ScreenView } from "@/components/Themed";
import HabitContext from "@/context/HabitContext";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { HabitDateType } from "@/components/createHabit/Modal/HabitDateModal";
import { ReminderAt } from "@/components/createHabit/Modal/HabitReminderModal";
import HabitDateInput from "@/components/createHabit/HabitDateInput";
import HabitReminderInput from "@/components/createHabit/HabitReminderInput";

export default function HabitMetric() {
  const [reminderAt, setReminderAt] = useState<ReminderAt | null>(null);
  const [habitDate, setHabitDate] = useState<HabitDateType>();

  const { habitData, setHabitData } = useContext(HabitContext);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      // headerStyle: {
      //   backgroundColor: "#f4511e",
      // },
      headerTransparent: true,
      headerTitle: "Habit Schedules Details",
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

  const styles = styling(theme);

  // function to handle Habit Reminder
  // const handleHabitReminder = (reminderAt: any) => {
  //   // console.log(reminderAt, "from reminderAt");
  //   setReminderAt(reminderAt);
  // };

  const handleHabitStartDate = (value: any) => {
    // console.log(value, "handleHabitStartDate from schedules");
  };

  const handleReminderSelect = (value: any) => {
    // console.log(value, "handleReminderSelect from schedules");
  };

  // function which will be called on
  // const handleStartTaskSave = (habitDate: parsedValue) => {
  //   // Handle the start and end date logic here
  //   // console.log(habitDate, "habitDate");
  //   setHabitDate(habitDate);
  //   setShowStartTaskModal(false);
  // };

  const getParsedDate = (habitDate: any) => {
    console.log(habitDate, "getParsedDate");
    if (habitDate.startDate && habitDate.endDate) {
      return {
        start_date: habitDate.startDate,
        end_date: habitDate.endDate,
      };
    } else if (habitDate.startDate) {
      return { start_date: habitDate.startDate };
    }
    return {};
  };

  // useEffect(() => {
  //   console.log(habitData, "habitData from Schedules");
  //   if (habitData.habit_frequency?.start_date) {
  //     console.log("I am getting called");
  //     creatHabitApi(habitData);
  //   }
  // }, [habitData]);

  // const creatHabitApi = async (data: any) => {
  //   const result = await createHabit(data);
  //   if (result && result.success) {
  //     // console.log(result, "succesfully created");
  //     router.replace("/(auth)/(tabs)");
  //   }
  //   if (result && result.error) {
  //     alert(result);
  //   }
  // };

  const onContinueClick = () => {
    // const habitDateVal = getParsedDate(habitDate);
    // console.log(habitDateVal, "habitDateVal");
    // setHabitData((prevInfo: any) => ({
    //   ...prevInfo,
    //   remind_at: reminderAt?.val,
    //   habit_frequency: {
    //     ...prevInfo.habit_frequency,
    //     ...habitDateVal,
    //   },
    // }));
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 80 : 20,
      }}
    >
      <View style={styles.container}>
        <HabitDateInput onSelect={handleHabitStartDate} />
        <HabitReminderInput onSelect={handleReminderSelect} />
      </View>

      <Button
        style={styles.btn}
        textStyle={styles.btnText}
        title="Continue"
        onPress={onContinueClick}
      />
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    header: {
      color: themeColors[theme]?.text,
    },
    container: {
      marginTop: 20,
    },
    btn: {
      marginTop: 60,
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
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: themeColors.basic.GRAY,
    },
    inputLabel: {
      marginBottom: 10,
    },
    // container: {
    //   backgroundColor: themeColors.basic.WHITE,
    //   padding: 45,
    //   paddingTop: 105,
    //   height: "100%",
    // },
    label: {
      fontSize: 16,
      marginBottom: 5,
      marginTop: 10,
    },
    selectorButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    selectorText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
    },
  });
