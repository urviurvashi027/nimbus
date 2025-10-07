import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
// import SetReminderModal from "./SetReminderModal";
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

  const isDirty = () => {
    // if (!password && ) return false;
    return !newPassword && !oldPassword;
  };

  const handleCancel = () => {
    if (isDirty()) {
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Discard them?",
        [
          { text: "Keep editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              onClose();
            },
          },
        ]
      );
    } else {
      onClose();
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
      // paddingTop: 90,
      paddingHorizontal: 20,
      backgroundColor: theme.background,
      flex: 1,
    },
    header: {
      paddingTop: 50,
      height: 72,
      paddingHorizontal: 16,
      alignItems: "center",
      flexDirection: "row",
    },
    overlay: {
      flex: 1,
      backgroundColor: theme.background,
    },
    backButton: {
      marginTop: 80,
      marginLeft: 20,
      marginBottom: 10,
      // backgroundColor: theme.surface,
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
    backBtn: { padding: 6, marginRight: 8 },
    title: { fontSize: 20, fontWeight: "700", color: theme.textPrimary },
    unsaved: {
      marginTop: 4,
      color: theme.background,
      backgroundColor: theme.warning || "#EBCB8B",
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      fontWeight: "700",
      marginLeft: 0,
    },
  });
