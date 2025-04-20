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
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
// import ArticleCard from "../../../../components/tools/RoutineCard";

const filters = [
  "All",
  "Fitness",
  "Skincare",
  "Relax",
  "Mindfulness",
  "Home Chores",
  "Hacks",
];

const data = [
  {
    id: "1",
    // title: "Restart your life in 50 days!",
    tag: "Fitness",
    height: 250,
    image: require("../../../../assets/images/routine/1.png"),
  },
  {
    id: "2",
    // title: "Less Awkward First Date Tricks",
    tag: "Skincare",
    height: 280,
    image: require("../../../../assets/images/routine/2.png"),
  },
  {
    id: "3",
    // title: "Relaxing During Workdays: ADHD",
    tag: "Mindfulness",
    height: 220,
    image: require("../../../../assets/images/routine/3.png"),
  },
  {
    id: "4",
    // title: "Pro Routine for Managing Anxiety",
    tag: "Mindfulness",
    height: 270,
    image: require("../../../../assets/images/routine/5.png"),
  },
  {
    id: "5",
    // title: "Tidy Desk, Clear Mind",
    tag: "Fitness",
    height: 230,
    image: require("../../../../assets/images/routine/6.png"),
  },
  {
    id: "6",
    // title: "Must-Have Back-to-School Essentials",
    tag: "Fitness",
    height: 240,
    image: require("../../../../assets/images/routine/7.png"),
  },
];

const RoutineScreen = () => {
  const [selected, setSelected] = useState("All");
  const [filteredData, setFilteredData] = useState(data);
  const { filter } = useLocalSearchParams();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  useEffect(() => {
    console.log(filter, "filter");
    if (filter) {
      const type = Array.isArray(filter) ? filter[0] : filter; // ✅ Ensure id is a string
      console.log(type, "filter type");
      handleFilter(filter);
    }
  }, [filter]);

  const handleFilter = (filter: any) => {
    setSelected(filter);
    if (filter === "All") {
      setFilteredData(data);
    } else {
      const updatedData = data.filter((item) => item.tag === filter);
      console.log(updatedData, "updatedData");
      setFilteredData(updatedData);
    }
  };

  const handleItemClick = (item: any) => {
    // console.log("Item Clciked", item);
    router.push({
      pathname: "/(auth)/Tools/Details/Details",
      params: { id: item.id, type: "routine" },
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

export default RoutineScreen;
