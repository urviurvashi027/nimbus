import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import WorkoutVideoPlayerModal from "./WorkoutVideoPlayerModal";

interface Props {
  imageUri: string;
  reps: number;
  description: string;
  videoSource?: string;
  title?: string;
}

const ExerciseIntroCard: React.FC<Props> = ({
  imageUri,
  reps,
  description,
  videoSource,
  title = "Exercise Guide",
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => videoSource && setShowPlayer(true)}
        style={styles.imageWrapper}
      >
        <Image source={{ uri: imageUri }} style={styles.image} />
        {videoSource && (
          <View style={styles.playIconOverlay}>
            <Ionicons name="play" size={24} color="#FFF" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.right}>
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.repsRow}>
          <Ionicons name="refresh-circle" size={20} color="#6DFF8C" />
          <Text style={styles.repsText}>{reps} reps</Text>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      </View>

      {videoSource && (
        <WorkoutVideoPlayerModal
          visible={showPlayer}
          videoSource={videoSource}
          title={title}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      marginTop: spacing.md,
    },
    imageWrapper: {
      width: 120,
      height: 90,
      marginRight: spacing.md,
      borderRadius: 16,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
    },
    playIconOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.2)",
      justifyContent: "center",
      alignItems: "center",
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
    titleText: {
      ...typography.bodyStrong,
      color: newTheme.textPrimary,
      fontSize: 16,
      marginBottom: 2,
    },
    description: {
      ...typography.caption,
      color: newTheme.textSecondary,
      lineHeight: 18,
      height: 54, // Fixed height for 3 lines (18 * 3) to prevent layout jumps
    },
  });

export default ExerciseIntroCard;
