import { themeColors } from "@/constant/theme/Colors";
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

const TermsModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Terms & Conditions</Text>
            <Text style={styles.lastUpdated}>Last updated: May 10, 2025</Text>

            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.text}>
              By using our application, you agree to be bound by these Terms. If
              you do not accept them, please do not use the app.
            </Text>

            <Text style={styles.sectionTitle}>2. Use of the App</Text>
            <Text style={styles.text}>
              This app is intended for personal wellness use only. You may not
              use it for unlawful or commercial purposes without permission.
            </Text>

            <Text style={styles.sectionTitle}>3. User Accounts</Text>
            <Text style={styles.text}>
              You are responsible for maintaining the confidentiality of your
              account and information. You agree to provide accurate and current
              data.
            </Text>

            <Text style={styles.sectionTitle}>4. Subscription & Payments</Text>
            <Text style={styles.text}>
              Some features may require a subscription. Fees are non-refundable
              except as required by law or stated in our refund policy.
            </Text>

            <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
            <Text style={styles.text}>
              All app content including text, audio, and visuals is our
              property. You may not copy or redistribute any part without
              written consent.
            </Text>

            <Text style={styles.sectionTitle}>6. Termination</Text>
            <Text style={styles.text}>
              We may suspend or terminate your access if you violate these
              terms. You may delete your account anytime through the app.
            </Text>

            <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
            <Text style={styles.text}>
              We are not liable for any indirect or consequential damages from
              using this app. Use it at your own discretion.
            </Text>

            <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
            <Text style={styles.text}>
              We may update these terms from time to time. Continued use of the
              app means you accept the updated terms.
            </Text>

            <Text style={styles.sectionTitle}>9. Contact</Text>
            <Text style={styles.text}>
              For any questions about these terms, please contact us at:
              silentbonus@ygmail.com
            </Text>

            <View style={{ height: 20 }} />

            <StyledButton label="Close" onPress={onClose} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;

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
    scrollContent: {
      paddingBottom: 20,
    },
    title: {
      fontSize: 20,
      color: theme.textPrimary,
      fontWeight: "bold",
      marginBottom: 6,
    },
    lastUpdated: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      color: theme.textPrimary,
      fontWeight: "600",
      marginTop: 12,
      marginBottom: 4,
    },
    text: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
  });
