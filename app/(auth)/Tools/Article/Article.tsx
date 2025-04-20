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
  "Herbs",
  "Mindfulness",
  "Fitness",
  "Food",
  "Productivity",
];

const data = [
  {
    id: "1",
    // title: "Restart your life in 50 days!",
    tag: "Fitness",
    height: 250,
    image: require("../../../../assets/images/article/1.png"),
  },
  {
    id: "2",
    // title: "Less Awkward First Date Tricks",
    tag: "Mindfulness",
    height: 280,
    image: require("../../../../assets/images/article/2.png"),
  },
  {
    id: "3",
    // title: "Relaxing During Workdays: ADHD",
    tag: "Fitness",
    height: 220,
    image: require("../../../../assets/images/article/3.png"),
  },
  {
    id: "4",
    // title: "Pro article for Managing Anxiety",
    tag: "Food",
    height: 270,
    image: require("../../../../assets/images/article/5.png"),
  },
  {
    id: "5",
    // title: "Tidy Desk, Clear Mind",
    tag: "Productivity",
    height: 230,
    image: require("../../../../assets/images/article/6.png"),
  },
  {
    id: "6",
    // title: "Must-Have Back-to-School Essentials",
    tag: "Productivity",
    height: 240,
    image: require("../../../../assets/images/article/7.png"),
  },
];

const ArticleScreen = () => {
  const [selected, setSelected] = useState("All");
  const [filteredData, setFilteredData] = useState(data);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  const handleFilter = (filter: any) => {
    // console.log("coming here", "handleFilter", filter);
    setSelected(filter);
    if (filter === "All") {
      setFilteredData(data);
    } else {
      const updatedData = data.filter((item) => item.tag === filter);
      // console.log(updatedData, "updatedData");
      setFilteredData(updatedData);
    }
  };

  const handleItemClick = (item: any) => {
    // console.log("Item Clciked", item);
    router.push({
      pathname: "/(auth)/Tools/Details/Details",
      params: { id: item.id, type: "article" },
    });
    // router.push("/(auth)/Tools/Details/Details");
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
                // onPress={() => console.log(item)}
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
    container: { flex: 1, paddingHorizontal: 16 },
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
      paddingBottom: 50,
      paddingLeft: 20,
    },
  });

export default ArticleScreen;
