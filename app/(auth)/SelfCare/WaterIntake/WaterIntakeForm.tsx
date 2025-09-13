import React, { useContext, useEffect, useState } from "react";
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
import WaterIntakeGoalModal from "./component/WaterIntakeGoal";
import HabitReminderInput from "@/components/createHabit/HabitReminderInput";
// import HabitReminderModal, {
//   ReminderAt,
// } from "@/components/createHabit/Modal/HabitReminderModal";
import WeatherModal from "./component/WeatherModal";
import UnitInputModal from "./component/LiquidUnit";

interface WaterIntakeProps {
  visible: boolean;
  onClose: () => void;
}

interface UnitType {
  weight?: string;
  liquid?: string;
}

const SettingsModal: React.FC<WaterIntakeProps> = ({ visible, onClose }) => {
  const [userInfo, setUserInfo] = useState({
    gender: "",
    weight: "",
    activity: "",
    weather: "",
  });
  const [showWaterIntakeGoalModal, setWaterIntakeGoalModal] = useState(false);
  const [isAddRoutineEnable, setAddRouitneEnable] = useState(false);

  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>();

  // const [reminderAt, setReminderAt] = useState<ReminderAt>({});
  const [showReminderModal, setShowRemindersModal] = useState(false);

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  const handleOnSaveWaterIntakeSetting = (data: any) => {
    setUserInfo(data);
    setWaterIntakeGoalModal(false);
  };

  const handlePanelClick = (item: any) => {
    if (item == "water") {
      setWaterIntakeGoalModal(true);
    }
    if (item == "reminders") {
      setShowRemindersModal(true);
    }
    if (item == "units") {
      setUnitModalVisible(true);
    }
  };

  const isAllDayEnabled = () => {
    return true;
  };

  // function to handle reminder selection
  // const handleReminderSelect = (value: any) => {
  //   setReminderAt(value);
  // };

  const onSaveClick = () => {
    onClose();
  };

  const handleHabitReminder = (reminderAt: any) => {
    console.log(reminderAt, "--------- reminerAt --------");
    // setReminderAt({ time: reminderAt });
  };

  // useEffect(() => {
  //   console.log("from usefeefect", selectedUnit);
  // }, [selectedUnit]);

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
            <Text style={styles.optionValue}>kk</Text>
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
            <Text style={styles.optionValue}>{userInfo?.gender}</Text>
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
            {(selectedUnit?.liquid || selectedUnit?.weight) && (
              <Text style={styles.optionValue}>
                {selectedUnit?.liquid},{selectedUnit?.weight}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={onSaveClick}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Habit reminder modal */}
        {/* <HabitReminderModal
          visible={showReminderModal}
          onClose={() => setShowRemindersModal(false)}
          isAllDayEnabled={isAllDayEnabled()}
          onSave={handleHabitReminder}
          // isEditMode={isEditMode}
        /> */}

        {/* water intake setting modal */}
        <WaterIntakeGoalModal
          visible={showWaterIntakeGoalModal}
          onClose={() => setWaterIntakeGoalModal(false)}
          onSaveData={handleOnSaveWaterIntakeSetting}
        />

        {/* unit modal */}
        <UnitInputModal
          visible={unitModalVisible}
          selectedWeight={selectedUnit?.weight}
          selectedLiquid={selectedUnit?.liquid}
          onClose={() => setUnitModalVisible(false)}
          onSelect={(unitType: string, unitValue: string) => {
            console.log("unit selction done", selectedUnit);
            if (unitType && unitValue) {
              setSelectedUnit({ ...selectedUnit, [unitType]: unitValue });
            }
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
