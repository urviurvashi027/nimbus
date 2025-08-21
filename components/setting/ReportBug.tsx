import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import SetReminderModal from "./SetReminderModal";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { TextInput, ThemeKey } from "../Themed";
import { useNavigation } from "expo-router";

export default function ReportBugModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [bug, setBug] = useState<string>("");

  const { theme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  const submitBug = () => {
    console.log("BUG:::", bug);
  };

  return (
    <Modal visible={visible} animationType="slide">
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Ionicons name="arrow-back" size={24} color={themeColors[theme].text} />
      </TouchableOpacity>

      <View style={styles.container}>
        <View
          style={{
            marginTop: 30,
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Bug Details"
            placeholderTextColor="gray"
            onChangeText={(value) => setBug(value)}
          ></TextInput>
        </View>
        <TouchableOpacity style={styles.button} onPress={submitBug}>
          <Text style={styles.btnText}>Report</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      // paddingTop: 60,
      paddingHorizontal: 20,
      backgroundColor: themeColors.basic.primaryColor,
      flex: 1,
    },
    backButton: {
      marginTop: 80,
      marginLeft: 20,
      marginBottom: 10,
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
    },
    button: {
      padding: 15,
      borderRadius: 15,
      backgroundColor: themeColors[theme].backgroundColor,
      borderColor: themeColors[theme].primaryColor,
      marginTop: 20,
      borderWidth: 1,
    },
    btnText: {
      color: themeColors[theme].primaryColor,
      textAlign: "center",
      fontSize: 17,
    },
  });
