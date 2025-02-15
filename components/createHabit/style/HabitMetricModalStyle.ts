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
    input: {
      borderWidth: 1,
      // borderColor: "#ccc",
      borderRadius: 5,
      padding: 10,
      fontSize: 16,
      // color: "#333",
      marginBottom: 30,
    },
    inputContainer: {
      marginBottom: 30,
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
    label: {
      fontSize: 16,
      // color: "#333",
      marginBottom: 5,
    },
    dropDown: {
      backgroundColor: themeColors[theme].background,
      borderColor: themeColors[theme].inpurBorderColor,
      color: themeColors[theme].text,
    },
    saveButton: {
      backgroundColor: themeColors[theme].primaryColor,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
      marginTop: 20,
    },
    saveButtonText: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
    },
    item: {
      color: themeColors[theme].text,
      borderColor: themeColors[theme].inpurBorderColor,
    },
  });

export default styling;
