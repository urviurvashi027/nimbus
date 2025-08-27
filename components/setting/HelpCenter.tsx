import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { ThemeKey } from "../Themed";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";

const faqs = [
  {
    question: "How do I create a new habit?",
    answer:
      "Go to the Habits tab and tap on 'Add Habit'. Set a name, frequency, and reminder time to start tracking.",
  },
  {
    question: "Can I set reminders for my habits?",
    answer:
      "Yes, when creating or editing a habit, you can enable reminders and choose a preferred time.",
  },
  {
    question: "How do I change the day my week starts?",
    answer:
      "You can change the start day of the week in the app's Settings under 'Week Start On'.",
  },
  {
    question: "Are my personal details secure?",
    answer:
      "Absolutely. Your data is encrypted and stored securely. We do not share or sell your personal information.",
  },
  {
    question: "Can I access the app offline?",
    answer:
      "Yes, basic features like habit tracking are available offline. However, sync and backup require internet.",
  },
];

const FAQModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const { theme } = useContext(ThemeContext);

  const styles = styling(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Frequently Asked Questions</Text>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.accordionItem}>
                <TouchableOpacity
                  onPress={() => toggle(index)}
                  style={styles.questionBox}
                >
                  <Text style={styles.questionText}>{faq.question}</Text>
                </TouchableOpacity>
                {openIndex === index && (
                  <View style={styles.answerBox}>
                    <Text style={styles.answerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FAQModal;

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
    header: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
      textAlign: "center",
    },
    accordionItem: {
      borderBottomWidth: 1,
      borderBottomColor: "#eee",
      marginBottom: 10,
    },
    questionBox: {
      paddingVertical: 12,
    },
    questionText: {
      fontSize: 16,
      fontWeight: "600",
    },
    answerBox: {
      paddingVertical: 8,
    },
    answerText: {
      fontSize: 14,
      color: "#333",
    },
    closeButton: {
      marginTop: 16,
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
