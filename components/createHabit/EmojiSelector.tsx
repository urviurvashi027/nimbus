// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import EmojiKeyboard, { type EmojiType } from "rn-emoji-keyboard";

// const EmojiInput = () => {
//   const [selectedEmoji, setSelectedEmoji] = useState("😊"); // Default emoji
//   const [isOpen, setIsOpen] = useState(false);

//   const handleEmojiSelect = (emoji: EmojiType) => {
//     setSelectedEmoji(emoji.emoji);
//     setIsOpen(false); // Close modal after selection
//   };

//   return (
//     <View style={styles.container}>
//       {/* Emoji Input (Touchable) */}
//       <TouchableOpacity
//         style={styles.emojiInput}
//         onPress={() => setIsOpen(true)}
//       >
//         <Text style={styles.emoji}>{selectedEmoji}</Text>
//         {/* <Text style={styles.placeholder}>Tap to select emoji</Text> */}
//       </TouchableOpacity>

//       {/* Emoji Picker Modal */}
//       <EmojiKeyboard
//         onEmojiSelected={handleEmojiSelect}
//         open={isOpen}
//         onClose={() => setIsOpen(false)}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   emojiInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderBottomWidth: 2, // Only bottom border
//     borderBottomColor: "#e6e7eb",
//     paddingVertical: 10,
//     width: 50,
//   },
//   emoji: {
//     fontSize: 44,
//     marginRight: 0, // Space between emoji and placeholder
//   },
//   placeholder: {
//     fontSize: 16,
//     color: "#666",
//   },
// });

// export default EmojiInput;
