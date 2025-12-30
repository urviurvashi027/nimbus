// src/app/(auth)/Tools/Recipe/RecipeScreen.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { router, useNavigation } from "expo-router";

import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";

import AnimatedChip from "@/components/tools/common/AnimatedChips";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";
import ContentPosterCard from "@/components/tools/common/ContentPosterCard"; // same card as Routine
import EmptyState from "@/components/tools/common/EmptyState";
import { RoutineSkeletonGrid } from "@/components/tools/common/RoutineSkeletonGrid";

import { getRecipeList } from "@/services/toolService";

// ───────────────────────────────── Filters ────────────────────────────────────
const FILTERS = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Beverages",
  "Snacks",
  "Soup",
  "Dessert",
  "Sauce",
  "NonVeg",
] as const;

type FilterLabel = (typeof FILTERS)[number];

// Map UI label → backend slug (except All)
const FILTER_MAP: Record<FilterLabel, string | undefined> = {
  All: undefined,
  Breakfast: "Breakfast",
  Lunch: "Lunch",
  Dinner: "Dinner",
  Beverages: "Drink", // backend spelling
  Snacks: "Snack",
  Soup: "Soup",
  Dessert: "Dessert",
  NonVeg: "Non-Veg",
  Sauce: "Sauce",
};

const RecipeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const [selectedFilter, setSelectedFilter] = useState<FilterLabel>("All");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // ───────────────────────────── API ─────────────────────────────
  const fetchRecipes = async (filter: FilterLabel) => {
    try {
      setIsLoading(true);
      const categorySlug = FILTER_MAP[filter];

      const result = await getRecipeList(categorySlug);
      if (result && Array.isArray(result)) {
        const heights = [250, 280, 220, 270, 230, 240];

        const processed = result.map((item: any) => ({
          ...item,
          height: heights[Math.floor(Math.random() * heights.length)],
          image: { uri: item.image },
        }));

        setRecipes(processed);

        console.log(processed, "recipes fetched for filter:", filter);
      } else {
        console.error("Recipe API did not return array:", result);
        setRecipes([]);
      }
    } catch (err) {
      console.log("Recipe API error", err);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes("All");
  }, []);

  const handleFilterPress = (label: FilterLabel) => {
    setSelectedFilter(label);
    fetchRecipes(label);
  };

  const handleItemClick = (item: any) => {
    router.push({
      pathname: "/(auth)/toolsScreen/ContentDetailsScreen",
      params: { id: item.id, type: "recipe" },
    });
  };

  const subtitle = "Find recipes that support your routine and nourish you.";

  // ─────────────────────── Header inside list ─────────────────────
  const renderListHeader = () => (
    <View>
      <ToolScreenHeader
        title="Recipe Plan"
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        {FILTERS.map((label) => (
          <AnimatedChip
            key={label}
            label={label}
            selected={selectedFilter === label}
            onPress={() => handleFilterPress(label)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderEmpty = () =>
    isLoading ? (
      <RoutineSkeletonGrid spacing={spacing} theme={newTheme} />
    ) : (
      <EmptyState
        title={
          selectedFilter === "All"
            ? "No recipes found."
            : `No ${selectedFilter.toLowerCase()} recipes found.`
        }
        subtitle="Try switching filters or check back later for new recipes."
        color={newTheme.textSecondary}
      />
    );

  // ───────────────────────────── UI ───────────────────────────────
  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={recipes}
          numColumns={2}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          ListHeaderComponentStyle={{ marginBottom: spacing.md }}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <ContentPosterCard
              title={item.title}
              image={item.image}
              tag={item.category}
              height={item.height}
              onPress={() => handleItemClick(item)}
            />
          )}
        />
      </SafeAreaView>
    </ScreenView>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    listContent: {
      paddingBottom: spacing.xl * 2,
      paddingTop: spacing.md, // cards sit close to chips, like Routine
    },
    columnWrapper: {
      justifyContent: "space-between",
      paddingHorizontal: 0,
      marginBottom: spacing.md,
    },
    chipsContainer: {
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
  });

export default RecipeScreen;
