import React, { useContext, useMemo } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { Image } from "expo-image";

import ThemeContext from "@/contexts/ThemeContext";
import type { ColorSet } from "@/theme/types";
import type { WorkoutGuideSlide } from "@/features/self-care/utils/workoutGuide";

interface WorkoutGuideSlideCardProps {
  slide: WorkoutGuideSlide;
  style?: ViewStyle;
}

const WorkoutGuideSlideCard: React.FC<WorkoutGuideSlideCardProps> = ({
  slide,
  style,
}) => {
  const { newTheme: theme } = useContext(ThemeContext);
  const styles = useMemo(() => styling(theme), [theme]);

  return (
    <View style={[styles.card, style]}>
      <Image source={slide.image} style={styles.image} contentFit="cover" />
    </View>
  );
};

const styling = (theme: ColorSet) =>
  StyleSheet.create({
    card: {
      width: "100%",
    },
    image: {
      width: "100%",
      height: 320,
      borderRadius: 24,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.borderMuted ?? "rgba(255,255,255,0.05)",
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
  });

export default WorkoutGuideSlideCard;
