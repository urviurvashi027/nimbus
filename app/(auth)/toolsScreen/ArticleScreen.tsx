import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  SafeAreaView,
  Text,
  ScrollView,
} from "react-native";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { ScreenView } from "@/components/Themed";

import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";
import AnimatedChip from "@/components/tools/common/AnimatedChips";
import { RoutineSkeletonGrid } from "@/components/tools/common/RoutineSkeletonGrid";
import ContentPosterCard from "@/components/tools/common/ContentPosterCard";

import { getArticleList } from "@/services/toolService";
import EmptyState from "@/components/tools/common/EmptyState";

// ──────────────────────────────────────────────
// Filters
// ──────────────────────────────────────────────

const FILTERS = [
  "All",
  "Herbs",
  "Mindfulness",
  "Meditation",
  "Epigenetics",
  "Neuroplasticity",
] as const;

type FilterLabel = (typeof FILTERS)[number];
type FilterCategory = Exclude<FilterLabel, "All">;

const FILTER_MAP: Record<FilterCategory, string> = {
  Herbs: "healingHerbs",
  Mindfulness: "mindfullness",
  Meditation: "meditation",
  Epigenetics: "epigenetics",
  Neuroplasticity: "neuroplasticity",
};

// ──────────────────────────────────────────────
// Screen
// ──────────────────────────────────────────────

const ArticleScreen: React.FC = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const [selectedFilter, setSelectedFilter] = useState<FilterLabel>("All");
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchArticles = async (filterKey: FilterLabel) => {
    try {
      setIsLoading(true);

      const backendCategory =
        filterKey === "All" ? undefined : FILTER_MAP[filterKey];

      const result = await getArticleList(backendCategory);

      if (result && Array.isArray(result)) {
        const heights = [250, 280, 220, 270, 230, 240];

        const processed = result.map((item: any) => ({
          ...item,
          height: heights[Math.floor(Math.random() * heights.length)],
          image: { uri: item.image },
        }));

        setArticles(processed);
      } else {
        console.error("Article API did not return array:", result);
        setArticles([]);
      }
    } catch (err) {
      console.log("Article API error", err);
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles("All");
  }, []);

  const handleFilterPress = (label: FilterLabel) => {
    setSelectedFilter(label);
    fetchArticles(label);
  };

  const handleItemClick = (item: any) => {
    router.push({
      pathname: "/(auth)/toolsScreen/ContentDetailsScreen",
      params: { id: item.id, type: "article" },
    });
  };

  // const renderListHeader = () => (
  //   <View>
  //     <ToolScreenHeader
  //       title="Article Library"
  //       subtitle="Deep dives into healing, neuroscience, and mindful living."
  //       onBack={() => navigation.goBack()}
  //     />

  //     <View style={styles.chipsRow}>
  //       {FILTERS.map((label) => (
  //         <AnimatedChip
  //           key={label}
  //           label={label}
  //           selected={selectedFilter === label}
  //           onPress={() => handleFilterPress(label)}
  //         />
  //       ))}
  //     </View>
  //   </View>
  // );

  /** ── Header *inside* FlatList so everything scrolls together ── */
  const renderListHeader = () => (
    <View>
      <ToolScreenHeader
        title="Article Library"
        subtitle="Deep dives into healing, neuroscience, and mindful living."
        onBack={() => navigation.goBack()}
        // compact // optional flag if your ToolScreenHeader supports it
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
    !isLoading ? (
      <EmptyState
        title={`No ${selectedFilter.toLowerCase()} items found.`}
        subtitle="Try switching filters or check back later."
        color={newTheme.textSecondary}
      />
    ) : (
      <RoutineSkeletonGrid spacing={spacing} theme={newTheme} />
    );

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
          data={articles}
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
              image={item.image}
              tag={item.tag}
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
    chipsRow: {
      flexDirection: "row",
      flexWrap: "nowrap",
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    chipsContainer: {
      paddingTop: spacing.md,
      paddingBottom: spacing.sm,
    },
    listContent: {
      paddingBottom: spacing.xl * 2,
      paddingTop: spacing.md,
    },
    columnWrapper: {
      justifyContent: "space-between",
      paddingHorizontal: 0,
      marginBottom: spacing.md,
    },
  });

export default ArticleScreen;
