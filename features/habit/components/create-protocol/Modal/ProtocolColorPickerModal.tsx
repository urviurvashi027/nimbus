import React, { useContext, useMemo } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/contexts/ThemeContext";
import ModalHeader from "@/components/ui/modal/ModalHeader";

export type ProtocolColorOption = {
  label: string;
  value: string;
};

export const PROTOCOL_COLOR_OPTIONS: ProtocolColorOption[] = [
  { label: "Rose Silk", value: "#FFEDFA" },
  { label: "Mint Frost", value: "#B4EBE6" },
  { label: "Solar Dust", value: "#F8ED8C" },
  { label: "Moss Aura", value: "#C1CFA1" },
  { label: "Iris Mist", value: "#B7B1F2" },
];

type ProtocolColorPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedColor: ProtocolColorOption;
  onSelect: (color: ProtocolColorOption) => void;
  title?: string;
};

export default function ProtocolColorPickerModal({
  visible,
  onClose,
  selectedColor,
  onSelect,
  title = "Choose Aura",
}: ProtocolColorPickerModalProps) {
  const { newTheme, spacing } = useContext(ThemeContext);

  const styles = useMemo(
    () => makeStyles(newTheme, spacing),
    [newTheme, spacing]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.container}>
          <ModalHeader
            title={title}
            onClose={onClose}
            style={styles.headerCompact}
          />

          <View style={styles.colorsGrid}>
            {PROTOCOL_COLOR_OPTIONS.map((item) => {
              const isSelected = selectedColor.value === item.value;

              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.colorOption,
                    { backgroundColor: item.value },
                    isSelected && styles.selectedColorOption,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color="rgba(0,0,0,0.3)"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: any, spacing: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlayStrong,
    },
    container: {
      width: "100%",
      backgroundColor: colors.surfaceMuted,
      borderRadius: 32,
      padding: spacing.xl,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.borderMuted,
    },
    headerCompact: {
      paddingHorizontal: 0,
      paddingTop: 0,
      paddingBottom: 12,
    },
    colorsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: spacing.md,
    },
    colorOption: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
    },
    selectedColorOption: {
      borderWidth: 3,
      borderColor: colors.accent,
    },
  });
