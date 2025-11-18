import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FilterPill from "./component/FilterPill";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import ProductivityOverview from "./ProductivityOverview";
import MentalHealthOverview from "./MentalHealthOverview";
import PhysicalHealthOverview from "./PhysicalHealthOverview";
import AllStatsOverview from "./AllStatsOverview";

const dateFilters = ["D", "W", "M", "3M", "6M", "Y"];
const tagFilters = [
  { key: "all", label: "All" },
  { key: "productivity", label: "Productivity" },
  { key: "mental", label: "Mental Health" },
  { key: "physical", label: "Physical Health" },
];

export default function StatsScreen() {
  const [selectedDate, setSelectedDate] = useState("W");
  const [selectedTag, setSelectedTag] = useState(tagFilters[0]);
  const navigation = useNavigation();

  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const renderTagContent = () => {
    switch (selectedTag.key) {
      case "productivity":
        return <ProductivityOverview />;

      case "mental":
        return <MentalHealthOverview />;

      case "physical":
        return <PhysicalHealthOverview />;

      case "all":
      default:
        return <AllStatsOverview />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 10 }}>
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
      </View>

      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{ marginTop: 10 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Overview</Text>
          <Text style={styles.subtitle}>Immense Yourself in true nature.</Text>
        </View>

        {/* Date Segmented Control */}
        <View style={styles.dateRow}>
          {dateFilters.map((filter) => (
            <FilterPill
              key={filter}
              label={filter}
              selected={selectedDate === filter}
              onPress={() => setSelectedDate(filter)}
              type="date"
            />
          ))}
        </View>

        {/* Tag Filters (scrollable pills) */}
        <View style={styles.tagFilterContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tagFilters}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <FilterPill
                label={item.label}
                selected={selectedTag.key === item.key}
                onPress={() => setSelectedTag(item)}
                type="tag"
              />
            )}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>

        {renderTagContent()}
      </SafeAreaView>
    </View>
  );
}

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: newTheme.textPrimary,
      // marginVertical: 16,
    },
    dateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      backgroundColor: newTheme.surface,
      borderRadius: 24,
      // padding: 4,
    },
    tagFilterContainer: {
      marginBottom: 20,
    },
    chartContainer: {
      backgroundColor: newTheme.accent,
      borderRadius: 20,
      padding: 16,
      marginBottom: 20,
      alignItems: "center",
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: newTheme.background,
    },
    chartValue: {
      fontSize: 28,
      fontWeight: "700",
      color: newTheme.background,
      marginBottom: 8,
    },
    dayLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: newTheme.background,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
    },
    backButton: {
      // marginTop: 50,
      // marginBottom: 10,
    },
    itemTitle: {
      fontSize: 16,
      color: newTheme.textPrimary,
      fontWeight: "bold",
    },
    header: {
      // paddingTop: 10,
      // marginBottom: 20,
    },
    // title: {
    //   fontSize: 24,
    //   color: newTheme.textPrimary,
    //   fontWeight: "bold",
    // },
    subtitle: {
      color: newTheme.textSecondary,
      fontSize: 14,
      marginTop: 4,
      marginBottom: 20,
    },
  });
