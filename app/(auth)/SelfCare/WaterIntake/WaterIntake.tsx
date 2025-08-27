import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/theme/Colors";
import LottieView from "lottie-react-native"; // For animated background GIF
import SettingsModal from "./WaterIntakeForm";
import AddWaterModal from "./AddWaterModal";
import HistoryModal from "./WaterIntakeHistory";
import { ScreenView } from "@/components/Themed";

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
  const goal = 3000;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    console.log(waterIntake, "waterIntakeUseEffect");
  }, [waterIntake]);

  return (
    <ScreenView
      style={{
        paddingHorizontal: 0,
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      <View style={styles.container}>
        {/* Background Animation */}
        <Image
          source={require("../../../../assets/images/wa.gif")} // Replace with your GIF file
          style={styles.backgroundAnimation}
        />
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={themeColors[theme].text}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.headerText}>Stay Hydrated !!!</Text>

          {/* Water Intake Display */}
          <Text style={styles.waterText}>
            {waterIntake} / {goal}ml
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
      </View>
      {/* Settings Modal */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => {
          setSettingsVisible(false);
        }}
      />

      {/* Add Water Modal */}
      <AddWaterModal
        visible={addWaterVisible}
        onClose={() => {
          console.log("on close clicked");
          setAddWaterVisible(false);
        }}
        onAddWater={(amount: any) => {
          console.log(amount, "amount from the modal above");
          if (waterIntake + amount > goal) {
            alert(
              `"Limit Reached"
                You can’t add ${amount}ml. It exceeds the daily goal of ${goal}ml.`
            );
            return;
          }
          setWaterIntake((prev) => prev + amount);
          // setWaterIntake((prev) => Math.min(prev + amount, goal));
        }}
      />

      {/* History Modal */}
      <HistoryModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
      />
    </ScreenView>
  );
};

export default WaterIntakeModal;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundAnimation: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    content: {
      padding: 30,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    backButton: {
      position: "absolute",
      top: 30,
      left: 30,
      marginTop: 50,
      marginBottom: 10,
    },
    header: {
      marginTop: 50,
      fontSize: 26,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    headerText: {
      marginTop: 50,
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
      color: themeColors[theme].text,
    },
    buttonContainer: {
      flexDirection: "row",
      position: "absolute",
      bottom: 30,
      alignItems: "center",
    },
    iconButton: {
      backgroundColor: themeColors.basic.commonWhite,
      padding: 15,
      borderRadius: 30,
      marginHorizontal: 15,
      elevation: 5,
    },
    addButton: {
      backgroundColor: themeColors.basic.commonBlack,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
      elevation: 5,
    },
    addButtonText: {
      color: themeColors.basic.commonWhite,
      fontSize: 18,
      fontWeight: "bold",
    },
  });
