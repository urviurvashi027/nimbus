// RoutineScreen.tsx
import React, { useContext, useEffect, useState } from "react";
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
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import RoutineCard from "@/components/tools/RoutineCard";
import AnimatedChip from "@/components/tools/common/AnimatedChips";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { getRoutineList } from "@/services/toolService";
// import ArticleCard from "../../../../components/tools/RoutineCard";

const filters = [
  "All",
  "Fitness",
  "Skincare",
  "Wellness",
  "Parenting",
  "Hacks",
];

// Define the possible keys for your map
type FilterCategory =
  | "Fitness"
  | "Skincare"
  | "Wellness"
  | "Parenting"
  | "Hacks";

const RoutineScreen = () => {
  const [selected, setSelected] = useState("All");
  const [routineList, setRoutineList] = useState<any[] | undefined>();
  const [filteredData, setFilteredData] = useState<any[] | undefined>();
  // const [filteredData, setFilteredData] = useState(data);
  const { filter } = useLocalSearchParams();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  const getRoutineListData = async (category?: string) => {
    const tags = [
      "All",
      "Skincare",
      "Wellness",
      "Parenting",
      "Fitness",
      "Hacks",
    ];
    const heights = [250, 280, 220, 270, 230, 240];

    // need to add filters functionality and category param changes
    try {
      const result = await getRoutineList(category);
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedArticles = result.map((article: any) => {
          // Assign a random tag from the 'tags' array
          const randomTag = tags[Math.floor(Math.random() * tags.length)];

          // Assign a random height from the 'heights' array
          const randomHeight =
            heights[Math.floor(Math.random() * heights.length)];

          // Return a new object with the original properties plus the new ones
          return {
            ...article, // Spread operator to keep original properties
            // category: randomTag,
            height: randomHeight,
            image: {
              uri: article.image,
            },
          };
        });

        // console.log(processedArticles, "processedArticles srticle");
        setFilteredData(processedArticles);
        setRoutineList(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getRoutineListData();
  }, []);

  const handleFilter = (filter: any) => {
    console.log(filter);
    setSelected(filter);
    if (filter === "All") {
      getRoutineListData();
    } else {
      const tags = [
        "All",
        "Skincare",
        "Wellness",
        "Parenting",
        "Fitness",
        "Hacks",
      ];
      const filterMap = {
        Skincare: "skincare",
        Wellness: "wellness",
        Parenting: "parenting",
        Fitness: "fitness",
        Hacks: "hacks",
      };

      const filterKey = filter as FilterCategory;

      getRoutineListData(filterMap[filterKey]);
    }
  };

  const handleItemClick = (item: any) => {
    router.push({
      pathname: "/(auth)/Tools/Details/Details",
      params: { id: item.id, type: "routine" },
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={themeColors[theme].text}
          />
        </TouchableOpacity>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Routine Plan</Text>
            <Text style={styles.subtitle}>
              Learn the best routine to thrive
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {filters.map((f) => (
              <AnimatedChip
                key={f}
                label={f}
                selected={selected === f}
                // onPress={() => setSelected(f)}
                onPress={() => handleFilter(f)}
              />
            ))}
          </ScrollView>

          <FlatList
            data={filteredData}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No Rotuine found</Text>
            )} // ✅ Prevents collapsing
            renderItem={({ item }) => (
              <RoutineCard
                // title={item.title}
                // subtitle={item.subtitle}
                image={item.image}
                tag={item.tag}
                height={item.height}
                onPress={() => handleItemClick(item)}
              />
            )}
          />
        </SafeAreaView>
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      // paddingHorizontal: 16
    },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
      marginTop: 20,
    },
    header: {
      // paddingHorizontal: 20,
      paddingTop: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 14,
      color: "#999",
      marginTop: 4,
    },
    chipsContainer: {
      paddingTop: 20,
      paddingBottom: 50,
      // paddingLeft: 20,
    },
  });

export default RoutineScreen;
