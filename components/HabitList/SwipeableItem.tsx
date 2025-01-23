import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
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

const SwipeableItem: React.FC<HabitItemProps> = ({ name, time, id, emoji }) => {
  const [showHabitActionModal, setshowHabitActionModal] = useState(false);
  const translateY = useSharedValue(0);

  const LeftSwipeActions = () => {
    return (
      <View
        style={{
          // flex: 1,
          backgroundColor: "#fa8973",
          justifyContent: "center",
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "#fff",
            paddingHorizontal: 10,
            fontWeight: "600",
            padding: 20,
          }}
        >
          Delete
        </Text>
      </View>
    );
  };
  const rightSwipeActions = () => {
    return (
      <View
        style={{
          backgroundColor: "#a4fcb6",
          justifyContent: "center",
          borderRadius: 12,
          // alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            color: "#fff",
            paddingHorizontal: 10,
            fontWeight: "600",
            padding: 20,
          }}
        >
          Done
        </Text>
      </View>
    );
  };

  const deleteHabitClick = async () => {
    // console.log(`delete is confirm for the id : ${id}`);
    // const result = await deleteHabit({ id });
  };

  const swipeFromLeftOpen = () => {
    setshowHabitActionModal(true);
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

      {/* <TaskModalDuration
        visible={showHabitActionModal}
        onClose={() => setshowHabitActionModal(false)}
        onSave={deleteHabitClick}
        // onSave={(selectedDuration: any) => setDuration(selectedDuration)}
      /> */}

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

const styles = StyleSheet.create({
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
    backgroundColor: "#98faf5",
    padding: 15,
    borderRadius: 12,
  },
});

export default SwipeableItem;
