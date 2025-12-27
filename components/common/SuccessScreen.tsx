// import ThemeContext from "@/context/ThemeContext";
// import React, { useContext } from "react";
// import {
//   View,
//   Text,
//   Image,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import { ThemeKey } from "../Themed";
// import { Ionicons } from "@expo/vector-icons";

// const SuccessModal = ({
//   visible,
//   onClose,
//   isSuccess,
//   isLoading,
// }: {
//   visible: boolean;
//   onClose: () => void;
//   isSuccess: boolean;
//   isLoading: boolean;
// }) => {
//   const styles = styling(theme);

//   return (
//     <Modal visible={visible} transparent animationType="slide">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           {/* Loading */}
//           {isLoading && (
//             <>
//               <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="blue" />
//                 <Text style={styles.loadingText}>Loading...</Text>
//               </View>
//             </>
//           )}

//           {/* Success Message */}
//           {!isLoading && isSuccess && (
//             <>
//               <View style={styles.successView}>
//                 {/* Success GIF */}
//                 <Image
//                   source={require("../../assets/images/actionLogo/success.jpg")} // Replace with your GIF file
//                   style={styles.gif}
//                 />
//                 <Text style={styles.successText}>
//                   Habit Created Successfully!!
//                 </Text>

//                 {/* Continue Button */}
//                 <TouchableOpacity style={styles.button} onPress={onClose}>
//                   <Text style={styles.buttonText}>Continue</Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           )}

//           {/* Success Message */}
//           {!isLoading && !isSuccess && (
//             <>
//               <Text style={styles.successText}>Failed!!</Text>

//               {/* Continue Button */}
//               <TouchableOpacity style={styles.button} onPress={onClose}>
//                 <Text style={styles.buttonText}>Continue</Text>
//               </TouchableOpacity>
//             </>
//           )}
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styling = (theme: ThemeKey) =>
//   StyleSheet.create({
//     modalOverlay: {
//       flex: 1,
//       backgroundColor: "rgba(0,0,0,0.5)",
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     modalContainer: {
//       backgroundColor: "white",
//       padding: 20,
//       borderRadius: 10,
//       alignItems: "center",
//     },
//     successView: {
//       padding: 30,
//       alignItems: "center",
//     },
//     loaderContainer: {
//       backgroundColor: "white",
//       padding: 20,
//       borderRadius: 10,
//       alignItems: "center",
//     },
//     loadingText: {
//       marginTop: 10,
//       fontSize: 16,
//       fontWeight: "bold",
//       color: themeColors[theme].text,
//     },
//     gif: {
//       width: 150,
//       height: 150,
//       marginBottom: 15,
//       resizeMode: "contain",
//     },
//     successText: {
//       fontSize: 18,
//       fontWeight: "bold",
//       color: themeColors.basic.success,
//       marginTop: 10,
//       textAlign: "center",
//     },
//     button: {
//       marginTop: 20,
//       borderWidth: 2,
//       borderColor: themeColors.basic.success,
//       paddingVertical: 12,
//       paddingHorizontal: 30,
//       borderRadius: 25,
//     },
//     buttonText: {
//       color: themeColors.basic.success,
//       fontSize: 16,
//       fontWeight: "bold",
//     },
//   });

// export default SuccessModal;
