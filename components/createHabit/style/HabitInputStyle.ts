import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";

const styling = (newTheme: any, spacing: any) =>
  StyleSheet.create({
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

    // rowItem: {
    //   paddingVertical: spacing.md + 2, // ↑ more breathing space
    //   paddingHorizontal: spacing.md, // consistent left/right
    //   flexDirection: "row",
    //   alignItems: "center",
    //   justifyContent: "space-between",
    //   borderBottomWidth: 1,
    //   borderBottomColor: "rgba(255,255,255,0.06)",
    // },
    // rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowLabel: {
      marginLeft: 8,
      color: newTheme.textSecondary || "red",
      fontSize: 15,
    },
    // rowRight: { flexDirection: "row", alignItems: "center", gap: 8 },
    // rowValue: { color: newTheme.textPrimary, fontSize: 15, fontWeight: "600" },
    rowItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 0, // left label stays stable
    },

    rowRight: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      flexShrink: 1, // allow right side to shrink
      maxWidth: "55%", // tweak: 50–65% depending on your UI
    },

    rowValue: {
      flexShrink: 1, // IMPORTANT: text must shrink
      textAlign: "right",
      marginRight: 8, // space before chevron
      color: newTheme.textPrimary,
      fontSize: 15,
      fontWeight: "600",
    },
  });

export default styling;
