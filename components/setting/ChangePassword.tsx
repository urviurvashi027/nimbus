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
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { TextInput, ThemeKey } from "../Themed";
import { useNavigation } from "expo-router";
import InputField from "../common/ThemedComponent/StyledInput";
import { StyledButton } from "../common/ThemedComponent/StyledButton";
import { changePassword } from "@/services/settingService";

export default function ChangePasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState("");

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const submitPassword = async () => {
    console.log(oldPassword, newPassword, "yayyy");
    try {
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
      };
      const r = await changePassword(payload);
      if (r && r.success) {
        console.log("Password Change");
      }
    } catch {
    } finally {
    }
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
              label="Old Password"
              preset="password"
              enablePasswordToggle
              value={oldPassword}
              onChangeText={setOldPassword}
              placeholder="••••••••"
            />
            <View style={{ height: 20 }} />

            <InputField
              label="New Password"
              preset="password"
              enablePasswordToggle
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
            />
          </View>

          <View style={{ height: 20 }} />

          <StyledButton label="Save New Password" onPress={submitPassword} />
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
      marginBottom: 10,
      backgroundColor: theme.surface,
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
    },
    button: {
      padding: 15,
      borderRadius: 15,
      marginTop: 20,
      borderWidth: 1,
    },
    btnText: {
      textAlign: "center",
      fontSize: 17,
    },
  });
