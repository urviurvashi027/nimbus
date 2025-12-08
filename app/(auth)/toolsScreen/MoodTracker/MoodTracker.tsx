import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

interface Mood {
  label: string;
  value: string;
  emoji: string;
}

interface MoodTrackerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMood: (mood: string) => void;
}

const moods: Mood[] = [
  { label: "Great", value: "great", emoji: "😁" },
  { label: "Good", value: "good", emoji: "😊" },
  { label: "Okay", value: "okay", emoji: "😐" },
  { label: "Not Great", value: "not_great", emoji: "😕" },
  { label: "Bad", value: "bad", emoji: "😢" },
];

const MoodTrackerModal: React.FC<MoodTrackerModalProps> = ({
  visible,
  onClose,
  onSelectMood,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>How are you feeling today?</Text>
          <FlatList
            data={moods}
            keyExtractor={(item) => item.value}
            numColumns={3}
            contentContainerStyle={styles.moodList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.moodItem}
                onPress={() => {
                  onSelectMood(item.value);
                  onClose();
                }}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      width: "85%",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
      color: theme.textPrimary,
    },
    moodList: {
      alignItems: "center",
    },
    moodItem: {
      alignItems: "center",
      margin: 10,
    },
    emoji: {
      fontSize: 32,
    },
    label: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 4,
    },
    closeButton: {
      marginTop: 20,
      padding: 10,
      backgroundColor: theme.accent,
      borderRadius: 10,
    },
    closeText: {
      color: theme.background,
      textAlign: "center",
      fontWeight: "600",
    },
  });

export default MoodTrackerModal;
