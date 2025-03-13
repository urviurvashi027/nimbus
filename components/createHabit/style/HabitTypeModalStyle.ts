import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "@/components/Themed";

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,1)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "80%",
      backgroundColor: themeColors[theme].background,
      borderRadius: 10,
      padding: 20,
      maxHeight: "80%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      color: themeColors[theme].text,
      fontWeight: "bold",
    },
    listContainer: {
      // Optional: Add any additional styling if needed
    },
    typeButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    typeText: {
      fontSize: 16,
      color: themeColors[theme].text,
    },
  });

export default styling;
