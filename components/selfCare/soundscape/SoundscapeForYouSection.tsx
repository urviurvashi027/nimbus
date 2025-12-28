// src/components/selfCare/soundscape/SoundscapeForYouSection.tsx

import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";

import ThemeContext from "@/context/ThemeContext";

import SoundscapeFeaturedCard from "@/components/selfCare/soundscape/SoundscapeFeaturedCard";

const { width } = Dimensions.get("window");

interface ColorPair {
  bgColor: string;
  color: string;
}

interface Props {
  tracks: any[];
  onPlayPause: (track: any) => void;
  colorPalette: ColorPair[];
}

const SoundscapeForYouSection: React.FC<Props> = ({
  tracks,
  onPlayPause,
  colorPalette,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  if (!tracks || tracks.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>For You</Text>
      </View>

      <FlatList
        horizontal
        data={tracks}
        style={styles.featuredList}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <SoundscapeFeaturedCard
            data={item}
            onPress={onPlayPause}
            cardColor={colorPalette[index % colorPalette.length]}
          />
        )}
        snapToAlignment="start"
        snapToInterval={width * 0.8 + spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingRight: spacing.md,
          paddingVertical: spacing.md,
        }}
      />
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    sectionContainer: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    sectionTitle: {
      ...typography.h3,
      color: newTheme.textPrimary,
    },
    featuredList: {
      // height: 180, // fits card minHeight (150) + margins
    },
  });

export default SoundscapeForYouSection;
