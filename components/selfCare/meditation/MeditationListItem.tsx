// components/selfCare/meditation/MeditationListItem.tsx
import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { Meditations } from "@/types/toolsTypes";

interface Props {
  item: Meditations;
  isActive: boolean;
  isPlaying: boolean;
  onPress: () => void;
}

const MeditationListItem: React.FC<Props> = ({
  item,
  isActive,
  isPlaying,
  onPress,
}) => {
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  return (
    <TouchableOpacity
      style={[styles.item, isActive && styles.itemActive]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle}>{item.duration} · Meditation</Text>
      </View>
      {item.isLocked ? (
        <Ionicons name="lock-closed" size={18} color={newTheme.textSecondary} />
      ) : (
        <Ionicons
          name={isActive && isPlaying ? "pause" : "play"}
          size={20}
          color={newTheme.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
};

const styling = (
  theme: ThemeKey,
  newTheme: any,
  spacing: any,
  typography: any
) =>
  StyleSheet.create({
    item: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 14,
      backgroundColor: newTheme.surfaceMuted,
      marginBottom: spacing.sm,
    },
    itemActive: {
      backgroundColor: newTheme.selected,
    },
    image: {
      width: 56,
      height: 56,
      borderRadius: 14,
      marginRight: spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      ...typography.body,
      color: newTheme.textPrimary,
      fontWeight: "600",
      marginBottom: 2,
    },
    subtitle: {
      ...typography.caption,
      color: newTheme.textSecondary,
    },
  });

export default MeditationListItem;
