import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "@/components/Themed";

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    selectorButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      marginVertical: 10,
    },
    iconLeft: {
      marginRight: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      flex: 1, // Takes available space between icons
    },
    selectorText: {
      fontSize: 16,
      marginRight: 10,
      color: "#888", // Placeholder color
    },
    iconRight: {
      marginLeft: 10,
    },
  });

export default styling;
