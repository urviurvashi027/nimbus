// src/components/selfCare/workout/ExerciseIntroCard.tsx

import React, { useContext } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  imageUri: string;
  reps: number;
  description: string;
}

const ExerciseIntroCard: React.FC<Props> = ({
  imageUri,
  reps,
  description,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <View style={styles.right}>
        <View style={styles.repsRow}>
          <Ionicons name="refresh-circle" size={20} color="#6DFF8C" />
          <Text style={styles.repsText}>{reps} reps</Text>
        </View>

        <Text style={styles.description} numberOfLines={4}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginTop: spacing.md,
    },
    image: {
      width: 120,
      height: 90,
      borderRadius: 16,
      marginRight: spacing.md,
    },
    right: {
      flex: 1,
    },
    repsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    repsText: {
      ...typography.body,
      fontSize: 16,
      color: newTheme.textPrimary,
      marginLeft: 6,
      fontWeight: "700",
    },
    description: {
      ...typography.caption,
      color: newTheme.textSecondary,
      lineHeight: 18,
    },
  });

export default ExerciseIntroCard;
