import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { router } from "expo-router";
// import { ThemeKey } from "../Themed";

interface HabitItemProps {
  id: string;
  name: string;
  icon?: any; // pass require() or URI
  time?: string;
  done: boolean;
  description?: string;
  frequency: string;
  color?: string;
  actual_count: any;
  onToggle: (id: string, actual_count: any) => void;
}

const HabitItemCard: React.FC<HabitItemProps> = ({
  id,
  name,
  icon,
  time,
  done,
  frequency,
  description,
  actual_count,
  onToggle,
}: HabitItemProps) => {
  const { theme, newTheme } = React.useContext(ThemeContext);

  const handlePress = () => {
    onToggle(id, actual_count);
  };

  const handleHabitClick = () => {
    console.log(id, actual_count, "habitClikc");
    router.push({ pathname: "/habit/details", params: { id: id } });
  };

  return (
    <TouchableOpacity
      style={styles(newTheme).container}
      onPress={handleHabitClick}
    >
      {/* Icon */}

      {/* Icon with round surface background */}
      <View style={styles(newTheme).iconContainer}>
        {icon ? (
          <Text style={styles(newTheme).iconText}>{icon}</Text>
        ) : (
          <Ionicons
            name="leaf-outline"
            size={18}
            color={newTheme.textSecondary}
          />
        )}
      </View>

      {/* Text info */}
      <View style={styles(newTheme).textContainer}>
        <Text style={styles(newTheme).title}>{name}</Text>
        {frequency && (
          <Text style={styles(newTheme).frequency}>{frequency}</Text>
        )}
        {time && <Text style={styles(newTheme).time}>{time}</Text>}
      </View>

      {/* Status circle */}
      <View style={styles(newTheme).statusContainer}>
        {done ? (
          <View style={[styles(newTheme).circle, styles(newTheme).circleDone]}>
            <Ionicons name="checkmark" size={16} color={newTheme.surface} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles(newTheme).container}
            onPress={handlePress}
          >
            <View
              style={[styles(newTheme).circle, styles(newTheme).circleEmpty]}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = (newTheme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      backgroundColor: newTheme.surface,
      borderRadius: 12,
      marginVertical: 12,
    },
    // New rounded background for icon
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: newTheme.surface ?? "#2A2A2A", // fallback if no surfaceVariant
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    iconText: {
      fontSize: 20,
      color: newTheme.textPrimary,
    },
    icon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.textPrimary,
    },
    frequency: {
      fontSize: 12,
      color: newTheme.textSecondary,
      marginTop: 2,
    },
    time: {
      fontSize: 12,
      color: newTheme.textSecondary,
      marginTop: 2,
    },
    statusContainer: {
      marginLeft: 12,
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    circleDone: {
      borderWidth: 1,
      borderColor: newTheme.accent,
      backgroundColor: newTheme.accent,
    },
    circleEmpty: {
      borderWidth: 1,
      borderColor: newTheme.textSecondary,
      backgroundColor: "transparent",
    },
  });

export default HabitItemCard;
