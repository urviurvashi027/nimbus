// import React, { useState } from "react";
// import {
//   View,
//   Button,
//   Modal,
//   ActivityIndicator,
//   StyleSheet,
//   Text,
// } from "react-native";

// const ActivityIndicatorModal = ({ visible }: { visible: boolean }) => {
//   return (
//     <Modal visible={visible} transparent animationType="fade">
//       <View style={styles.modalBackground}>
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="blue" />
//           <Text style={styles.loadingText}>Loading...</Text>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
//   },
//   loaderContainer: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
// });

// export default ActivityIndicatorModal;
