import React, { useContext, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/contexts/ThemeContext";
import type { JournalCard } from "@/features/self-care/utils/journaling";

interface JournalEntryCardProps {
  item: JournalCard;
  onPress: () => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ item, onPress }) => {
  const { newTheme: theme, svaTypography, spacing, typography } =
    useContext(ThemeContext);
  const styles = useMemo(
    () => styling(theme, svaTypography, spacing, typography),
    [theme, svaTypography, spacing, typography]
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardTopRow}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.cardMetaWrap}>
          <Text style={styles.cardDate} numberOfLines={1}>
            {item.dateLabel}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.textSecondary}
          />
        </View>
      </View>

      <Text style={styles.cardDescription} numberOfLines={5}>
        {item.description}
      </Text>

      <View style={styles.tagsRow}>
        {item.tags.map((tag) => (
          <View key={`${item.id}-${tag}`} style={styles.tagChip}>
            <Text style={styles.tagText}>#{tag.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const styling = (theme: any, svaTypography: any, spacing: any, typography: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 26,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: spacing.lg,
      shadowColor: theme.shadow,
      shadowOpacity: 0.24,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },
    cardPressed: {
      transform: [{ scale: 0.99 }],
      backgroundColor: theme.surfaceMuted,
    },
    cardTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 14,
      gap: 12,
    },
    cardMetaWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 2,
    },
    cardTitle: {
      flex: 1,
      fontFamily:
        svaTypography?.textStyle.authTitle.fontFamily ??
        "CormorantGaramond_500Medium",
      fontSize: 26,
      lineHeight: 28,
      color: theme.accent,
      fontStyle: "italic",
      letterSpacing: -0.3,
    },
    cardDate: {
      ...typography.smallCaption,
      color: theme.textSecondary,
      marginTop: 5,
      textTransform: "uppercase",
    },
    cardDescription: {
      fontFamily:
        svaTypography?.textStyle.body.fontFamily ?? "Inter_400Regular",
      fontSize: 16,
      lineHeight: 26,
      color: theme.textPrimary,
      opacity: 0.95,
    },
    tagsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 18,
    },
    tagChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      backgroundColor: "rgba(163,190,140,0.12)",
      borderWidth: 1,
      borderColor: "rgba(163,190,140,0.16)",
    },
    tagText: {
      ...typography.smallCaption,
      color: theme.chart2 ?? theme.accent,
      letterSpacing: 1.1,
    },
  });

export default JournalEntryCard;
