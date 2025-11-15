// components/setting/LogoutModal.tsx
import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StyledButton from "@/components/common/themeComponents/StyledButton";

type Props = {
  visible: boolean;
  onLogout: () => void;
  onClose: () => void;
};

const LogoutModal = ({ visible, onLogout, onClose }: Props) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={newTheme.textPrimary}
              />
            </TouchableOpacity>

            <Text style={styles.title}>Logout</Text>
            {/* spacer to center title visually */}
            <View style={{ width: 22 }} />
          </View>

          {/* Icon + text */}
          <View style={styles.body}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={newTheme.accent}
              />
            </View>

            <Text style={styles.heading}>Are you sure you want to logout?</Text>
            <Text style={styles.subText}>
              You’ll need to sign in again to access your routines and progress.
            </Text>
          </View>

          {/* CTA buttons */}
          <View style={styles.footer}>
            <StyledButton
              label="Cancel"
              variant="secondary"
              fullWidth
              onPress={onClose}
              style={styles.footerButton}
            />

            <StyledButton
              label="Logout"
              variant="destructive"
              fullWidth
              onPress={onLogout}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;

const styling = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    modalContent: {
      width: "100%",
      borderRadius: 24,
      backgroundColor: theme.surface,
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 18,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    backButton: {
      padding: 4,
      marginRight: 8,
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "700",
      color: theme.textPrimary,
    },
    body: {
      alignItems: "center",
      paddingHorizontal: 8,
      marginTop: 4,
      marginBottom: 16,
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: 999,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },
    heading: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.textPrimary,
      textAlign: "center",
      marginBottom: 6,
    },
    subText: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
    footer: {
      marginTop: 4,
      gap: 10,
    },
    footerButton: {
      marginBottom: 4,
    },
    text: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      marginBottom: 8,
    },
    bold: {
      fontWeight: "bold",
    },
  });
