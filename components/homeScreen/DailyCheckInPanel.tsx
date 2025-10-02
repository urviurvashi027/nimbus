// components/homeScreen/DailyCheckInPanel.tsx
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  Platform,
  UIManager,
  Easing,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import DailyCheckInCard from "@/components/homeScreen/component/DailyCheckInCard";
import ThemeContext from "@/context/ThemeContext";
import { useRouter } from "expo-router";

const mockData = [
  {
    name: "Water",
    goalQuantity: 10,
    completedQuantity: 4,
    unit: "glass",
    icon: "💧",
    color: "#A259FF",
    route: "/(auth)/dailyCheckIn/WaterCheckIn",
  },
  {
    name: "Sleep",
    goalQuantity: 8,
    completedQuantity: 5,
    unit: "hours",
    icon: "😴",
    color: "#4CAF50",
    route: "/(auth)/dailyCheckIn/WaterCheckIn",
  },
  {
    name: "Meditation",
    goalQuantity: 20,
    completedQuantity: 15,
    unit: "min",
    icon: "🧘",
    color: "#00BCD4",
    route: "/(auth)/dailyCheckIn/WaterCheckIn",
  },
  {
    name: "Reading",
    goalQuantity: 30,
    completedQuantity: 10,
    unit: "min",
    icon: "📚",
    color: "#9C27B0",
    route: "/(auth)/dailyCheckIn/WaterCheckIn",
  },
];

const DailyCheckInPanel = () => {
  const [data, setData] = useState(mockData);
  const [expanded, setExpanded] = useState(true);
  const rotateAnim = React.useRef(new Animated.Value(expanded ? 1 : 0)).current;

  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const router = useRouter();

  // Enable LayoutAnimation on Android
  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    // rotate caret animation
    Animated.timing(rotateAnim, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Layout animation for show/hide
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [expanded, rotateAnim]);

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

  // caret rotation interpolation: 0 -> 0deg, 1 -> 180deg
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const completedCount = data.filter(
    (d) => d.completedQuantity >= d.goalQuantity
  ).length;

  return (
    <View style={styles.container}>
      {/* Header - tappable to toggle */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setExpanded((v) => !v);
        }}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>Daily check-in</Text>

          {/* small space between title and caret */}
          <Animated.View
            style={[styles.caretContainer, { transform: [{ rotate }] }]}
          >
            <Text style={styles.caret}>⌄</Text>
          </Animated.View>
        </View>

        {/* Count pill always visible */}
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {completedCount}/{data.length}
          </Text>
        </View>
      </TouchableOpacity>

      {/* <View style={styles.header}>
        <Text style={styles.title}>Daily check-in</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>
            {data.filter((d) => d.completedQuantity >= d.goalQuantity).length}/
            {data.length}
          </Text>
        </View>
      </View> */}

      {/* Horizontal scroll list */}

      {expanded && (
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
                onPress={() => router.push({ pathname: item.route as any })}
                // onPress={() => router.push(item.route)}
                onIncrement={() => updateQuantity(index, 1)}
                onDecrement={() => updateQuantity(index, -1)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styling = (newTheme: any) =>
  StyleSheet.create({
    container: {
      paddingBottom: 10,
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
      paddingBottom: 8,
    },

    // caret styles (simple text caret to avoid extra icon package)
    caretContainer: {
      marginLeft: 8,
      width: 20,
      height: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    caret: {
      fontSize: 16,
      color: newTheme.textSecondary,
      // rotate is handled by Animated.View
    },
  });

export default DailyCheckInPanel;
