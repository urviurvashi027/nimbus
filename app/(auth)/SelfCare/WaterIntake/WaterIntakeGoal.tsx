import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/Colors";
// import styling from "@/components/createHabit/style/HabitDateModalStyle";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import GenderModal from "./component/GenderModal";
import WeightInputModal from "./component/WeightInputModal";
import ActivityModal from "./component/ActivityModal";
import WeatherModal from "./component/WeatherModal";

interface WaterIntakeProps {
  visible: boolean;
  onClose: () => void;
}

const WaterIntakeGoalModal: React.FC<WaterIntakeProps> = ({
  visible,
  onClose,
}) => {
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weight, setWeight] = useState(73.9);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState("");

  const [unit, setUnit] = useState("Kg");

  const settingsOptions = [
    {
      id: "1",
      icon: "notifications",
      title: "Gender",
      value: "Off",
    },
    {
      id: "2",
      icon: "water",
      title: "Weight",
      value: "73oz",
    },
    { id: "3", icon: "scale", title: "Activity", value: "Lbs, oz" },
    { id: "4", icon: "scale", title: "Weather", value: "Lbs, oz" },
  ];

  console.log("I am loading water intake modal");

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const handlePanelClick = (item: any) => {
    console.log("Panel clicekced", item);
    if (item == "Gender") {
      console.log("coming here");
      setGenderModalVisible(true);
    }
    if (item == "Weight") {
      console.log("coming here");
      setWeightModalVisible(true);
    }
    if (item == "Activity") {
      console.log("coming here");
      setActivityModalVisible(true);
    }
    if (item == "Weather") {
      console.log("coming here");
      setWeatherModalVisible(true);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Water intake Goal</Text>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>

          {/* Gender Input */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handlePanelClick("Gender")}
          >
            <Ionicons
              name="male-female"
              size={20}
              color="black"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Gender</Text>
            <Text style={styles.optionValue}>{selectedGender}</Text>
            {/* <Ionicons name="calendar-outline" size={20} color="black" /> */}
          </TouchableOpacity>

          {/* Weight Input */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handlePanelClick("Weight")}
          >
            <Ionicons
              name="scale-outline"
              size={20}
              color="black"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Weight</Text>
            <Text style={styles.optionValue}>{weight}</Text>
          </TouchableOpacity>

          {/* Activity Input */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handlePanelClick("Activity")}
          >
            <Ionicons
              name="fitness-outline"
              size={20}
              color="black"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Activity</Text>
            <Text style={styles.optionValue}>{selectedActivity}</Text>
          </TouchableOpacity>

          {/* Weather Input */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handlePanelClick("Weather")}
          >
            <Ionicons
              name="cloudy-night-outline"
              size={20}
              color="black"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Weather</Text>
            <Text style={styles.optionValue}>{selectedActivity}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ActivityModal
        visible={activityModalVisible}
        onClose={() => setActivityModalVisible(false)}
        selectedGender={selectedActivity}
        onSelect={(val: any) => {
          console.log(val, "activity");
          setSelectedActivity(val);
          setActivityModalVisible(false);
        }}
      />

      <GenderModal
        visible={genderModalVisible}
        onClose={() => setGenderModalVisible(false)}
        selectedGender={selectedGender}
        onSelect={(val: any) => {
          console.log(val, "GenderSeelection");
          setSelectedGender(val);
          setGenderModalVisible(false);
        }}
      />

      <WeightInputModal
        visible={weightModalVisible}
        initialValue={weight.toString()}
        initialUnit={unit}
        onClose={() => setWeightModalVisible(false)}
        onSelect={(value: any, selectedUnit: any) => {
          setWeight(value);
          setUnit(selectedUnit);
        }}
      />

      {/* <WeightInputModal
        visible={weightModalVisible}
        initialValue={weight.toString()}
        initialUnit={unit}
        onClose={() => setWeightModalVisible(false)}
        onSelect={(value: any, selectedUnit: any) => {
          setWeight(value);
          setUnit(selectedUnit);
        }}
      /> */}

      <WeatherModal
        visible={weatherModalVisible}
        initialValue={selectedWeather.toString()}
        initialUnit={unit}
        onClose={() => setWeatherModalVisible(false)}
        onSelect={(value: any, selectedUnit: any) => {
          setSelectedWeather(value);
          setUnit(selectedUnit);
        }}
      />
    </Modal>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      // zIndex: 9999,
      backgroundColor: "rgba(0,0,0,0.5)",
      //   justifyContent: "center",
      //   alignItems: "center",
    },
    modalContainer: {
      //   width: "90%",
      //   backgroundColor: themeColors[theme].background,
      //   borderRadius: 10,
      //   padding: 20,
      //   maxHeight: "90%",

      flex: 1,
      //   backgroundColor: "red",
      paddingHorizontal: 20,
      paddingTop: 80,
      //   maxHeight: "90%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    backButton: {
      padding: 10,
    },
    headerText: {
      fontSize: 22,
      fontWeight: "bold",
    },
    saveButton: {
      padding: 10,
    },
    saveText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
    },
    optionRow: {
      flexDirection: "row",
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      marginBottom: 10,
      alignItems: "center",
      justifyContent: "space-between",
    },
    optionIcon: {
      marginRight: 10,
    },
    optionText: {
      flex: 1,
      fontSize: 16,
      // marginRight: 10,
      fontWeight: "bold",
    },
    optionValue: {
      fontSize: 16,
      marginRight: 10,
      color: "#555",
    },
  });

export default WaterIntakeGoalModal;
