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
import WaterIntakeGoalModal from "./WaterIntakeGoal";
import HabitReminderInput from "@/components/createHabit/HabitReminderInput";
import { ReminderAt } from "@/components/createHabit/Modal/HabitReminderModal";
import WeatherModal from "./component/WeatherModal";
import UnitInputModal from "./component/LiquidUnit";

interface WaterIntakeProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<WaterIntakeProps> = ({ visible, onClose }) => {
  const [showReminderModal, setShowRemindersModal] = useState(false);
  const [showWaterIntakeGoalModal, setWaterIntakeGoalModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [isAddRoutineEnable, setAddRouitneEnable] = useState(false);

  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [selectedWeightUnit, setSelectedWeightUnit] = useState("");
  const [selectedLiquidUnit, setSelectedLiquidUnit] = useState("");

  const [reminderAt, setReminderAt] = useState<ReminderAt>({});
  const settingsOptions = [
    {
      id: "1",
      icon: "notifications",
      title: "Reminders",
      value: "Off",
    },
    {
      id: "2",
      icon: "water",
      title: "Water intake goal",
      value: "73oz",
    },
    { id: "3", icon: "scale", title: "Units", value: "Lbs, oz" },
  ];

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const handleOnCloseWaterIntakeSetting = () => {
    setWaterIntakeGoalModal(false);
  };

  const handlePanelClick = (item: any) => {
    console.log("Panel clicekced", item);
    if (item == "water") {
      console.log("coming here");
      setWaterIntakeGoalModal(true);
    }
    if (item == "reminders") {
      console.log("coming here");
      setWaterIntakeGoalModal(true);
    }
    if (item == "units") {
      console.log("coming here");
      setUnitModalVisible(true);
    }
  };

  const isAllDayEnabled = () => {
    return true;
  };

  // function to handle reminder selection
  const handleReminderSelect = (value: any) => {
    setReminderAt(value);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Setting</Text>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>

          {/* Reminders */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handlePanelClick("reminders")}
          >
            <Ionicons
              name="notifications-circle-outline"
              size={20}
              color="black"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Reminders</Text>
            <Text style={styles.optionValue}>item.value</Text>
          </TouchableOpacity>

          {/* Water Intake Goal */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handlePanelClick("water")}
          >
            <Ionicons
              name="water-outline"
              size={20}
              color="black"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Water</Text>
            <Text style={styles.optionValue}>item.value</Text>
          </TouchableOpacity>

          {/* Units */}
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => handlePanelClick("units")}
          >
            <Ionicons
              name="water-outline"
              size={20}
              color="black"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Unit</Text>
            <Text style={styles.optionValue}>item.value</Text>
            {/* <Ionicons name="calendar-outline" size={20} color="black" /> */}
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <WaterIntakeGoalModal
          visible={showWaterIntakeGoalModal}
          onClose={handleOnCloseWaterIntakeSetting}
        />

        <UnitInputModal
          visible={unitModalVisible}
          selectedWeight={selectedWeightUnit}
          selectedLiquid={selectedLiquidUnit}
          onClose={() => setUnitModalVisible(false)}
          onSelect={(value: any, selectedUnit: any) => {
            console.log("unit selction done", value);
            // setSelectedLiquidUnit(value);
            // setSelectedWeightUnit(value);
            // setUnit(selectedUnit);
          }}
        />
      </Modal>
    </>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: themeColors.basic.deactiveColor,
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

export default SettingsModal;
