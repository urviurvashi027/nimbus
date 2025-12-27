// // DatePicker.tsx
// import React, { useContext, useEffect, useState } from "react";
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   Text,
// } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Ionicons } from "@expo/vector-icons";
// import { format } from "date-fns";
// import ThemeContext from "@/context/ThemeContext";
// // import { Text } from "./Themed";

// type ThemeKey = "basic" | "light" | "dark";

// interface DatePickerProps {
//   label: string;
//   selectedDateValue: Date;
//   onConfirmDate: (selectedDate: Date) => void;
//   minimumDate?: Date;
//   mode?: "date" | "time" | "datetime";
//   iosDisplay?: "spinner" | "compact" | "default" | "calendar";
// }

// const DatePicker: React.FC<DatePickerProps> = ({
//   label,
//   selectedDateValue,
//   onConfirmDate,
//   minimumDate,
//   mode = "date",
//   iosDisplay,
// }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date>(selectedDateValue);

//   const { theme, newTheme } = useContext(ThemeContext);

//   useEffect(() => {
//     setSelectedDate(selectedDateValue);
//   }, [selectedDateValue]);

//   const show = () => setIsVisible(true);
//   const hide = () => setIsVisible(false);

//   const handleConfirm = (date: Date) => {
//     hide();
//     setSelectedDate(date);
//     onConfirmDate(date);
//   };

//   // prefer spinner on iOS for time for consistent look (but do not pass unsupported props)
//   const display =
//     iosDisplay ||
//     (Platform.OS === "ios" && mode === "time" ? "spinner" : "default");

//   console.log("I am new Date picker");

//   return (
//     <View>
//       <TouchableOpacity
//         activeOpacity={0.85}
//         onPress={show}
//         style={[
//           styles.button,
//           {
//             backgroundColor: newTheme.background,
//             borderColor: newTheme.divider,
//           },
//         ]}
//       >
//         <View style={{ flex: 1 }}>
//           <Text style={[styles.label, { color: newTheme.textSecondary }]}>
//             Select {label}
//           </Text>
//           <Text
//             style={[styles.value, { color: newTheme.textPrimary }]}
//             numberOfLines={1}
//             ellipsizeMode="tail"
//           >
//             {mode === "time"
//               ? format(selectedDate, "hh:mm a")
//               : format(selectedDate, "dd MMMM yyyy")}
//           </Text>
//         </View>

//         <Ionicons
//           name={mode === "time" ? "time-outline" : "calendar"}
//           size={22}
//           color={newTheme.textSecondary}
//           style={{ marginLeft: 10 }}
//         />
//       </TouchableOpacity>

//       <DateTimePickerModal
//         isVisible={isVisible}
//         mode={mode === "datetime" ? "date" : (mode as "date" | "time")}
//         date={selectedDate}
//         minimumDate={minimumDate}
//         onConfirm={(d) => handleConfirm(d as Date)}
//         onCancel={hide}
//         buttonTextColorIOS="#4CAF50"
//         display={display as any}
//       />
//     </View>
//   );
// };

// export default DatePicker;

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//     marginTop: 8,
//   },
//   label: {
//     fontSize: 13,
//     marginBottom: 4,
//   },
//   value: {
//     fontSize: 15,
//     fontWeight: "600",
//   },
// });
