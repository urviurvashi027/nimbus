// import React, { useContext } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { ThemeKey } from "../Themed";
// import ThemeContext from "@/context/ThemeContext";

// type WarningBannerProps = {
//   message: string;
//   ctaText: string;
//   onPress: () => void;
// };

// const WarningBanner = ({ message, ctaText, onPress }: WarningBannerProps) => {
//   const { theme } = useContext(ThemeContext);

//   const styles = styling(theme);
//   return (
//     <View style={styles.banner}>
//       <Text style={styles.message}>{message}</Text>
//       <TouchableOpacity style={styles.button} onPress={onPress}>
//         <Text style={styles.buttonText}>{ctaText}</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default WarningBanner;

// const styling = (theme: ThemeKey) =>
//   StyleSheet.create({
//     banner: {
//       backgroundColor: "#fff3cd",
//       borderLeftWidth: 5,
//       borderLeftColor: "#ffc107",
//       padding: 16,
//       borderRadius: 6,
//       marginBottom: 16,
//     },
//     message: {
//       fontSize: 14,
//       color: "#856404",
//       marginBottom: 10,
//     },
//     button: {
//       backgroundColor: "#ffc107",
//       paddingVertical: 8,
//       paddingHorizontal: 14,
//       alignSelf: "flex-start",
//       borderRadius: 5,
//     },
//     buttonText: {
//       color: "#212529",
//       fontWeight: "bold",
//       fontSize: 14,
//     },
//   });
