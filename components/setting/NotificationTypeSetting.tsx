// import React, { useContext, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   FlatList,
// } from "react-native";
// import SetReminderModal from "./SetReminderModal";
// import { Ionicons } from "@expo/vector-icons";
// import ThemeContext from "@/context/ThemeContext";
// import { useNavigation } from "expo-router";

// interface ReminderType {
//   key: string;
//   label: string;
// }
// const REMINDER_TYPES: ReminderType[] = [
//   { key: "morning", label: "Morning check-in" },
//   { key: "nightly", label: "Nightly review" },
//   { key: "mood", label: "Log your mood" },
//   { key: "streak", label: "Streak saver" },
// ];

// export default function NotificationTypeModal({
//   visible,
//   onClose,
// }: {
//   visible: boolean;
//   onClose: () => void;
// }) {
//   const [selectedReminder, setSelectedReminder] = useState<ReminderType | null>(
//     null
//   );

//   const [showSetReminderModal, setShowSetReminderModal] =
//     useState<boolean>(false);

//   const { newTheme } = useContext(ThemeContext);

//   const styles = styling(newTheme);

//   const navigation = useNavigation();

//   return (
//     <Modal visible={visible} animationType="slide" transparent>
//       <View style={styles.overlay}>
//         {/* Back Button */}
//         <TouchableOpacity style={styles.backButton} onPress={onClose}>
//           <Ionicons name="arrow-back" size={24} color={newTheme.textPrimary} />
//         </TouchableOpacity>

//         {/* reminder types */}
//         <View style={styles.container}>
//           {REMINDER_TYPES.map((item) => (
//             <TouchableOpacity
//               key={item.key}
//               style={styles.item}
//               onPress={() => {
//                 setSelectedReminder(item);
//                 setShowSetReminderModal(true);
//               }}
//             >
//               <Text style={styles.label}>{item.label}</Text>
//               <View style={styles.rightSection}>
//                 <Text style={styles.status}>Off</Text>
//                 <Ionicons
//                   name="chevron-forward"
//                   size={24}
//                   color="black"
//                   style={styles.iconRight}
//                 />
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {selectedReminder && (
//           <SetReminderModal
//             visible={showSetReminderModal}
//             type={selectedReminder}
//             onClose={() => setSelectedReminder(null)}
//           />
//         )}
//       </View>
//     </Modal>
//   );
// }

// const styling = (theme: any) =>
//   StyleSheet.create({
//     container: {
//       paddingHorizontal: 20,
//       backgroundColor: theme.surface,
//       flex: 1,
//     },
//     overlay: {
//       flex: 1,
//       backgroundColor: theme.surface,
//     },
//     backButton: {
//       marginTop: 80,
//       marginLeft: 20,
//       marginBottom: 10,
//     },
//     item: {
//       paddingVertical: 20,
//       borderBottomWidth: 1,
//       borderBottomColor: theme.divider,
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//     },
//     label: {
//       marginRight: 10,
//       color: theme.textPrimary,
//       fontSize: 16,
//     },
//     iconRight: {
//       marginRight: 12,
//       color: theme.textPrimary,
//     },
//     rightSection: {
//       flexDirection: "row",
//       alignItems: "center",
//       gap: 6, // or use marginRight on Text instead
//     },
//     status: {
//       fontSize: 16,
//       color: "gray",
//     },
//   });
