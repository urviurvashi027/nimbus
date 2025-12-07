// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   FlatList,
//   Image,
// } from "react-native";
// import * as Progress from "react-native-progress"; // install react-native-progress

// export default function AnalyzingResult({
//   data,
//   navigation,
// }: {
//   data?: any;
//   navigation?: any;
// }) {
//   const [progress, setProgress] = useState(0);
//   const [isDone, setIsDone] = useState(false);

//   const tasks = [
//     "Analyzing Emotional and Psychological Patterns",
//     "Analyzing Social Support and Relationships",
//     "Analyzing Impact on Identity and Self-esteem",
//   ];

//   // Simulate API call
//   useEffect(() => {
//     let interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 1) {
//           clearInterval(interval);
//           setIsDone(true);
//           // You can navigate or trigger next screen here
//           // navigation.navigate('ResultScreen')
//           return 1;
//         }
//         return prev + 0.02;
//       });
//     }, 50);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Analyzing your {data.title} result</Text>

//       <Progress.Circle
//         progress={progress}
//         size={160}
//         thickness={8}
//         showsText
//         formatText={() => `${Math.round(progress * 100)}%`}
//         color={"#ffffff"}
//         borderWidth={0}
//         unfilledColor={"rgba(255, 255, 255, 0.3)"}
//         textStyle={{ fontSize: 28, fontWeight: "bold", color: "#fff" }}
//       />

//       <View style={styles.taskContainer}>
//         {tasks.map((task, index) => (
//           <View key={index} style={styles.taskRow}>
//             <Text style={styles.taskText}>{task}</Text>
//             {progress >= 1 ? (
//               <Text style={styles.check}>✅</Text>
//             ) : (
//               <ActivityIndicator size="small" color="#fff" />
//             )}
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#8f48ff",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 20,
//     color: "#fff",
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   taskContainer: {
//     marginTop: 40,
//     width: "100%",
//   },
//   taskRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   taskText: {
//     color: "#fff",
//     fontSize: 16,
//     flex: 1,
//   },
//   check: {
//     fontSize: 20,
//     marginLeft: 10,
//   },
// });
