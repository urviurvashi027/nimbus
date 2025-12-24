// // components/createHabit/Modal/TypeModal.tsx
// import React, { useEffect, useRef } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   Animated,
//   Easing,
//   Platform,
//   TouchableWithoutFeedback,
//   Pressable,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import ThemeContext from "@/context/ThemeContext";

// export type TaskType = {
//   id: number;
//   name: string;
//   description: string;
//   is_global: boolean;
// };

// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   options: TaskType[];
//   selectedId?: number | null;
//   onSelect: (option: TaskType) => void;
//   title?: string;
// };

// export default function TypeModal({
//   visible,
//   onClose,
//   options,
//   selectedId = null,
//   onSelect,
//   title = "Select Habit Types",
// }: Props) {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const { newTheme, spacing } = React.useContext(ThemeContext);

//   useEffect(() => {
//     const toValue = visible ? 1 : 0;
//     Animated.timing(fadeAnim, {
//       toValue,
//       duration: visible ? 230 : 180,
//       easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
//       useNativeDriver: true,
//     }).start();
//   }, [visible, fadeAnim]);

//   const renderItem = ({ item }: { item: TaskType }) => {
//     const isSelected = item.id === selectedId;

//     return (
//       <Pressable
//         onPress={() => onSelect(item)}
//         android_ripple={{ color: "rgba(255,255,255,0.06)" }}
//         style={({ pressed }) => [
//           styles.row,
//           {
//             backgroundColor: newTheme.surface,
//             borderBottomColor: newTheme.divider,
//           },
//           isSelected && {
//             backgroundColor: newTheme.background, // subtle contrast
//           },
//           pressed && {
//             opacity: 0.9,
//             transform: [{ scale: 0.99 }],
//           },
//         ]}
//         accessibilityRole="button"
//         accessibilityState={{ selected: isSelected }}
//         accessibilityLabel={`Select ${item.name}`}
//       >
//         {/* Left: label + optional description */}
//         <View style={styles.rowTextWrap}>
//           <Text
//             style={[styles.labelText, { color: newTheme.textPrimary }]}
//             numberOfLines={1}
//           >
//             {item.name}
//           </Text>
//           {!!item.description && (
//             <Text
//               style={[
//                 styles.descriptionText,
//                 { color: newTheme.textSecondary },
//               ]}
//               numberOfLines={1}
//             >
//               {item.description}
//             </Text>
//           )}
//         </View>

//         {/* Right: check chip */}
//         {isSelected && (
//           <View
//             style={[
//               styles.tickChip,
//               {
//                 borderColor: newTheme.accent,
//                 backgroundColor: "transparent",
//               },
//             ]}
//           >
//             <Ionicons name="checkmark" size={14} color={newTheme.accent} />
//           </View>
//         )}
//       </Pressable>
//     );
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="none"
//       transparent
//       statusBarTranslucent
//       onRequestClose={onClose}
//     >
//       {/* Backdrop */}
//       <TouchableWithoutFeedback onPress={onClose}>
//         <Animated.View
//           style={[
//             styles.backdrop,
//             {
//               backgroundColor: "rgba(0,0,0,0.55)",
//               opacity: fadeAnim,
//             },
//           ]}
//         />
//       </TouchableWithoutFeedback>

//       {/* Card */}
//       <Animated.View
//         pointerEvents={visible ? "auto" : "none"}
//         style={[
//           styles.container,
//           {
//             transform: [
//               {
//                 translateY: fadeAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [24, 0],
//                 }),
//               },
//             ],
//           },
//         ]}
//       >
//         <View
//           style={[
//             styles.card,
//             {
//               backgroundColor: newTheme.surface,
//               borderColor: newTheme.divider,
//             },
//           ]}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <Text
//               style={[styles.title, { color: newTheme.textPrimary }]}
//               accessibilityRole="header"
//             >
//               {title}
//             </Text>
//             <Pressable
//               onPress={onClose}
//               hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
//               accessibilityLabel="Close"
//               accessibilityRole="button"
//             >
//               <Ionicons name="close" size={22} color={newTheme.textPrimary} />
//             </Pressable>
//           </View>

//           {/* List */}
//           <FlatList
//             data={options}
//             keyExtractor={(i) => String(i.id)}
//             renderItem={renderItem}
//             style={styles.list}
//             contentContainerStyle={{ paddingBottom: spacing.md }}
//           />
//         </View>
//       </Animated.View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   card: {
//     borderRadius: 20,
//     overflow: "hidden",
//     borderWidth: 0.5,
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOpacity: 0.25,
//         shadowOffset: { width: 0, height: 10 },
//         shadowRadius: 24,
//       },
//       android: {
//         elevation: 12,
//       },
//     }),
//   },
//   header: {
//     paddingHorizontal: 18,
//     paddingTop: 18,
//     paddingBottom: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   list: {
//     maxHeight: 340,
//   },
//   row: {
//     minHeight: 56,
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: StyleSheet.hairlineWidth,
//   },
//   rowTextWrap: {
//     flex: 1,
//     marginRight: 12,
//   },
//   labelText: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   descriptionText: {
//     fontSize: 13,
//     marginTop: 2,
//   },
//   tickChip: {
//     width: 26,
//     height: 26,
//     borderRadius: 13,
//     borderWidth: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
