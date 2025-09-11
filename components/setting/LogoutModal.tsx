import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StyledButton } from "../common/ThemedComponent/StyledButton";
import { Ionicons } from "@expo/vector-icons";

const LogoutModal = ({
  visible,
  onLogout,
  onClose,
}: {
  visible: boolean;
  onLogout: () => void;
  onClose: () => void;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={newTheme.textPrimary}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionTitle}>Logout</Text>
          <Text style={styles.text}>Are you sure you want to logout?</Text>

          <View style={{ height: 20 }} />

          <StyledButton label="Logout" onPress={onClose} />
          {/* </ScrollView> */}
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
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      maxHeight: "80%",
      padding: 20,
    },
    // scrollContent: {
    //   paddingBottom: 20,
    // },
    // title: {
    //   fontSize: 20,
    //   color: theme.textPrimary,
    //   fontWeight: "bold",
    //   marginBottom: 6,
    // },
    // lastUpdated: {
    //   fontSize: 12,
    //   color: theme.textSecondary,
    //   marginBottom: 16,
    // },
    sectionTitle: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: "600",
      textAlign: "center",
      marginTop: 10,
      marginBottom: 20,
    },
    backButton: {
      //   marginTop: 20,
      marginLeft: 10,
      backgroundColor: theme.surface,
      marginBottom: 10,
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
