// components/FilterPill.tsx
import React from "react";
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

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: "#aaa",
    fontWeight: "600",
  },
  datePill: {
    // backgroundColor: "#1a1a1a",
  },
  dateSelected: {
    backgroundColor: "#9DFF56",
  },
  dateLabelSelected: {
    color: "#000",
  },
  tagPill: {
    backgroundColor: "#222",
  },
  tagSelected: {
    backgroundColor: "#A78BFA", // purple
  },
  tagLabelSelected: {
    color: "#fff",
  },
});
