// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { format } from "date-fns";
// import WeeklyHabitChart from "./MonthlyChartView";

// type CalendarDay = { date: number; month: number; dayIndex: number } | null;

// const MonthlyOverview = ({ filledDates, startDate, endDate }: any) => {
//   const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
//   const [pickerEndDate, setPickerEndDate] = useState<Date>(new Date());
//   const [pickerStartDate, setPickerStartDate] = useState<Date>(new Date());

//   const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

//   // Parse the start and end date
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   // Create an array to store the month data

//   // Function to get total days in the range
//   const getDaysInRange = (start: any, end: any) => {
//     let days = [];
//     let current = new Date(start);

//     while (current <= end) {
//       days.push({
//         date: current.getDate(),
//         month: current.getMonth() + 1, // JS months are 0-based
//         dayIndex: current.getDay() === 0 ? 6 : current.getDay() - 1, // Adjust Monday as start
//       });
//       current.setDate(current.getDate() + 1);
//     }
//     return days;
//   };

//   const daysInRange = getDaysInRange(start, end);
//   let monthMatrix: CalendarDay[][] = [];
//   let currentWeek = new Array(daysInRange[0].dayIndex).fill(null); // Empty slots before first date
//   daysInRange.forEach((day) => {
//     currentWeek.push(day);

//     // When the week reaches 7 days, push to matrix and start a new week
//     if (currentWeek.length === 7) {
//       monthMatrix.push(currentWeek);
//       currentWeek = [];
//     }
//   });

//   // Push the remaining days as the last week if it's not empty
//   if (currentWeek.length > 0) {
//     while (currentWeek.length < 7) {
//       currentWeek.push(null); // Fill empty spaces at the end
//     }
//     monthMatrix.push(currentWeek);
//   }

//   const showStartDateModal = () => {
//     setShowDatePicker(true);
//   };

//   useEffect(() => {
//     const initialStartDate = new Date();
//     initialStartDate.setDate(initialStartDate.getDate() - 30);
//     setPickerStartDate(initialStartDate);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.title}>
//         <Text style={styles.titleText}>Monthly View</Text>
//         <View style={styles.titleRange}>
//           <TouchableOpacity
//             style={styles.selectorButton}
//             onPress={showStartDateModal}
//           >
//             <Text>
//               {format(pickerStartDate, "MMM dd")} -
//               {format(pickerEndDate, "MMM dd")}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       {/* Days of the week */}
//       <View style={styles.weekRow}>
//         {daysOfWeek.map((day, index) => (
//           <Text key={index} style={styles.dayLabel}>
//             {day}
//           </Text>
//         ))}
//       </View>

//       {/* Render calendar grid */}
//       {monthMatrix.map((week, index) => (
//         <View key={index} style={styles.weekRow}>
//           {week.map((day, idx) =>
//             day ? (
//               <View
//                 key={idx}
//                 style={[
//                   styles.dateCircle,
//                   filledDates.includes(`${day.month}-${day.date}`)
//                     ? styles.filledCircle
//                     : styles.borderCircle,
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.dateText,
//                     filledDates.includes(`${day.month}-${day.date}`)
//                       ? styles.filledText
//                       : styles.borderText,
//                   ]}
//                 >
//                   {day.date}
//                 </Text>
//               </View>
//             ) : (
//               <View key={idx} style={styles.datePlaceholder} />
//             )
//           )}
//         </View>
//       ))}
//       <View style={styles.chartPanel}>
//         <WeeklyHabitChart />
//       </View>
//     </View>
//   );
// };

// export default MonthlyOverview;

// // **Styles**
// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: "white",
//     alignItems: "center",
//     shadowColor: "#000",
//     width: "90%",
//     borderRadius: 15,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5, // For Android shadow
//   },
//   title: {
//     display: "flex",
//     flexDirection: "row",
//     marginBottom: 15,
//     fontSize: 22,
//   },
//   titleText: {
//     fontSize: 16,
//     fontWeight: 600,
//     flex: 1,
//   },
//   titleRange: {
//     display: "flex",
//     flexDirection: "row",
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: "red",
//   },
//   weekRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     width: "100%",
//     marginVertical: 5,
//   },
//   dayLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     width: 40,
//     textAlign: "center",
//   },
//   dateCircle: {
//     width: 30,
//     height: 30,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   filledCircle: {
//     backgroundColor: "orange",
//   },
//   borderCircle: {
//     borderWidth: 2,
//     borderColor: "orange",
//   },
//   datePlaceholder: {
//     width: 40,
//     height: 40,
//     marginHorizontal: 5,
//   },
//   dateText: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   filledText: {
//     color: "white",
//   },
//   borderText: {
//     color: "orange",
//   },
//   selectorButton: {},
//   chartPanel: {
//     borderTopWidth: 1,
//     borderColor: "grey",
//   },
// });
