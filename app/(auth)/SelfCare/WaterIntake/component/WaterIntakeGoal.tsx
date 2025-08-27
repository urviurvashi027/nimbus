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
import { themeColors } from "@/constant/theme/Colors";
// import styling from "@/components/createHabit/style/HabitDateModalStyle";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import GenderModal from "./GenderModal";
import WeightInputModal from "./WeightInputModal";
import ActivityModal from "./ActivityModal";
import WeatherModal from "./WeatherModal";

interface WaterIntakeProps {
  visible: boolean;
  onSaveData: (data: any) => void;
  onClose: () => void;
}

const WaterIntakeGoalModal: React.FC<WaterIntakeProps> = ({
  visible,
  onClose,
  onSaveData,
}) => {
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weight, setWeight] = useState();
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [selectedWeather, setSelectedWeather] = useState("");

  const [unit, setUnit] = useState("Kg");

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  const handlePanelClick = (item: any) => {
    if (item == "Gender") {
      setGenderModalVisible(true);
    }
    if (item == "Weight") {
      setWeightModalVisible(true);
    }
    if (item == "Activity") {
      setActivityModalVisible(true);
    }
    if (item == "Weather") {
      setWeatherModalVisible(true);
    }
  };

  const onSaveClick = () => {
    const data = {
      gender: selectedGender,
      weight: `${weight}`,
      activity: selectedActivity,
      weather: selectedWeather,
    };
    onSaveData(data);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
    >
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
            {weight && (
              <Text style={styles.optionValue}>
                {weight}
                {unit}
              </Text>
            )}
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
            <Text style={styles.optionValue}>{selectedWeather}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={onSaveClick}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ActivityModal
        visible={activityModalVisible}
        onClose={() => setActivityModalVisible(false)}
        selectedGender={selectedActivity}
        onSelect={(val: any) => {
          setSelectedActivity(val);
          setActivityModalVisible(false);
        }}
      />

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
        initialValue={weight}
        initialUnit={unit}
        onClose={() => setWeightModalVisible(false)}
        onSelect={(value: any, selectedUnit: any) => {
          setWeight(value);
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
      // zIndex: 10, // make sure it’s above
      // zIndex: 9999,
      backgroundColor: themeColors.basic.commonWhite,
      //   justifyContent: "center",
      //   alignItems: "center",
    },
    modalContainer: {
      padding: 20,
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 80,
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
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      // width: "40%",
      backgroundColor: themeColors.basic.secondaryColor,
    },
    saveText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "black",
    },
    optionRow: {
      flexDirection: "row",
      backgroundColor: "#f8f8f3",
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
      fontWeight: "bold",
    },
    optionValue: {
      fontSize: 16,
      marginRight: 10,
      color: "#555",
    },
  });

export default WaterIntakeGoalModal;
