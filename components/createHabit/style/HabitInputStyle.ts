import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { ThemeKey } from "@/components/Themed";

const styling = (theme: ThemeKey, newTheme?: any) =>
  StyleSheet.create({
    // label: {
    //   fontSize: 16,
    //   marginBottom: 5,
    //   marginTop: 5,
    //   marginRight: 5,
    //   color: themeColors.basic.mediumGrey,
    //   width: "50%",
    // },
    // inputField: {
    //   borderBottomWidth: 1, // Only bottom border
    //   borderColor: themeColors[theme].inpurBorderColor,
    //   width: "90%",
    //   flex: 1,
    //   flexDirection: "row",
    //   alignItems: "center",
    //   paddingVertical: 5,
    //   paddingHorizontal: 5,
    // },
    // selectorButton: {
    //   flexDirection: "row",
    //   alignItems: "center",
    //   paddingVertical: 9,
    //   paddingHorizontal: 5,
    //   width: "100%",
    // },
    // selectorText: {
    //   fontSize: 16,
    //   width: 130,
    //   color: themeColors.basic.mediumGrey,
    //   //   paddingLeft: 30,
    //   margin: "auto",
    // },
    iconLeft: {
      padding: 0,
      marginRight: 5,
    },
    iconRight: {
      marginLeft: 10,
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
      borderWidth: 1,
      borderColor: newTheme.divider,
      backgroundColor: newTheme.background,
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 5,
      marginRight: 10,
      marginBottom: 5,
    },
    tagText: {
      marginRight: 5,
      fontSize: 14,
      color: newTheme.accent,
    },

    // new style

    rowItem: {
      paddingVertical: 16,
      paddingHorizontal: 4,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.03)",
    },
    rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowLabel: {
      marginLeft: 8,
      color: newTheme.textSecondary || "red",
      fontSize: 15,
    },
    rowRight: { flexDirection: "row", alignItems: "center", gap: 8 },
    rowValue: { color: newTheme.textPrimary, fontSize: 15, fontWeight: "600" },
  });

export default styling;
