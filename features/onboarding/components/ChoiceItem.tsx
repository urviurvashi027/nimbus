import ThemeContext from "@/contexts/ThemeContext";
import React, { useContext } from "react";
import { Text, StyleSheet, Pressable } from "react-native";

const ChoiceItem = ({ choice, selected, onPress }: any) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choiceItem,
        selected && {
          borderColor: newTheme.accent,
          backgroundColor: "#2A2D24",
        },
      ]}
    >
      <Text style={styles.choiceText}>
        {choice.icon ? `${choice.icon} ` : ""}
        {choice.label}
      </Text>
      {selected && (
        <Text style={{ color: newTheme.accent, fontWeight: "600" }}>✓</Text>
      )}
    </Pressable>
  );
};

export default ChoiceItem;

const styling = (newTheme: any) =>
  StyleSheet.create({
    choiceItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderWidth: 2,
      borderColor: newTheme.surface,
      borderRadius: 12,
      padding: 18,
      marginBottom: 12,
    },
    choiceText: {
      fontSize: 16,
      color: newTheme.textPrimary,
    },
  });
