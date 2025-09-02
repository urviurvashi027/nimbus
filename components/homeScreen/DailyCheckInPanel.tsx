// components/homeScreen/DailyCheckInPanel.tsx
import React, { useContext, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import DailyCheckInCard from "@/components/homeScreen/component/DailyCheckInCard";
import ThemeContext from "@/context/ThemeContext";

const mockData = [
  {
    name: "Water",
    goalQuantity: 10,
    completedQuantity: 4,
    unit: "glass",
    icon: "💧",
    color: "#A259FF",
  },
  {
    name: "Sleep",
    goalQuantity: 8,
    completedQuantity: 5,
    unit: "hours",
    icon: "😴",
    color: "#4CAF50",
  },
  {
    name: "Meditation",
    goalQuantity: 20,
    completedQuantity: 15,
    unit: "min",
    icon: "🧘",
    color: "#00BCD4",
  },
  {
    name: "Reading",
    goalQuantity: 30,
    completedQuantity: 10,
    unit: "min",
    icon: "📚",
    color: "#9C27B0",
  },
];

const DailyCheckInPanel = () => {
  const [data, setData] = useState(mockData);

  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  //   console.log(data, "data here");

  const updateQuantity = (index: number, delta: number) => {
    setData((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              completedQuantity: Math.max(
                0,
                Math.min(item.goalQuantity, item.completedQuantity + delta)
              ),
            }
          : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily check-in</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {data.filter((d) => d.completedQuantity >= d.goalQuantity).length}/
            {data.length}
          </Text>
        </View>
      </View>

      {/* Horizontal scroll list */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.grid}>
          {data.map((item, index) => (
            <DailyCheckInCard
              key={item.name}
              {...item}
              onIncrement={() => updateQuantity(index, 1)}
              onDecrement={() => updateQuantity(index, -1)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      paddingVertical: 30,
      backgroundColor: newTheme.background,
    },
    scrollContent: {
      paddingRight: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // backgroundColor: "red",
      marginBottom: 16,
    },
    title: { fontSize: 18, fontWeight: "600", color: "white" },
    pill: {
      backgroundColor: newTheme.surface,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 6,
    },
    pillText: { color: newTheme.textSecondary, fontWeight: "500" },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
  });

export default DailyCheckInPanel;
