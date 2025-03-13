import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useRef, useState } from "react";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
// import { HabitItemProps } from "./HabitList";
import DeleteHabitModal from "../modal/deleteHabitModal";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { deleteHabit } from "@/services/habitService";
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { Ionicons } from "@expo/vector-icons";
import { HabitItem } from "@/types/habitTypes";
import { ThemeKey } from "../Themed";
import ActivityIndicatorModal from "../common/ActivityIndicatorModal";

type SwipeableItemProps = {
  item: HabitItem;
  habitItemClick: (id: any) => void;
  habitItemDeleted: (id: any) => void;
};

const SwipeableItem: React.FC<SwipeableItemProps> = (
  props: SwipeableItemProps
) => {
  const { name, id, ...rest } = props.item;
  const { habitItemClick, habitItemDeleted } = props;
  const [showHabitActionModal, setshowHabitActionModal] = useState(false);
  const translateY = useSharedValue(0);
  // ✅ Create a ref for Swipeable
  // const swipeableRef = useRef<Swipeable>(null as any);

  //   // ✅ Function to close swipe manually
  //   const closeSwipe = () => {
  //     swipeableRef.current?.close();
  //   };

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
    console.log("Delete habit click", id);
    habitItemDeleted(id);
    // const result = await deleteHabit({ id });
    //   setIsLoading(true);
    //   try {
    //     const result = await habitItemDeleted(data);
    //     if (result?.success) {
    //       setIsLoading(false);
    //       setShowSuccess(true);
    //       router.replace("/(auth)/(tabs)"); // Navigate on success
    //     }
    //   } catch (error: any) {
    //     setIsLoading(false);
    //   }
  };

  const markHabitDone = () => {
    console.log("OK Done Pressed");
  };

  const swipeFromLeftOpen = () => {
    // setshowHabitActionModal(true);
    // alert("Swipe from left");

    Alert.alert("Mark Habit Complete", "Mark this habit as done !!!", [
      // {
      //   text: "Ask me later",
      //   onPress: () => console.log("Ask me later pressed"),
      // },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Done", onPress: markHabitDone },
    ]);
  };

  const swipeFromRightOpen = () => {
    // alert("Swipe from right");
    console.log("swipeFromRightOpen");
    // setshowHabitActionModal(true);

    Alert.alert("Delete Habit", "Are you sure to delete this?", [
      // {
      //   text: "Ask me later",
      //   onPress: () => console.log("Ask me later pressed"),
      // },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Delete", onPress: deleteHabitClick },
    ]);
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
          direction === "left" ? swipeFromLeftOpen() : swipeFromRightOpen();
        }}
      >
        <TouchableOpacity onPress={() => habitItemClick(id)}>
          <View style={styles.itemContainer}>
            {/* <Text style={styles.emoji}>{emoji}</Text> */}
            <View style={styles.textContainer}>
              <Text style={styles.taskName}>{name}</Text>
              <Text style={styles.taskTime}>{rest.reminder_time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>

      {/* Task Type Modal */}
      <DeleteHabitModal
        visible={showHabitActionModal}
        header="Delete Habit"
        title="Are you sure !!"
        content="Do you want to delete this task?"
        primaryBtnText="Yes"
        secondaryBtnText="Cancel"
        secondaryBtnClick={() => setshowHabitActionModal(false)}
        primaryBtnClick={deleteHabitClick}
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
