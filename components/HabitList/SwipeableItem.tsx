// import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import React, { useContext, useRef, useState } from "react";
// import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
// // import { HabitItemProps } from "./HabitList";
// import DeleteHabitModal from "../modal/deleteHabitModal";
// import Animated, {
//   useAnimatedStyle,
//   useSharedValue,
//   withSpring,
//   runOnJS,
// } from "react-native-reanimated";
// import { deleteHabit, markHabitDone } from "@/services/habitService";
// import { useNavigation } from "expo-router";
// import ThemeContext from "@/context/ThemeContext";
// import { themeColors } from "@/constant/theme/Colors";
// import { Ionicons } from "@expo/vector-icons";
// import { HabitDoneRequest, HabitItem } from "@/types/habitTypes";
// import { ThemeKey } from "../Themed";
// import ActivityIndicatorModal from "../common/ActivityIndicatorModal";

// type SwipeableItemProps = {
//   item: HabitItem;
//   habitItemClick: (id: any) => void;
//   habitItemDeleted: (id: any) => void;
//   habitDoneClick: (habitDoneRequest: HabitDoneRequest, id: any) => void;
// };

// const SwipeableItem: React.FC<SwipeableItemProps> = (
//   props: SwipeableItemProps
// ) => {
//   const {
//     name,
//     id,
//     last_completed,
//     color,
//     metric_count,
//     metric_unit,
//     ...rest
//   } = props.item;
//   const { habitItemClick, habitItemDeleted, habitDoneClick } = props;
//   const [showHabitActionModal, setshowHabitActionModal] = useState(false);
//   const translateY = useSharedValue(0);
//   // ✅ Create a ref for Swipeable
//   // const swipeableRef = useRef<Swipeable>(null as any);

//   //   // ✅ Function to close swipe manually
//   //   const closeSwipe = () => {
//   //     swipeableRef.current?.close();
//   //   };

//   const navigation = useNavigation();

//   const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

//   const styles = styling(theme);

//   const LeftSwipeActions = () => {
//     return (
//       <View
//         style={{
//           backgroundColor: themeColors[theme].background,
//           justifyContent: "center",
//           borderRadius: 12,
//         }}
//       >
//         <Text
//           style={{
//             color: themeColors.basic.danger,
//             paddingHorizontal: 10,
//             fontWeight: "600",
//             padding: 20,
//           }}
//         >
//           <Ionicons name="trash-bin-outline" size={24} />
//         </Text>
//       </View>
//     );
//   };
//   const rightSwipeActions = () => {
//     return (
//       <View
//         style={{
//           backgroundColor: themeColors[theme].background,
//           justifyContent: "center",
//           borderRadius: 12,
//         }}
//       >
//         <Text
//           style={{
//             color: themeColors.basic.success,
//             paddingHorizontal: 10,
//             fontWeight: "600",
//             padding: 20,
//           }}
//         >
//           <Ionicons name="checkmark-done" size={24} />
//         </Text>
//       </View>
//     );
//   };

//   const deleteHabitClick = async () => {
//     habitItemDeleted(id);
//     // const result = await deleteHabit({ id });
//     //   setIsLoading(true);
//     //   try {
//     //     const result = await habitItemDeleted(data);
//     //     if (result?.success) {
//     //       setIsLoading(false);
//     //       setShowSuccess(true);
//     //       router.replace("/(auth)/(tabs)"); // Navigate on success
//     //     }
//     //   } catch (error: any) {
//     //     setIsLoading(false);
//     //   }
//   };

//   const onHabitDoneClick = () => {
//     const request = {
//       completed: true,
//       actual_count: {
//         count: metric_count,
//         unit: metric_unit,
//       },
//     };
//     habitDoneClick(request, id);
//   };

//   const swipeFromLeftOpen = () => {
//     Alert.alert("Mark Habit Complete", "Mark this habit as done !!!", [
//       {
//         text: "Cancel",
//         onPress: () => console.log("Cancel Pressed"),
//         style: "cancel",
//       },
//       { text: "Done", onPress: onHabitDoneClick },
//     ]);
//   };

//   const swipeFromRightOpen = () => {
//     Alert.alert("Delete Habit", "Are you sure to delete this?", [
//       {
//         text: "Cancel",
//         onPress: () => console.log("Cancel Pressed"),
//         style: "cancel",
//       },
//       { text: "Delete", onPress: deleteHabitClick },
//     ]);
//   };

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));

//   return (
//     <>
//       {!last_completed && (
//         <Swipeable
//           renderLeftActions={LeftSwipeActions}
//           renderRightActions={rightSwipeActions}
//           onSwipeableOpen={(direction: string) => {
//             direction === "left" ? swipeFromLeftOpen() : swipeFromRightOpen();
//           }}
//         >
//           <TouchableOpacity onPress={() => habitItemClick(id)}>
//             <View style={[styles.itemContainer, { backgroundColor: color }]}>
//               {/* <Text style={styles.emoji}>{emoji}</Text> */}
//               <View style={styles.textContainer}>
//                 <Text style={styles.taskName}>{name}</Text>
//                 <Text style={styles.taskTime}>{rest.reminder_time}</Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </Swipeable>
//       )}

//       {last_completed && (
//         <View>
//           <TouchableOpacity onPress={() => habitItemClick(id)}>
//             <View style={[styles.itemContainer, { backgroundColor: color }]}>
//               {/* <View style={styles.itemContainer}> */}
//               {/* <Text style={styles.emoji}>{emoji}</Text> */}
//               <View style={styles.textContainer}>
//                 <Text style={styles.taskName}>{name}</Text>
//                 <Text style={styles.taskTime}>{rest.reminder_time}</Text>
//                 {/* <Ionicons name="checkmark-done" size={24} /> */}
//               </View>
//               <Ionicons
//                 name="checkmark-done"
//                 size={24}
//                 style={styles.checkIcon}
//               />
//             </View>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Task Type Modal */}
//       <DeleteHabitModal
//         visible={showHabitActionModal}
//         header="Delete Habit"
//         title="Are you sure !!"
//         content="Do you want to delete this task?"
//         primaryBtnText="Yes"
//         secondaryBtnText="Cancel"
//         secondaryBtnClick={() => setshowHabitActionModal(false)}
//         primaryBtnClick={deleteHabitClick}
//         // onSelect={(type) => setTaskType(type)}
//       />
//     </>
//   );
// };

// const styling = (theme: ThemeKey) =>
//   StyleSheet.create({
//     container: {
//       flexDirection: "row",
//       alignItems: "center",
//       backgroundColor: "#FFE4E1", // Light pink color
//       borderRadius: 10,
//       padding: 10,
//       marginBottom: 10,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 2,
//       elevation: 2,
//     },
//     emoji: {
//       fontSize: 24,
//       marginRight: 10,
//     },
//     textContainer: {
//       flex: 1,
//     },
//     taskName: {
//       fontSize: 16,
//       fontWeight: "bold",
//       color: "#333",
//     },
//     taskTime: {
//       fontSize: 14,
//       color: "#666",
//       marginTop: 2,
//     },
//     taskDone: {
//       textDecorationLine: "line-through",
//       color: "#999",
//     },
//     itemContainer: {
//       flexDirection: "row",
//       // backgroundColor: themeColors[theme].primaryColor,
//       padding: 15,
//       borderRadius: 12,
//     },
//     checkIcon: {
//       color: "green",
//     },
//   });

// export default SwipeableItem;
