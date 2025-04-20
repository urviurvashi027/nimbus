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
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";

const filters = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Protein",
  "Detox Water",
  "Soup",
  "Dessert",
];

const data = [
  {
    id: "1",
    tag: "Breakfast",
    name: "Pea Poha",
    height: 250,
    image: require("../../../../assets/images/recipe/1.png"),
  },
  {
    id: "2",
    tag: "Breakfast",
    name: "Avacado Toast",
    height: 280,
    image: require("../../../../assets/images/recipe/2.png"),
  },
  {
    id: "3",
    tag: "Lunch",
    name: "Mexion Bowl",
    height: 220,
    image: require("../../../../assets/images/recipe/3.png"),
  },
  {
    id: "4",
    tag: "Lunch",
    name: "Thai Curry",
    height: 270,
    image: require("../../../../assets/images/recipe/5.png"),
  },
  {
    id: "5",
    tag: "Lunch",
    name: "Chicken Curry",
    height: 230,
    image: require("../../../../assets/images/recipe/6.png"),
  },
  {
    id: "6",
    tag: "Detox Water",
    name: "Chia Seed",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "7",
    tag: "Detox Water",
    name: "Chia Seed",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "8",
    tag: "Detox Water",
    name: "Alkaline Water",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "9",
    tag: "Detox Water",
    name: "Ginger Water",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "10",
    tag: "Protein",
    name: "Black Gram Salad",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "11",
    tag: "Protein",
    name: "Moong Dal Salad",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "12",
    tag: "Soup",
    name: "Moringa Soup",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "13",
    tag: "Soup",
    name: "TBC",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
  {
    id: "14",
    tag: "dinner",
    height: 240,
    name: "Barley Khichdi",
    image: require("../../../../assets/images/recipe/7.png"),
  },
];

const RecipeScreen = () => {
  const [selected, setSelected] = useState("All");
  const [filteredData, setFilteredData] = useState(data);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  const handleFilter = (filter: any) => {
    console.log("coming here", "handleFilter", filter);
    setSelected(filter);
    if (filter === "All") {
      setFilteredData(data);
    } else {
      const updatedData = data.filter((item) => item.tag === filter);
      console.log(updatedData, "updatedData");
      setFilteredData(updatedData);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleItemClick = (item: any) => {
    console.log("Item Clciked", item);
    router.push({
      pathname: "/(auth)/Tools/Details/Details",
      params: { id: item.id, type: "recipe" },
    });
    // router.push("/(auth)/Tools/Details/Details");
  };

  //  useEffect(() => {
  //    setFilteredData()
  //  }, []);

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

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: { flex: 1 },
    backButton: {
      marginTop: 50,
      marginLeft: 10,
      marginBottom: 10,
    },
    emptyText: {
      textAlign: "center",
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
      marginTop: 20,
    },
    header: {
      paddingHorizontal: 20,
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
      paddingBottom: 10,
      paddingLeft: 20,
    },
  });

export default RecipeScreen;
