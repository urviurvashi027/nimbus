// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// type HabitDetailsData = {
//   metric_unit: string;
//   habit_type: string;
//   metric_count: number;
//   start_time: string;
//   end_time: string;
//   reminder_time: string;
//   frequency: string;
//   all_day: boolean;
// };

// interface SteakCardProps {
//   data: HabitDetailsData;
// }

// const HabitDetailsCard: React.FC<SteakCardProps> = ({ data }) => {
//   const {
//     metric_unit,
//     habit_type,
//     metric_count,
//     start_time,
//     end_time,
//     reminder_time,
//     all_day,
//     frequency,
//   } = data;
//   return (
//     <View style={styles.container}>
//       {/* First Row: Habit Type & Metric */}
//       <View style={styles.row}>
//         <View style={styles.detail}>
//           {/* <FontAwesome5 name="tasks" size={20} color="#555" /> */}
//           <Text style={styles.value}>{habit_type}</Text>
//         </View>
//         <View style={styles.detail}>
//           {/* <MaterialCommunityIcons name="scale" size={20} color="#555" /> */}
//           <Text style={styles.value}>
//             {metric_count} / {metric_unit}
//           </Text>
//         </View>
//       </View>

//       {/* Second Row: Duration & Time */}
//       <View style={styles.row}>
//         <View style={styles.detail}>
//           {/* <MaterialCommunityIcons name="clock-outline" size={20} color="#555" /> */}
//           <Text style={styles.value}>
//             {all_day ? "All Day" : start_time ? start_time : "N/A"} -
//             {end_time ? end_time : "N/A"}
//           </Text>
//         </View>
//         {/* <View style={styles.detail}>
//           <Text style={styles.value}>
//             {start_time ? start_time : "N/A"} -{end_time ? end_time : "N/A"}
//           </Text>
//         </View> */}
//       </View>

//       {/* Third Row: Frequency */}
//       <View style={styles.row}>
//         <View style={styles.detail}>
//           {/* <MaterialCommunityIcons name="repeat" size={20} color="#555" /> */}
//           <Text style={styles.value}>{frequency}</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     padding: 15,
//     borderRadius: 15,
//     width: "90%",
//     marginTop: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5, // For Android shadow
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   detail: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   value: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
// });

// export default HabitDetailsCard;
