// RoutineScreen.tsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { router, useNavigation } from "expo-router";

import ThemeContext from "@/context/ThemeContext";

import { ScreenView } from "@/components/Themed";
import { RoutineSkeletonGrid } from "@/components/tools/common/RoutineSkeletonGrid";
import AnimatedChip from "@/components/tools/common/AnimatedChips";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";

import { getRoutineList } from "@/services/toolService";
import ContentPosterCard from "@/components/tools/common/ContentPosterCard";
import EmptyState from "@/components/tools/common/EmptyState";

const FILTERS = [
  "All",
  "Ayurveda",
  "Chores",
  "Fitness",
  "Wellness",
  "Beauty",
  "Hacks",
];

// Map UI filter → backend category
export const FILTER_MAP: Record<string, string | undefined> = {
  All: undefined,
  Ayurveda: "Ayurveda",
  Chores: "Daily Chores",
  Fitness: "Fitness",
  Wellness: "Wellness",
  Beauty: "Beauty Wellness",
  Hacks: "Life Hacks",
};

const RoutineScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [routines, setRoutines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchRoutines = async (filterKey: string) => {
    try {
      setIsLoading(true);
      const backendCategory = FILTER_MAP[filterKey];
      const result = await getRoutineList(backendCategory);

      if (result && result.success && Array.isArray(result.data)) {
        const heights = [250, 280, 220, 270, 230, 240];

        const processed = result.data.map((item: any) => ({
          ...item,
          title: item.name, // API returns 'name'
          height: heights[Math.floor(Math.random() * heights.length)],
          image: item.image ? { uri: item.image } : null,
        }));

        setRoutines(processed);
      } else {
        console.error("Routine API error or invalid data:", result);
        setRoutines([]);
      }
    } catch (err) {
      console.log("Routine API error", err);
      setRoutines([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines("All");
  }, []);

  const handleFilterPress = (label: string) => {
    setSelectedFilter(label);
    fetchRoutines(label);
  };

  const handleItemClick = (item: any) => {
    router.push({
      pathname: "/(auth)/toolsScreen/ContentDetailsScreen",
      params: { id: item.id, type: "routine" },
    });
  };

  /** ── Header *inside* FlatList so everything scrolls together ── */
  const renderListHeader = () => (
    <View>
      <ToolScreenHeader
        title="Routine Plan"
        subtitle="Learn the best routine to thrive."
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
          data={routines}
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
              height={item.height}
              tag={item.category}
              title={item.title} // optional, if you want text
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
      paddingTop: spacing.md, // 👈 ensures cards always start close under chips
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

export default RoutineScreen;
