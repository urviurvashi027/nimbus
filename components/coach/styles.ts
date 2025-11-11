import { StyleSheet, Platform } from "react-native";

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  android: { elevation: 3 },
});

export const styles = (t: any) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: t.background, paddingHorizontal: 16 },
    // header
    navbar: {
      height: 54,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: t.textPrimary,
      marginTop: 8,
    },

    // insight
    insightCard: {
      backgroundColor: t.surface,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: t.divider,
      ...cardShadow,
    },
    insightRow: { flexDirection: "row", alignItems: "flex-start" },
    insightGlow: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: t.accent,
      opacity: 0.25,
      marginRight: 10,
    },
    insightText: {
      color: t.textPrimary,
      fontSize: 14,
      lineHeight: 20,
      flex: 1,
    },

    // sections
    sectionHeader: { marginTop: 18, marginBottom: 10 },
    sectionTitle: { color: t.textPrimary, fontSize: 22, fontWeight: "800" },

    // topics grid
    topicsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    topicCard: {
      width: "48%",
      backgroundColor: t.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: t.divider,
      padding: 14,
      marginBottom: 12,
      ...cardShadow,
    },
    topicRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    topicText: {
      color: t.textPrimary,
      fontSize: 16,
      fontWeight: "700",
      flex: 1,
    },
    topicIconWrap: {
      width: 28,
      height: 28,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.surfaceElevated ?? t.surface,
    },

    // advice
    adviceCard: {
      backgroundColor: t.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: t.divider,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 10,
      ...cardShadow,
    },
    adviceRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    adviceText: {
      color: t.textPrimary,
      fontSize: 15,
      fontWeight: "700",
      flex: 1,
    },
    adviceSub: { color: t.textSecondary, fontSize: 12, marginTop: 4 },

    // CTA
    ctaWrap: { paddingVertical: 14 },
    ctaBtn: {
      backgroundColor: t.accent,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
    },
    ctaText: { color: t.background, fontWeight: "800", fontSize: 16 },
    spacerBottom: { height: 24 },
  });
