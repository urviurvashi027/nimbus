// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// type SteakCardData = {
//   score: string;
//   total: number;
//   bestStreak: number;
//   streak: number;
// };

// interface SteakCardProps {
//   data: SteakCardData;
// }

// const StreakCard: React.FC<SteakCardProps> = ({ data }) => {
//   const { score, total, bestStreak, streak } = data;
//   return (
//     <View style={styles.card}>
//       <View style={styles.stat}>
//         <Text style={styles.value}>{score}%</Text>
//         <Text style={styles.label}>Score</Text>
//       </View>
//       <View style={styles.stat}>
//         <Text style={styles.value}>{total}</Text>
//         <Text style={styles.label}>Total</Text>
//       </View>
//       <View style={styles.stat}>
//         <Text style={styles.value}>{bestStreak}</Text>
//         <Text style={styles.label}>Best Streak</Text>
//       </View>
//       <View style={styles.stat}>
//         <Text style={styles.value}>{streak}</Text>
//         <Text style={styles.label}>Streak</Text>
//       </View>
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   card: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
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
//   stat: {
//     alignItems: "center",
//   },
//   value: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   label: {
//     fontSize: 14,
//     color: "#777",
//   },
// });

// export default StreakCard;
