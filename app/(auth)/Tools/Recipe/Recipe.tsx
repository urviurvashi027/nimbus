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
  "Project50",
  "Valentine",
  "Relax",
  "Focus",
  "Productivity",
];

const data = [
  {
    id: "1",
    // title: "Restart your life in 50 days!",
    tag: "Workout",
    height: 250,
    image: require("../../../../assets/images/recipe/1.png"),
  },
  {
    id: "2",
    // title: "Less Awkward First Date Tricks",
    tag: "Skincare",
    height: 280,
    image: require("../../../../assets/images/recipe/2.png"),
  },
  {
    id: "3",
    // title: "Relaxing During Workdays: ADHD",
    tag: "New",
    height: 220,
    image: require("../../../../assets/images/recipe/3.png"),
  },
  {
    id: "4",
    // title: "Pro recipe for Managing Anxiety",
    tag: "Skincare",
    height: 270,
    image: require("../../../../assets/images/recipe/5.png"),
  },
  {
    id: "5",
    // title: "Tidy Desk, Clear Mind",
    tag: "New",
    height: 230,
    image: require("../../../../assets/images/recipe/6.png"),
  },
  {
    id: "6",
    // title: "Must-Have Back-to-School Essentials",
    tag: "food",
    height: 240,
    image: require("../../../../assets/images/recipe/7.png"),
  },
];

const RecipeScreen = () => {
  const [selected, setSelected] = useState("All");

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

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
                onPress={() => setSelected(f)}
              />
            ))}
          </ScrollView>

          <FlatList
            data={data}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <RoutineCard
                // title={item.title}
                // subtitle={item.subtitle}
                image={item.image}
                tag={item.tag}
                height={item.height}
                onPress={() => console.log(item)}
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

export default RecipeScreen;
