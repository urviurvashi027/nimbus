import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "@/components/Themed";

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      width: "85%",
      backgroundColor: themeColors[theme].background,
      borderRadius: 10,
      padding: 20,
      maxHeight: "85%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    listContainer: {
      // Optional: Add any additional styling if needed
    },
    tagButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    tagText: {
      fontSize: 16,
      color: themeColors[theme].text,
    },
    addNewContainer: {
      marginTop: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
    },
    addButton: {
      marginTop: 10,
      backgroundColor: themeColors.basic.secondaryColor,
      paddingVertical: 12,
      borderRadius: 5,
      alignItems: "center",
    },
    addButtonText: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
    },
    errorText: {
      color: themeColors.basic.danger,
      marginTop: 5,
      fontSize: 14,
    },
  });

export default styling;
