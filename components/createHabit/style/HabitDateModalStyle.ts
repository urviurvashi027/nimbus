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
    },
    datePickerButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    datePickerText: {
      fontSize: 16,
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
      // color: "#333",
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
    frequencyContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    pill: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: themeColors.basic.lightGrey,
    },
    inputLabel: {},
    selectedPill: {
      backgroundColor: themeColors.basic.secondaryColor,
    },
    pillText: {
      color: themeColors.basic.mediumGrey,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    labelFreq: {
      fontSize: 16,
      marginRight: 10,
      marginLeft: 10,
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 5,
      width: 50,
      textAlign: "center",
    },
    dayContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
    },
    dayPill: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: themeColors.basic.tertiaryColor,
      margin: 5,
    },
    selectedDayPill: {
      backgroundColor: themeColors.basic.secondaryColor,
      // backgroundColor: "#007AFF",
    },
    dayText: {
      color: themeColors.basic.mediumGrey,
    },
    monthDay: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: themeColors.basic.tertiaryColor,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
    },
    selectedMonthDay: {
      backgroundColor: themeColors.basic.secondaryColor,
    },
    // saveButton: {
    //   backgroundColor: themeColors.basic.secondaryColor,
    //   paddingVertical: 15,
    //   borderRadius: 5,
    //   alignItems: "center",
    // },
    // saveButtonText: {
    //   color: themeColors[theme].text,
    //   fontSize: 16,
    //   fontWeight: "bold",
    // },
  });

export default styling;
