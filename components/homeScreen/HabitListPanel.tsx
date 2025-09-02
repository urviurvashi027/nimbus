// import React, { useContext, useEffect, useState } from "react";
// import { FlatList, StyleSheet, View, Text } from "react-native";
// import HabitItem from "./component/HabitItem";
// import { HabitItem as HabitType } from "@/types/habitTypes"; // reuse your HabitItem type
// import ThemeContext from "@/context/ThemeContext";

// // Example icons + colors (can expand)
// const habitIcons = ["🍰", "🌱", "🏃‍♂️", "🧘", "📚", "💧"];
// const habitColors = ["#FF6B6B", "#4ECDC4", "#FFD93D", "#1A535C", "#6A4C93"];

// interface HabitListProps {
//   data: HabitType[];
//   dateLabel?: string;
//   onToggleHabit: (id: string, newStatus: boolean) => void;
// }

// export default function HabitListPanel({
//   data,
//   dateLabel,
//   onToggleHabit,
// }: HabitListProps) {
//   const [list, setList] = useState<any>([]);
//   const [completedHabit, setCompletedHabit] = useState<number>();
//   //   const { theme, newTheme } = React.useContext(ThemeContext);

//   const { theme, newTheme } = useContext(ThemeContext);
//   const styles = styling(newTheme);

//   useEffect(() => {
//     if (data && data.length > 0) {
//       //   console.log(data);
//       //   const completed = data.filter((h: any) => h.completed).length;
//       //   console.log(completed, dateLabel, "completed habits");
//       //   setCompletedHabit(completed);
//       const formattedData = data.map((item, index) => {
//         const color = habitColors[index % habitColors.length]; // cycle through colors
//         const icon = habitIcons[index % habitIcons.length];
//         return {
//           ...item,
//           color: color,
//           icon: icon,
//         };
//       });
//       //   console.log(formattedData, "formattedData");
//       setList(formattedData);
//     }
//   }, [data]);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       {/* <View style={styles.header}>
//         <Text style={styles.title}>{dateLabel}</Text>
//         <View style={styles.pill}>
//           <Text style={styles.pillText}>
//             {completedHabit}/{list.length}
//           </Text>
//         </View>
//       </View>

//       <FlatList
//         data={list}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => ( */}
//       {list.map((item: any) => (
//         <HabitItem
//           id={item.id.toString()}
//           name={item.name}
//           icon={item.icon}
//           color={item.color}
//           frequency={item.frequency}
//           time={item.time}
//           description={item.description}
//           done={item.completed}
//           onToggle={onToggleHabit}
//         />
//       ))}
//       {/* )}
//         contentContainerStyle={styles.listContainer}
//         // contentContainerStyle={styles(newTheme).listContainer}
//       /> */}
//     </View>
//   );
// }

// const styling = (newTheme: any) =>
//   StyleSheet.create({
//     container: {},
//     listContainer: {
//       paddingBottom: 80,
//     },
//     header: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginBottom: 16,
//     },
//     title: { fontSize: 20, fontWeight: "600", color: newTheme.textPrimary },
//     pill: {
//       backgroundColor: "#2A2A2A",
//       paddingHorizontal: 10,
//       paddingVertical: 4,
//       borderRadius: 6, // square-pill feel
//     },
//     pillText: { color: newTheme.textSecondary, fontWeight: "500" },
//   });
