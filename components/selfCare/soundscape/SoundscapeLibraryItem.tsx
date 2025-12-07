// src/components/selfCare/soundscape/SoundscapeLibraryItem.tsx

import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";

interface Props {
  item: any;
  isActive: boolean;
  onPress: () => void;
}

const SoundscapeLibraryItem: React.FC<Props> = ({
  item,
  isActive,
  onPress,
}) => {
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.8}>
      <Image source={item.image as ImageSourcePropType} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.duration}>
          {item.duration || "3"} min · Soundscapes
        </Text>
      </View>

      <Ionicons
        name={isActive ? "pause" : "play"}
        size={20}
        color={newTheme.textSecondary}
      />
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
    image: {
      width: 56,
      height: 56,
      borderRadius: 14,
      marginRight: spacing.md,
    },
    textContainer: {
      flex: 1,
    },
    itemTitle: {
      ...typography.body,
      color: newTheme.textPrimary,
      marginBottom: 2,
      fontWeight: "600",
    },
    duration: {
      ...typography.caption,
      color: newTheme.textSecondary,
    },
  });

export default SoundscapeLibraryItem;
