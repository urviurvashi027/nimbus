import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import EmojiPicker, { type EmojiType } from "rn-emoji-keyboard";

import HabitContext from "@/context/HabitContext";
import { Button, FormInput, ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { Text } from "@/components/Themed";
import HabitTypeInput from "@/components/createHabit/HabitTypeInput";
import HabitTagsInput, {
  selectedTag,
} from "@/components/createHabit/HabitTagsInput";
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
import SuccessModal from "@/components/common/SuccessScreen";
import Toast from "react-native-toast-message";
import ActivityIndicatorModal from "@/components/common/ActivityIndicatorModal";
import EmojiInput from "@/components/createHabit/EmojiSelector";

export default function HabitBasic() {
  // form state
  const [colorSchema, setColorSchema] = useState<
    "#FFEDFA" | "#B4EBE6" | "#F8ED8C" | "#C1CFA1" | "#B7B1F2"
  >("#FFEDFA");
  const [name, setName] = useState("");
  const [habitTypeId, sethabitTypeId] = useState<number>(0);
  const [tags, setTags] = useState<selectedTag>({} as selectedTag);
  const [metric, setMetric] = useState<MetricFormat | {}>({});
  const [frequency, setFrequency] = useState<FrequencyObj | null>(null);
  const [duration, setDuration] = useState<Duration>({ all_day: undefined });
  const [date, setDate] = useState<HabitDateType>();
  const [reminderAt, setReminderAt] = useState<ReminderAt>({});
  // api state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // context
  const { habitData, setHabitData } = useContext(HabitContext);
  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  // navigation setting
  const navigation = useNavigation();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Habit Basic Details",
      headerBackButtonDisplayMode: "minimal",
      headerTitleAlign: "center",
      // headerTintColor: styles.header.color,
      headerTitleStyle: {
        fontSize: 18,
        color: styles.header.color,
        paddingTop: 5,
        height: 40,
      },
    });
  }, [navigation]);

  // function to handle color selection
  const handleColorSelect = (
    color: "#FFEDFA" | "#B4EBE6" | "#F8ED8C" | "#C1CFA1" | "#B7B1F2"
  ) => {
    setColorSchema(color);
  };

  // function to hanlde color selection
  const handleHabitTypeSelect = (habitTypeId: number) => {
    sethabitTypeId(habitTypeId);
  };

  // function to handle habit tags selection
  const handleHabitTagSelection = (selectedTags: selectedTag) => {
    setTags(selectedTags);
  };

  // function to handle metric selection
  const handleMetricSelect = (value: any) => {
    setMetric(value);
  };

  // function to handle frequency selection
  const handleFrequencySelect = (value: any) => {
    setFrequency(value);
  };

  // function to hanlde duration selection
  const handleDurationSelect = (value: any) => {
    setDuration(value);
  };

  // function to hanlde date selection
  const handleHabitStartDate = (value: any) => {
    setDate(value);
  };

  // function to handle reminder selection
  const handleReminderSelect = (value: any) => {
    setReminderAt(value);
  };

  const isAllDayEnabled = () => {
    return duration.all_day ? true : false;
  };

  const getFrequencyDetail = () => {
    if (frequency?.frequency_type || date?.start_date)
      return { ...frequency, ...date };
  };

  const getFormattedTag = () => {
    let value;
    if (tags) {
      let tagList = tags?.old?.map((item, index) => item.id);
      if (tags.new) {
        value = { old: tagList, new: [tags.new] };
      } else {
        value = { old: tagList };
      }
    } else {
      value = {};
    }

    return value;
  };

  const createHabitData = async () => {
    if (name && Object.keys(metric).length > 0) {
      const freq = getFrequencyDetail();

      let result = {
        name: name,
        habit_type_id: habitTypeId,
        color: colorSchema,
        habit_metric: metric,
        habit_duration: duration,
        habit_frequency: freq,
        // remind_at: reminderAt,
        tags: getFormattedTag(),
        ...(reminderAt?.time || reminderAt?.ten_min_before
          ? { remind_at: reminderAt }
          : {}),
      };

      // if (reminderAt.time || reminderAt.ten_min_before) {
      //   result = { ...result, remind_at: reminderAt };
      //   //  result.remind_at = reminderAt;
      // }

      // const res = tags.old?.length ? { ...result, tag: tags } : result;

      creatHabitApi(result);
    } else {
      const errorMessage = name ? "Please enter metric" : "Please enter name";
      // Show error toast
      Toast.show({
        type: "error",
        text1: "Required Field Empty",
        text2: errorMessage,
        position: "bottom",
      });
    }
  };

  const creatHabitApi = async (data: any) => {
    setShowResponseModal(true);
    setIsLoading(true);

    try {
      const result = await createHabit(data);

      if (result?.success) {
        setIsSuccess(true);
        setIsLoading(false);

        resetData();
        // router.replace("/(auth)/(tabs)"); // Navigate on success
      }
    } catch (error: any) {
      setIsLoading(false);
    }
  };

  const resetData = () => {
    setName("");
    sethabitTypeId(0);
    setTags({});
    setMetric({});
    setFrequency(null);
    setDuration({ all_day: undefined });
    setReminderAt({});
  };

  // function to handle continue click
  const onSubmitClick = () => {
    createHabitData();
  };

  return (
    <>
      <GestureHandlerRootView
        style={[
          styles.gestureContainer,
          { backgroundColor: colorSchema || themeColors[theme].background },
        ]}
      >
        <SafeAreaView style={styles.gestureContainer}>
          <ScrollView>
            <ScreenView
              bgColor={colorSchema}
              style={{
                paddingTop: Platform.OS === "ios" ? 20 : 10,
              }}
            >
              <EmojiInput />
              <View>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={themeColors.basic.mediumGrey}
                  placeholder="Enter Habitt name"
                  value={name}
                  onChangeText={setName}
                />

                {/* Task Name */}
                <View style={styles.colorOptionsContainer}>
                  {["#FFEDFA", "#B4EBE6", "#F8ED8C", "#C1CFA1", "#B7B1F2"].map(
                    (color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorCircle,
                          { backgroundColor: color },
                          colorSchema === color && {
                            borderColor: themeColors.basic.mediumGrey,
                          },
                        ]}
                        onPress={() =>
                          handleColorSelect(
                            color as
                              | "#FFEDFA"
                              | "#B4EBE6"
                              | "#F8ED8C"
                              | "#C1CFA1"
                              | "#B7B1F2"
                          )
                        }
                      />
                    )
                  )}
                </View>

                <HabitTypeInput onSelect={handleHabitTypeSelect} />

                <HabitMetricInput onSelect={handleMetricSelect} />
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

      <SuccessModal
        visible={showResponseModal}
        isLoading={isLoading}
        isSuccess={isSuccess}
        onClose={() => {
          setShowResponseModal(false);
          router.replace("/(auth)/(tabs)");
        }}
      />
      {/* <ActivityIndicatorModal visible={isLoading} /> */}
    </>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    gestureContainer: {
      flex: 1,
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
      textAlign: "center",
      width: "80%",
      alignSelf: "center",
      // borderWidth: 1,
      borderBottomColor: themeColors[theme].inpurBorderColor,
      borderBottomWidth: 1,
      // borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      // color: "#333",
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
      borderWidth: 1,
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
    customContainer: {
      width: "80%", // Adjust as needed
      alignSelf: "center",
      marginVertical: 10,
    },
    customLabel: {
      textAlign: "center", // Center the label
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5, // Space between label and input
    },
    customInput: {
      borderBottomWidth: 1, // Only bottom border
      borderBottomColor: "#555", // Border color
      fontSize: 16,
      textAlign: "center", // Center the input text
      paddingVertical: 5, // Adjust vertical spacing
    },
    loaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.2)", // Semi-transparent background
    },
  });
