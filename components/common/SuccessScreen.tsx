import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "../Themed";
import { Ionicons } from "@expo/vector-icons";

const SuccessModal = ({
  visible,
  onClose,
  isLoading,
}: {
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  console.log("mounted sucess", visible);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={themeColors[theme].text} />
          </TouchableOpacity>
          {/* Success GIF */}
          <Image
            source={require("../../assets/images/success.gif")} // Replace with your GIF file
            style={styles.gif}
          />

          {/* Loading */}
          {isLoading && (
            <>
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="blue" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            </>
          )}

          {/* Success Message */}
          {!isLoading && (
            <>
              <Text style={styles.successText}>
                Habit Created Successfully!
              </Text>

              {/* Continue Button */}
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    loaderContainer: {
      backgroundColor: "white",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    gif: {
      width: 150,
      height: 150,
      resizeMode: "contain",
    },
    successText: {
      fontSize: 18,
      fontWeight: "bold",
      color: themeColors.basic.success,
      marginTop: 10,
      textAlign: "center",
    },
    button: {
      marginTop: 20,
      backgroundColor: themeColors.basic.success,
      // color: themeColors.basic.success,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
    },
    buttonText: {
      color: themeColors.basic.primaryColor,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

export default SuccessModal;
