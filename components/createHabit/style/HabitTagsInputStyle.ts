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
      width: "50%",
    },
    selectorButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 5,
      marginBottom: 10,
      //   width: "100%",
    },
    selectorText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
      //   paddingLeft: 30,
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
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 10,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#e0f7fa",
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 5,
      marginBottom: 5,
    },
    tagText: {
      marginRight: 5,
      fontSize: 14,
      color: "#333",
    },
  });

export default styling;
