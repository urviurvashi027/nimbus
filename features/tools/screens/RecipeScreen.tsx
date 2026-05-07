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

import { ScreenView } from "@/components/ui/Themed";
import ThemeContext from "@/contexts/ThemeContext";

// <<<<<<< HEAD:features/tools/screens/RecipeScreen.tsx
// import AnimatedChip from "@/features/tools/components/common/AnimatedChips";
import ToolScreenHeader from "@/features/tools/components/common/ToolScreenHeader";
import ContentPosterCard from "@/features/tools/components/common/ContentPosterCard";
import EmptyState from "@/features/tools/components/common/EmptyState";
import { RoutineSkeletonGrid } from "@/features/tools/components/common/RoutineSkeletonGrid";
// =======

// <<<
import { getRecipeList } from "@/features/tools/services/toolService";
import { ROUTES } from "@/constants/routes";
import AppHeader from "@/components/layout/AppHeader";
import AnimatedChip from "../components/common/AnimatedChips";
import RecipeCard from "../components/common/RecipeCard";
// =======
// import AppHeader from "@/components/common/AppHeader";

// import RecipeCard from "@/components/tools/common/RecipeCard";

// import EmptyState from "@/components/tools/common/EmptyState";
// import { RoutineSkeletonGrid } from "@/components/tools/common/RoutineSkeletonGrid";

// import { getRecipeList } from "@/services/toolService";
// >>>>>

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

export const RecipeScreen: React.FC = () => {
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

      const result: any = await getRecipeList(categorySlug);
      // Backend returns { success, message, data: [...] }
      const data = result?.data || (Array.isArray(result) ? result : []);

      if (Array.isArray(data)) {
        const heights = [250, 280, 220, 270, 230, 240];

        const processed = data.map((item: any) => ({
          ...item,
          height: heights[Math.floor(Math.random() * heights.length)],
          // Provide a fallback if image is null
          // <<<<<
          image: item.image
            ? { uri: item.image }
            : require("@/assets/images/mt.jpg"),
          // ===
          // image: item.image ? { uri: item.image } : require("@/assets/images/mt.jpg"),
          // favorite: Math.random() > 0.5, // Randomized favorite state as requested
          // >>>
        }));

        setRecipes(processed);
      } else {
        console.error("Recipe API did not return data array:", result);
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
      // <<
      pathname: ROUTES.AUTH.TOOLS_CONTENT_DETAILS,
      params: { id: item.id, type: "recipe" },
      // ==
      // pathname: "/(auth)/toolsScreen/RecipeDetailScreen",
      // params: { id: item.id },
      // >>
    });
  };

  const subtitle = "Find recipes that support your routine and nourish you.";

  // ─────────────────────── Header inside list ─────────────────────
  const renderListHeader = () => (
    <View>
      <AppHeader
        title="Recipe Plan"
        subtitle={subtitle}
        onBack={() => navigation.goBack()}
        rightActions={[
          {
            icon: "heart-outline",
            onPress: () => console.log("Favorites pressed"),
          },
          {
            icon: "bag-outline",
            onPress: () => console.log("Cart pressed"),
            badge: true,
          },
        ]}
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
            <RecipeCard
              title={item.title || item.name}
              image={item.image}
              tag={item.category}
              height={item.height}
              time={item.prep_time || "15 min"}
              calories={item.calories ? `${item.calories} kcal` : undefined}
              favorite={item.favorite}
              onPress={() => handleItemClick(item)}
              onFavoritePress={async (isFav) => {
                // Mocking an API call
                return new Promise((resolve) => setTimeout(resolve, 800));
              }}
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
      paddingTop: spacing.md,
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
