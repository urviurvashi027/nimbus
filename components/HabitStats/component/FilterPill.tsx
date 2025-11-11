// components/FilterPill.tsx
import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { Pressable, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  selected?: boolean;
  onPress: () => void;
  type?: "date" | "tag";
}

export default function FilterPill({
  label,
  selected,
  onPress,
  type = "date",
}: Props) {
  const isDate = type === "date";
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        isDate ? styles.datePill : styles.tagPill,
        selected && (isDate ? styles.dateSelected : styles.tagSelected),
      ]}
    >
      <Text
        style={[
          styles.label,
          selected &&
            (isDate ? styles.dateLabelSelected : styles.tagLabelSelected),
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    pill: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderRadius: 20,
      marginRight: 8,
    },
    label: {
      fontSize: 14,
      color: newTheme.textSecondary,
      fontWeight: "600",
    },
    datePill: {
      // backgroundColor: "#1a1a1a",
    },
    dateSelected: {
      backgroundColor: newTheme.accentPressed,
    },
    dateLabelSelected: {
      color: newTheme.background,
    },
    tagPill: {
      backgroundColor: newTheme.surface,
    },
    tagSelected: {
      backgroundColor: newTheme.info, // purple
    },
    tagLabelSelected: {
      color: "#fff",
    },
  });
