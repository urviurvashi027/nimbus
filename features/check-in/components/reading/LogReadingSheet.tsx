// components/reading/LogReadingSheet/LogReadingModal.tsx
import React, { useContext, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import QuickLogTab, { QuickLogPayload } from "./QuickLog";
import TimerTab from "./TimerTab";
import { SegmentedTabs } from "./ui/SegmentedTab";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaveQuick?: (payload: QuickLogPayload) => void;
  onSaveTimer?: (payload: QuickLogPayload) => void;
  initialTab?: "quick" | "timer";
};

export default function LogReadingModal({
  visible,
  onClose,
  onSaveQuick,
  onSaveTimer,
  initialTab = "quick",
}: Props) {
  const [tab, setTab] = useState<"quick" | "timer">(initialTab);
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Bottom sheet-like surface */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.sheet}>
          {/* Drag handle substitute */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Log reading</Text>
            <SegmentedTabs
              value={tab}
              onChange={(v) => setTab(v)}
              options={[
                { key: "quick", label: "Quick Log" },
                { key: "timer", label: "Timer" },
              ]}
            />
          </View>

          {/* Content (scrollable) */}
          <ScrollView
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {tab === "quick" ? (
              <QuickLogTab
                onCancel={onClose}
                onSave={(p) => {
                  onSaveQuick?.(p);
                  onClose();
                }}
              />
            ) : (
              <TimerTab
                onCancel={onClose}
                onSave={(p) => {
                  onSaveTimer?.(p);
                  onClose();
                }}
              />
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: newTheme.overlay,
    },
    container: {
      flex: 1,
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: newTheme.card, // Nimbus card
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: newTheme.border,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 8,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: -8 },
      elevation: 16,
      maxHeight: "85%", // two snap-like heights
    },
    handle: {
      alignSelf: "center",
      width: 44,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: "#3A3F4B",
      marginBottom: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    title: { color: "#F6F7F9", fontSize: 18, fontWeight: "800" },
  });
