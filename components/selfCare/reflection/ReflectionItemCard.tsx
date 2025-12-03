import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";

interface ReflectionItemCardProps {
  item: {
    id: number | string;
    title: string;
    description?: string;
    image: ImageSourcePropType;
    locked?: boolean;
    prompts?: { id: number; text: string }[];
  };
  onPress: (prompts: any[], id: number | string) => void;
}

const ReflectionItemCard: React.FC<ReflectionItemCardProps> = ({
  item,
  onPress,
}) => {
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  const handlePress = () => {
    if (!item.locked) {
      onPress(item.prompts || [], item.id);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, item.locked && styles.cardLocked]}
      disabled={item.locked}
      onPress={handlePress}
    >
      {/* Left thumbnail */}
      <Image source={item.image} style={styles.image} />

      {/* Right content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          {item.locked && (
            <View style={styles.lockPill}>
              <Ionicons
                name="lock-closed"
                size={12}
                color={newTheme.buttonPrimaryText}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.lockText}>Premium</Text>
            </View>
          )}
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : (
          <Text style={styles.descriptionMuted} numberOfLines={2}>
            Guided prompts to help you reflect with intention.
          </Text>
        )}
      </View>

      {/* Subtle chevron to hint navigation (only if not locked) */}
      {!item.locked && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={newTheme.textSecondary}
          style={styles.chevron}
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
    card: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.sm,
      borderRadius: 16,
      backgroundColor: newTheme.surfaceMuted,
      marginBottom: spacing.sm,
      shadowColor: newTheme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
    cardLocked: {
      opacity: 0.8,
    },
    image: {
      width: 56,
      height: 56,
      borderRadius: 16,
      marginRight: spacing.md,
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    title: {
      ...typography.body,
      color: newTheme.textPrimary,
      fontWeight: "600",
      flexShrink: 1,
    },
    lockPill: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: spacing.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: newTheme.buttonPrimary,
    },
    lockText: {
      ...typography.caption,
      color: newTheme.buttonPrimaryText,
      fontWeight: "600",
    },
    description: {
      ...typography.caption,
      color: newTheme.textSecondary,
      marginTop: 2,
    },
    descriptionMuted: {
      ...typography.caption,
      color: newTheme.disabled,
      marginTop: 2,
    },
    chevron: {
      marginLeft: spacing.sm,
    },
  });

export default ReflectionItemCard;
