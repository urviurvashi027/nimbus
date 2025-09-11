// import React, { useContext, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Switch,
//   Button,
//   StyleSheet,
//   Platform,
//   Modal,
//   TouchableOpacity,
// } from "react-native";
// import { format } from "date-fns";
// import { Ionicons } from "@expo/vector-icons";
// import ThemeContext from "@/context/ThemeContext";
// import TimePicker from "../TimePicker";

// const ReminderModal = ({
//   type,
//   visible,
//   onClose,
// }: {
//   type: any;
//   visible: boolean;
//   onClose: () => void;
// }) => {
//   const [isEnabled, setIsEnabled] = useState(false);
//   //   const [reminderType, setReminderType] useState("");
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [time, setTime] = useState(new Date());
//   const [hasPermission, setHasPermission] = useState(true);

//   const { newTheme } = useContext(ThemeContext);

//   const styles = styling(newTheme);

//   useEffect(() => {
//     checkPermissions();
//   }, []);

//   const checkPermissions = async () => {
//     const status = "granted";
//     setHasPermission(status === "granted");
//   };

//   const toggleSwitch = async () => {
//     if (!isEnabled) {
//       const status = "granted";
//       if (status !== "granted") {
//         setHasPermission(false);
//         return;
//       }
//     }
//     setIsEnabled(!isEnabled);
//   };

//   useEffect(() => {
//     console.log(isEnabled, "specify time is isEnabled");
//     setShowTimePicker(isEnabled);
//   }, [isEnabled]);

//   useEffect(() => {
//     console.log(type, "notification type");
//   }, [type]);

//   const onTimeChange = (selectedDate: any) => {
//     if (selectedDate) {
//       console.log(format(selectedDate, "hh:mm a"));
//       console.log(selectedDate, "selectedDate");
//     }
//   };

//   const renderPermissionScreen = () => (
//     <View style={styles.permissionContainer}>
//       <Text style={styles.permissionText}>No notification access</Text>
//       <Text style={styles.permissionSubtext}>
//         We use notifications to remind you to complete tasks. Please enable
//         them.
//       </Text>
//       {/* <TouchableOpacity style={styles.goToSettings} onPress={openSettings}> */}
//       <TouchableOpacity style={styles.goToSettings}>
//         <Text style={styles.goToSettingsText}>Go to Settings</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={onClose}>
//         <Text style={styles.cancelText}>Cancel</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.modalView}>
//         {/* Back Button */}
//         <TouchableOpacity style={styles.backButton} onPress={onClose}>
//           <Ionicons name="arrow-back" size={24} color={newTheme.textPrimary} />
//         </TouchableOpacity>
//         {/* <TouchableOpacity onPress={onClose} style={styles.backArrow}>
//           <Text>{"←"}</Text>
//         </TouchableOpacity> */}

//         {hasPermission ? (
//           <>
//             <Text style={styles.title}>
//               No more notifications for {type.label}
//             </Text>
//             <View style={styles.row}>
//               <Text style={styles.label}>Reminder</Text>
//               <Switch value={isEnabled} onValueChange={toggleSwitch} />
//             </View>
//             {/* {isEnabled && (
//               <TouchableOpacity onPress={() => setShowTimePicker(true)}>
//                 <Text style={styles.timeText}>
//                   Set Time: {time.toLocaleTimeString()}
//                 </Text>
//               </TouchableOpacity>
//             )} */}
//             {showTimePicker && (
//               <View style={styles.timePickerContainer}>
//                 <TimePicker
//                   selectedValue={time}
//                   onConfirmTime={onTimeChange}
//                   label="Reminder At"
//                 />
//               </View>
//             )}
//           </>
//         ) : (
//           renderPermissionScreen()
//         )}
//       </View>
//     </Modal>
//   );
// };

// const styling = (theme: any) =>
//   StyleSheet.create({
//     modalView: {
//       flex: 1,
//       backgroundColor: theme.surface,
//       padding: 20,
//     },
//     backButton: {
//       marginTop: 80,
//       marginBottom: 10,
//     },
//     title: {
//       fontWeight: "bold",
//       fontSize: 20,
//       color: theme.textPrimary,
//       marginBottom: 30,
//     },
//     label: {
//       fontSize: 16,
//       color: theme.textSecondary,
//     },
//     row: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//     },
//     timeText: {
//       marginTop: 20,
//       color: theme.textSecondary,
//     },
//     permissionContainer: {
//       flex: 1,
//       backgroundColor: theme.surface,
//       justifyContent: "center",
//       alignItems: "center",
//       padding: 30,
//     },
//     permissionText: {
//       color: theme.textSecondary,
//       fontSize: 24,
//       fontWeight: "bold",
//       marginBottom: 10,
//     },
//     permissionSubtext: {
//       color: theme.textSecondary,
//       textAlign: "center",
//       marginBottom: 20,
//     },
//     goToSettings: {
//       backgroundColor: theme.surface,
//       paddingHorizontal: 20,
//       paddingVertical: 10,
//       borderRadius: 10,
//     },
//     goToSettingsText: {
//       color: theme.textSecondary,
//       fontWeight: "bold",
//     },
//     cancelText: {
//       marginTop: 20,
//       color: theme.textSecondary,
//     },
//     backArrow: {
//       position: "absolute",
//       top: 50,
//       left: 20,
//     },
//     timePickerContainer: {
//       paddingTop: 20,
//     },
//   });

// export default ReminderModal;
