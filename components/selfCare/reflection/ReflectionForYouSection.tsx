// src/components/selfCare/reflection/ReflectionForYouSection.tsx

import React, { useContext } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import ReflectionFeaturedCard from "@/components/selfCare/reflection/ReflectionFeatureCard";

const { width } = Dimensions.get("window");

interface ColorPair {
  bgColor: string;
  color: string;
}

interface Props {
  data: any[];
  colorPalette: ColorPair[];
  onPressCard: (item: any) => void;
}

const ReflectionForYouSection: React.FC<Props> = ({
  data,
  colorPalette,
  onPressCard,
}) => {
  const { theme, newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(theme, newTheme, spacing, typography);

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>For You</Text>
      </View>

      <FlatList
        horizontal
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <ReflectionFeaturedCard
            data={item}
            onPress={onPressCard}
            cardColor={colorPalette[index % colorPalette.length]}
          />
        )}
        snapToAlignment="start"
        snapToInterval={width * 0.8 + spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={{ paddingRight: spacing.md }}
        style={styles.featuredList}
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
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.h3,
      color: newTheme.textPrimary,
    },
    featuredList: {
      height: 180, // to comfortably fit the cards
    },
  });

export default ReflectionForYouSection;
