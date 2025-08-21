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
      width: "90%",
      backgroundColor: themeColors[theme].background,
      borderRadius: 10,
      padding: 20,
      maxHeight: "90%",
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
    toggleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
    },
    optionsContainer: {
      marginBottom: 20,
    },
    radioContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    radioText: {
      marginLeft: 8,
      fontSize: 16,
      color: themeColors[theme].text,
    },
    timePickerButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    timePickerText: {
      fontSize: 16,
      color: themeColors[theme].text,
    },
    saveButton: {
      backgroundColor: themeColors.basic.secondaryColor,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    saveButtonText: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
    },
    errorText: {
      color: themeColors.basic.danger,
      marginTop: 5,
      fontSize: 14,
      textAlign: "center",
    },
  });

export default styling;
