import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";

import InputField from "@/components/common/ThemedComponent/StyledInput";

import StyledButton from "../../common/themeComponents/StyledButton";
// import { StyledButton } from "../common/ThemedComponent/StyledButton";

import { changePassword } from "@/services/settingService";
import ErrorBanner from "../../common/themeComponents/ErrorBanner";

export default function ChangePasswordModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const validate = (): boolean => {
    // clear any previous error
    setErrorMsg(null);

    if (oldPassword.trim() === "" || newPassword.trim() === "") {
      setErrorMsg("Both old and new password are required.");
      return false;
    }

    if (oldPassword.trim() === newPassword.trim()) {
      setErrorMsg("New password cannot be the same as the old password.");
      return false;
    }

    if (newPassword.trim().length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const submitPassword = async () => {
    if (!validate()) return;
    // validation
    console.log("Submitting password change", oldPassword, newPassword);

    try {
      setLoading(true);

      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
      };
      console.log("Payload for password change:", payload);
      const r = await changePassword(payload);

      if (r?.success) {
        // optional: clear form
        setOldPassword("");
        setNewPassword("");
        setErrorMsg(null);
        onClose();
      } else {
        setErrorMsg(r?.message || "Incorrect old password. Please try again.");
      }
    } catch (e) {
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
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

  const canSubmit = !!oldPassword && !!newPassword && !loading;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color={newTheme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.container}>
          <ErrorBanner
            message={errorMsg}
            visible={!!errorMsg}
            onDismiss={() => setErrorMsg(null)}
            style={{ marginTop: 4 }}
          />
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

          {/* <StyledButton label="Save New Password" onPress={submitPassword} /> */}

          <View style={styles.footer}>
            <StyledButton
              label={loading ? "Saving..." : "Save New Password"}
              variant="primary"
              fullWidth
              onPress={submitPassword}
              // loading={loading}
              disabled={!canSubmit}
            />
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
    },
    footer: {
      paddingHorizontal: 0,
      paddingBottom: Platform.OS === "ios" ? 26 : 16,
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
