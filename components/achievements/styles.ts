import { StyleSheet, Platform } from "react-native";

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
  },
  android: { elevation: 3 },
});

export const styles = (t: any) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: t.background },
    header: {
      height: 64,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backBtn: { padding: 8, borderRadius: 10 },
    headerTitle: { color: t.textPrimary, fontSize: 18, fontWeight: "800" },

    body: { flex: 1, paddingHorizontal: 16 },
    sectionTitle: {
      color: t.textPrimary,
      fontSize: 16,
      fontWeight: "700",
      marginTop: 4,
      marginBottom: 10,
    },

    achievementsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    achievementCard: {
      width: "48%",
      padding: 14,
      borderRadius: 14,
      backgroundColor: t.surface,
      borderWidth: 1,
      borderColor: t.divider,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      ...cardShadow,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.surfaceElevated ?? t.surface,
    },
    metricText: { color: t.textPrimary, fontSize: 18, fontWeight: "800" },
    metricLabel: { color: t.textSecondary, fontSize: 12, marginTop: 2 },

    badgesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
    },
  });
