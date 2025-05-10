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
import { ThemeKey } from "../Themed";
import { themeColors } from "@/constant/Colors";

const PrivacyPolicyModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last updated: May 10, 2025</Text>

            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            <Text style={styles.text}>
              a. <Text style={styles.bold}>Personal Information</Text>: Name,
              email, phone number, and profile data like age or preferences.
            </Text>
            <Text style={styles.text}>
              b. <Text style={styles.bold}>Usage Data</Text>: Tracked habits,
              reminders, and audio content usage.
            </Text>
            <Text style={styles.text}>
              c. <Text style={styles.bold}>Device Info</Text>: Device ID, OS
              version, IP address.
            </Text>

            <Text style={styles.sectionTitle}>
              2. How We Use Your Information
            </Text>
            <Text style={styles.text}>
              We use your data to enable features, send reminders, personalize
              your experience, improve services, and ensure security.
            </Text>

            <Text style={styles.sectionTitle}>3. Data Sharing</Text>
            <Text style={styles.text}>
              We do not sell your data. We may share limited info with service
              providers (e.g., WhatsApp API) or law enforcement if required.
            </Text>

            <Text style={styles.sectionTitle}>4. Data Storage & Security</Text>
            <Text style={styles.text}>
              Your data is encrypted and stored securely. You can request
              account deletion anytime.
            </Text>

            <Text style={styles.sectionTitle}>5. User Control</Text>
            <Text style={styles.text}>
              Update your profile, manage notifications, or request data
              deletion within the app.
            </Text>

            <Text style={styles.sectionTitle}>6. Children’s Privacy</Text>
            <Text style={styles.text}>
              This app is not for children under 13. We do not knowingly collect
              data from minors.
            </Text>

            <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
            <Text style={styles.text}>
              We may update this policy as features evolve. You'll be notified
              of major changes in the app.
            </Text>

            <Text style={styles.sectionTitle}>8. Contact Us</Text>
            <Text style={styles.text}>
              Email: support@yourdomain.com {"\n"}Phone: (if applicable) {"\n"}
              Settings → Support → Contact Us
            </Text>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PrivacyPolicyModal;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: themeColors.basic.commonWhite,
      borderRadius: 12,
      maxHeight: "80%",
      padding: 20,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 6,
    },
    lastUpdated: {
      fontSize: 12,
      color: themeColors.basic.darkGrey,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 12,
      marginBottom: 4,
    },
    text: {
      fontSize: 14,
      color: themeColors.basic.mediumGrey,
      marginBottom: 8,
    },
    bold: {
      fontWeight: "bold",
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: themeColors.basic.tertiaryColor,
      paddingVertical: 12,
      borderRadius: 6,
    },
    closeButtonText: {
      textAlign: "center",
      color: themeColors.basic.commonWhite,
      fontWeight: "bold",
      fontSize: 16,
    },
  });
