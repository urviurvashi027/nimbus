import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "@/components/Themed";

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    label: {
      fontSize: 16,
      marginBottom: 5,
      marginTop: 5,
      marginRight: 5,
      color: themeColors.basic.mediumGrey,
      width: "30%",
    },
    selectorButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 5,
      // marginBottom: 10,
      width: "100%",
    },
    selectorText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
      paddingLeft: 30,
      margin: "auto",
    },
    iconLeft: {
      padding: 0,
      marginRight: 5,
    },
    iconRight: {
      // marginLeft: 9,
      // width: "5%",
    },
  });

export default styling;
