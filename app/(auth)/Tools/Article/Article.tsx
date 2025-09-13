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
import { router, useNavigation } from "expo-router";
import RoutineCard from "../../../../components/tools/RoutineCard";
import AnimatedChip from "@/components/tools/common/AnimatedChips";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { getArticleList } from "@/services/toolService";

const filters = [
  "All",
  "Herbs",
  "Mindfulness",
  "Meditation",
  "Epigenetics",
  "Neuroplasticity",
];

// Define the possible keys for your map
type FilterCategory =
  | "Herbs"
  | "Mindfulness"
  | "Meditation"
  | "Epigenetics"
  | "Neuroplasticity";

const ArticleScreen = () => {
  const [selected, setSelected] = useState("All");
  // const [filteredData, setFilteredData] = useState(data);

  const [articleList, setArticleList] = useState<any[] | undefined>();

  const [filteredData, setFilteredData] = useState<any[] | undefined>();

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const navigation = useNavigation();

  const getArticleListData = async (category?: string) => {
    const tags = [
      "All",
      "Herbs",
      "Mindfulness",
      "Meditation",
      "Epigenetics",
      "Neuroplasticity",
    ];

    const heights = [250, 280, 220, 270, 230, 240];

    // need to add filters functionality and category param changes
    try {
      const result = await getArticleList(category);
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
            category: randomTag,
            height: randomHeight,
            image: {
              uri: article.image,
            },
          };
        });

        // console.log(processedArticles, "processedArticles srticle");
        setFilteredData(processedArticles);
        setArticleList(processedArticles);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getArticleListData();
  }, []);

  const refreshData = () => {
    getArticleListData();
  };

  const handleFilter = (filter: any) => {
    console.log(filter);
    setSelected(filter);
    if (filter === "All") {
      getArticleListData();
    } else {
      const filterMap = {
        Herbs: "healingHerbs",
        Mindfulness: "mindfullness",
        Meditation: "meditation",
        Epigenetics: "epigenetics",
        Neuroplasticity: "neuroplasticity",
      };

      const filterKey = filter as FilterCategory;

      getArticleListData(filterMap[filterKey]);
    }
  };

  const handleItemClick = (item: any) => {
    // router.push("/(auth)/Tools/Details/ContentDetailsScreen")
    router.push({
      // pathname: "/(auth)/Tools/Details/Details",
      pathname: "/(auth)/Tools/Details/ContentDetailsScreen",
      params: { id: item.id, type: "article" },
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
            color={newTheme.textSecondary}
          />
        </TouchableOpacity>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <Text style={styles.title}>Article</Text>
            <Text style={styles.subtitle}>Learn to thrive</Text>
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
                onPress={() => handleFilter(f)}
                // onPress={() => setSelected(f)}
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
              <Text style={styles.emptyText}>No Article found</Text>
            )} // ✅ Prevents collapsing
            // contentContainerStyle={{ paddingBottom: 100 }}
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

const styling = (theme: any) =>
  StyleSheet.create({
    container: { flex: 1 },
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
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
    chipsContainer: {
      paddingTop: 20,
      paddingBottom: 50,
      paddingLeft: 20,
    },
  });

export default ArticleScreen;
