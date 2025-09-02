import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  title: string;
  accentColor?: string;
  onSelect?: (value: string) => void;
  type?: "weekly" | "monthly" | "default";
}

export default function HeaderPanel({
  title,
  type = "default",
  accentColor = "#000",
  onSelect,
}: Props) {
  const [selected, setSelected] = useState("Today");
  const [open, setOpen] = useState(false);
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const weekly = ["Current week", "Previous week", "Future weeks"];
  const monthly = ["Current month", "Previous month", "Future month"];

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);
    onSelect?.(value);
  };

  return (
    <View style={styles.container}>
      {/* Left side title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right side dropdown */}

      {(type === "monthly" || type === "weekly") && (
        <View style={{ position: "relative", zIndex: 100 }}>
          <TouchableOpacity
            style={[styles.dropdownButton, { backgroundColor: accentColor }]}
            onPress={() => setOpen(!open)}
          >
            <Text style={styles.dropdownText}>{selected}</Text>
            <Ionicons
              name={open ? "chevron-up" : "chevron-down"}
              size={16}
              color="#fff"
            />
          </TouchableOpacity>

          {open && (
            <View style={styles.dropdownMenu}>
              {type &&
                type === "monthly" &&
                monthly.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.dropdownItem}
                    onPress={() => handleSelect(opt)}
                  >
                    <Text style={styles.dropdownItemText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              {type &&
                type === "weekly" &&
                weekly.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.dropdownItem}
                    onPress={() => handleSelect(opt)}
                  >
                    <Text style={styles.dropdownItemText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: newTheme.textPrimary,
    },
    dropdownButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    dropdownText: {
      color: newTheme.textSecondary,
      fontSize: 14,
      marginRight: 6,
    },
    dropdownMenu: {
      position: "absolute",
      top: 40,
      right: 0,
      backgroundColor: newTheme.surface,
      elevation: 10, // ✅ Android shadow
      zIndex: 100,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    dropdownItem: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    dropdownItemText: {
      fontSize: 14,
      color: newTheme.textPrimary,
    },
  });
