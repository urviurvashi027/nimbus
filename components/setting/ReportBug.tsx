import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { useNavigation } from "expo-router";
import { StyledButton } from "../common/ThemedComponent/StyledButton";
import InputField from "../common/ThemedComponent/StyledInput";

export default function ReportBugModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [bug, setBug] = useState<string>("");

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const navigation = useNavigation();

  const submitBug = () => {
    console.log("BUG:::", bug);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color={newTheme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.container}>
          <View
            style={{
              marginTop: 30,
            }}
          >
            <InputField
              label="Bug Details"
              value={bug}
              onChangeText={setBug}
              placeholder="Enter Your Bug Details"
            />

            <View style={{ height: 20 }} />

            <StyledButton label="Report" onPress={submitBug} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styling = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      backgroundColor: theme.surface,
      flex: 1,
    },
    overlay: {
      flex: 1,
      backgroundColor: theme.surface,
    },
    backButton: {
      marginTop: 80,
      marginLeft: 20,
      backgroundColor: theme.surface,
      marginBottom: 10,
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
    },
  });
