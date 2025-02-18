import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "../Themed";

const SuccessModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Success GIF */}
          <Image
            source={require("../../assets/images/success.gif")} // Replace with your GIF file
            style={styles.gif}
          />

          {/* Success Message */}
          <Text style={styles.successText}>Habit Created Successfully!</Text>

          {/* Continue Button */}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
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
