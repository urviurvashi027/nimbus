// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { FontAwesome } from "@expo/vector-icons"; // Using FontAwesome for tick and cross icons
// import { format } from "date-fns";

// import DatePicker from "./DatePicker";

// const WeeklyView = () => {
//   const [weekData, setWeekData] = useState<string[]>([]);
//   const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
//   const [endDate, setEndDate] = useState<Date>(new Date());
//   const [startDate, setStartDate] = useState<Date>(new Date());

//   useEffect(() => {
//     const initialStartDate = new Date();
//     initialStartDate.setDate(initialStartDate.getDate() - 7);
//     setStartDate(initialStartDate);
//   }, []);

//   const daysOfWeek = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

//   const getWeekData = () => {
//     return { week: ["mon", "tue", "thu", "sat", "sun"] };
//   };

//   useEffect(() => {
//     const res = getWeekData();
//     setWeekData(res.week || []);
//   }, []);

//   const showStartDateModal = () => {
//     setShowDatePicker(true);
//   };

//   const onDateSelection = (date: any) => {
//     setStartDate(date);

//     const initialStartDate = new Date(date);
//     initialStartDate.setDate(initialStartDate.getDate() + 7);
//     setEndDate(initialStartDate);
//   };

//   const onDatePickerClose = () => {
//     setShowDatePicker(false);
//   };

//   // add validation for selecting only current date, use cant select future date

//   return (
//     <View style={styles.card}>
//       <View style={styles.title}>
//         <Text style={styles.titleText}>Weekly View</Text>
//         <View style={styles.titleRange}>
//           <TouchableOpacity
//             style={styles.selectorButton}
//             onPress={showStartDateModal}
//           >
//             <Text>
//               {format(startDate, "MMM dd")} - {format(endDate, "MMM dd")}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={styles.content}>
//         {daysOfWeek.map((day) => (
//           <View
//             key={day}
//             style={{ alignItems: "center", marginHorizontal: 10 }}
//           >
//             <Text style={{ fontSize: 14, fontWeight: 300, marginBottom: 5 }}>
//               {day.toUpperCase()}
//             </Text>
//             <FontAwesome
//               name={weekData.includes(day) ? "check-circle" : "times-circle"}
//               size={24}
//               color={weekData.includes(day) ? "green" : "red"}
//             />
//           </View>
//         ))}
//       </View>
//       <DatePicker
//         visible={showDatePicker}
//         selectedDateValue={startDate}
//         onConfirmDate={onDateSelection}
//         onClose={onDatePickerClose}
//       />
//     </View>
//   );
// };

// export default WeeklyView;

// const styles = StyleSheet.create({
//   card: {
//     // flexDirection: "row",
//     // justifyContent: "center",
//     // alignItems: "center",
//     margin: 20,
//     backgroundColor: "white",
//     padding: 15,
//     borderRadius: 15,
//     width: "90%",
//     shadowColor: "#000",
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
//   content: {
//     justifyContent: "center",
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   selectorButton: {},
// });
