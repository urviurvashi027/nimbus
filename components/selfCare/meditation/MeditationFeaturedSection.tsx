import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";

import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import MeditationFeaturedCard from "@/components/selfCare/meditation/MeditationFeautredCard";
import { EnrichedMeditation } from "@/app/(auth)/selfCareScreen/MeditationScreen";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

interface MeditationFeaturedSectionProps {
  data: EnrichedMeditation[];
  onPress: (item: EnrichedMeditation) => void | Promise<void>;
  colorPalette: { bgColor: string; color: string }[];
}

const MeditationFeaturedSection: React.FC<MeditationFeaturedSectionProps> = ({
  data,
  onPress,
  colorPalette,
}) => {
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  if (!data.length) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>For You</Text>
      <FlatList
        horizontal
        data={data.slice(0, 5)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="start"
        snapToInterval={CARD_WIDTH + spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: spacing.md }}
        renderItem={({ item, index }) => (
          <MeditationFeaturedCard
            data={item}
            onPress={onPress}
            cardColor={colorPalette[index % colorPalette.length]}
          />
        )}
      />
    </View>
  );
};

const styling = (
  theme: ThemeKey,
  newTheme: any,
  spacing: any,
  typography: any
) =>
  StyleSheet.create({
    sectionContainer: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      ...typography.h3,
      color: newTheme.textPrimary,
      marginBottom: spacing.sm,
    },
  });

export default MeditationFeaturedSection;
