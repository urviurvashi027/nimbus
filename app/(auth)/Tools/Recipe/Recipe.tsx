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
import { ScreenView } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
// import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { getRecipeList } from "@/services/toolService";

const filters = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Beverages",
  "Snacks",
  "Soup",
  "Dessert",
  "Sauce",
];

type FilterCategory =
  | "Breakfast"
  | "Lunch"
  | "Dinner"
  | "Beverages"
  | "Snacks"
  | "Soup"
  | "Dessert"
  | "Sauce";

const RecipeScreen = () => {
  const [selected, setSelected] = useState("All");
  const [recipeList, setRecipeList] = useState<any[] | undefined>();
  // const [filteredData, setFilteredData] = useState(data);
  const [filteredData, setFilteredData] = useState<any[] | undefined>();

  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleItemClick = (item: any) => {
    console.log("Item Clciked", item);
    router.push({
      pathname: "/(auth)/Tools/Details/ContentDetailsScreen",
      // pathname: "/(auth)/Tools/Details/Details",
      params: { id: item.id, type: "recipe" },
    });
  };

  const getRecipeListData = async (category?: string) => {
    const tags = [
      "All",
      "Breakfast",
      "Lunch",
      "Dinner",
      "Bevrages",
      "Snacks",
      "Soup",
      "Dessert",
      "Sauce",
    ];

    const heights = [250, 280, 220, 270, 230, 240];

    // need to add filters functionality and category param changes
    try {
      const result = await getRecipeList(category);
      // Check if 'result' and 'result.data' exist and is an array
      if (result && Array.isArray(result)) {
        const processedRecipes = result.map((recipe: any) => {
          // Assign a random tag from the 'tags' array
          const randomTag = tags[Math.floor(Math.random() * tags.length)];

          // Assign a random height from the 'heights' array
          const randomHeight =
            heights[Math.floor(Math.random() * heights.length)];

          // Return a new object with the original properties plus the new ones
          return {
            ...recipe, // Spread operator to keep original properties
            height: randomHeight,
            image: {
              uri: recipe.image,
            },
          };
        });

        // console.log(processedArticles, "processedArticles srticle");
        setFilteredData(processedRecipes);
        setRecipeList(processedRecipes);
      } else {
        // Handle the case where the data is not in the expected format
        console.error("API response data is not an array:", result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getRecipeListData();
  }, []);

  //  const handleFilter = (filter: any) => {
  //    console.log("coming here", "handleFilter", filter);
  //    setSelected(filter);
  //    if (filter === "All") {
  //      setFilteredData(data);
  //    } else {
  //      const updatedData = data.filter((item) => item.tag === filter);
  //      console.log(updatedData, "updatedData");
  //      setFilteredData(updatedData);
  //    }
  //  };

  const handleFilter = (filter: any) => {
    console.log(filter);
    setSelected(filter);
    if (filter === "All") {
      getRecipeListData();
    } else {
      const filterMap = {
        Breakfast: "breakfast",
        Lunch: "lunch",
        Dinner: "dinner",
        Beverages: "bevrages",
        Snacks: "snacks",
        Soup: "soup",
        Dessert: "dessert",
        Sauce: "sauce",
      };

      const filterKey = filter as FilterCategory;

      getRecipeListData(filterMap[filterKey]);
    }
  };

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
            <Text style={styles.title}>Recipe</Text>
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
              />
            ))}
          </ScrollView>

          <FlatList
            data={filteredData}
            numColumns={2}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} // ✅ Ensures it fills space
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No Recipe found</Text>
            )} // ✅ Prevents collapsing
            // contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <RoutineCard
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
      // marginLeft: 10,
      marginBottom: 10,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: theme.textSecondary,
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
      paddingBottom: 10,
      paddingLeft: 20,
    },
  });

export default RecipeScreen;
