import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { HabitItemProps } from "./HabitList";
import DeleteHabitModal from "../modal/deleteHabitModal";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { deleteHabit } from "@/service/habitService";
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";

type ThemeKey = "basic" | "light" | "dark";

const SwipeableItem: React.FC<HabitItemProps> = ({ name, time, id, emoji }) => {
  const [showHabitActionModal, setshowHabitActionModal] = useState(false);
  const translateY = useSharedValue(0);

  const navigation = useNavigation();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const LeftSwipeActions = () => {
    return (
      <View
        style={{
          backgroundColor: themeColors[theme].background,
          justifyContent: "center",
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: themeColors.basic.danger,
            paddingHorizontal: 10,
            fontWeight: "600",
            padding: 20,
          }}
        >
          <Ionicons name="trash-bin-outline" size={24} />
        </Text>
      </View>
    );
  };
  const rightSwipeActions = () => {
    return (
      <View
        style={{
          backgroundColor: themeColors[theme].background,
          justifyContent: "center",
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: themeColors.basic.success,
            paddingHorizontal: 10,
            fontWeight: "600",
            padding: 20,
          }}
        >
          <Ionicons name="checkmark-done" size={24} />
        </Text>
      </View>
    );
  };

  const deleteHabitClick = async () => {
    // console.log(`delete is confirm for the id : ${id}`);
    // const result = await deleteHabit({ id });
  };

  const swipeFromLeftOpen = () => {
    // setshowHabitActionModal(true);
    // alert("Swipe from left");
  };
  const swipeFromRightOpen = () => {
    // alert("Swipe from right");
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <>
      <Swipeable
        renderLeftActions={LeftSwipeActions}
        renderRightActions={rightSwipeActions}
        onSwipeableOpen={(direction: string) => {
          console.log(direction); // "left" | "right"
          direction === "left" ? swipeFromLeftOpen() : swipeFromRightOpen();
        }}
      >
        {/* <Animated.View style={[styles.container, animatedStyle]}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.taskName}>{name}</Text>
            <Text style={styles.taskTime}>{time}</Text>
          </View>
        </Animated.View> */}

        <View style={styles.itemContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.taskName}>{name}</Text>
            <Text style={styles.taskTime}>{time}</Text>
          </View>
        </View>
      </Swipeable>

      {/* Task Type Modal */}
      <DeleteHabitModal
        visible={showHabitActionModal}
        onClose={() => setshowHabitActionModal(false)}
        onDelete={deleteHabitClick}
        // onSelect={(type) => setTaskType(type)}
      />
    </>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFE4E1", // Light pink color
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    emoji: {
      fontSize: 24,
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
    },
    taskName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    taskTime: {
      fontSize: 14,
      color: "#666",
      marginTop: 2,
    },
    taskDone: {
      textDecorationLine: "line-through",
      color: "#999",
    },
    itemContainer: {
      flexDirection: "row",
      backgroundColor: themeColors[theme].primaryColor,
      padding: 15,
      borderRadius: 12,
    },
  });

export default SwipeableItem;
