import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import LottieView from "lottie-react-native"; // For animated background GIF
import SettingsModal from "./WaterIntakeForm";
import AddWaterModal from "./AddWaterModal";
import HistoryModal from "./WaterIntakeHistory";

type ThemeKey = "basic" | "light" | "dark";

interface WaterIntakeProps {
  visible: boolean;
  onClose: () => void;
}

const WaterIntakeModal: React.FC<WaterIntakeProps> = ({ visible, onClose }) => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [addWaterVisible, setAddWaterVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const goal = 73;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        {/* Background Animation */}
        <Image
          source={require("../../../../assets/images/water.gif")} // Replace with your GIF file
          style={styles.backgroundAnimation}
        />
        {/* <LottieView
          source={require("./assets/water-animation.json")} // Add your Lottie file in assets
          autoPlay
          loop
          style={styles.backgroundAnimation}
        /> */}

        {/* Close Button */}
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.headerText}>Stay Hydrated !!!</Text>

        {/* Water Intake Display */}
        <Text style={styles.waterText}>
          {waterIntake} / {goal}oz
        </Text>
        <Text style={styles.subText}>Water intake & your goal</Text>

        {/* Buttons Section */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="settings-outline"
              size={28}
              color="black"
              onPress={() => setSettingsVisible(true)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddWaterVisible(true)}
            // onPress={() => setWaterIntake((prev) => Math.min(prev + 8, goal))} // Adds 8oz per tap
          >
            <Text style={styles.addButtonText}>+ Add Water</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setHistoryVisible(true)}
          >
            <Ionicons name="calendar-outline" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => {
          console.log("water intake form close modal clicked");
          setSettingsVisible(false);
        }}
      />

      {/* Add Water Modal */}
      <AddWaterModal
        visible={addWaterVisible}
        onClose={() => setAddWaterVisible(false)}
        onAddWater={(amount: any) =>
          setWaterIntake((prev) => Math.min(prev + amount, goal))
        }
      />

      {/* History Modal */}
      <HistoryModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
      />
    </Modal>
  );
};

export default WaterIntakeModal;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: "#E3F2FD", // Light blue background
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    backgroundAnimation: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    closeButton: {
      position: "absolute",
      top: 40,
      left: 20,
      zIndex: 10,
    },
    headerText: {
      fontSize: 22,
      fontWeight: "bold",
      color: "black",
      marginBottom: 10,
    },
    waterText: {
      fontSize: 32,
      fontWeight: "bold",
      color: "black",
    },
    subText: {
      fontSize: 16,
      color: "#555",
    },
    buttonContainer: {
      flexDirection: "row",
      position: "absolute",
      bottom: 50,
      alignItems: "center",
    },
    iconButton: {
      backgroundColor: "white",
      padding: 15,
      borderRadius: 30,
      marginHorizontal: 15,
      elevation: 5,
    },
    addButton: {
      backgroundColor: "black",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
      elevation: 5,
    },
    addButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
  });
