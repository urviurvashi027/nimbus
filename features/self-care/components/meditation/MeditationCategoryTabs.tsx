// components/selfCare/meditation/MeditationCategoryTabs.tsx
import React, { useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ThemeContext from "@/context/ThemeContext";

interface Props {
  categories: string[];
  currentCategory: string;
  onChangeCategory: (c: string) => void;
}

const MeditationCategoryTabs: React.FC<Props> = ({
  categories,
  currentCategory,
  onChangeCategory,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {categories.map((category) => {
          const active = currentCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onChangeCategory(category)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styling = (newTheme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    wrapper: {
      marginBottom: spacing.lg,
    },
    tabsContainer: {
      paddingVertical: spacing.xs,
    },
    tab: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 999,
      backgroundColor: newTheme.surfaceMuted,
      marginRight: spacing.sm,
    },
    tabActive: {
      backgroundColor: newTheme.selected,
    },
    tabText: {
      ...typography.caption,
      color: newTheme.textSecondary,
    },
    tabTextActive: {
      color: newTheme.textPrimary,
      fontWeight: "600",
    },
  });

export default MeditationCategoryTabs;
