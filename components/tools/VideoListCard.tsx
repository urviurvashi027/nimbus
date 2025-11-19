// import React, { useContext, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   Modal,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { VideoView, useVideoPlayer, VideoSource } from "expo-video";
// import ThemeContext from "@/context/ThemeContext";
// import { ThemeKey } from "../Themed";

// const { width, height } = Dimensions.get("window");

// // import f from "../../assets/images/workout.jpg";

// const videoData = [
//   {
//     id: "1",
//     title: "Introduction to Yoga",
//     thumbnail: require("../../assets/images/workout.jpg"),
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
//   {
//     id: "2",
//     title: "Mindfulness Meditation",
//     thumbnail: require("../../assets/images/workout.jpg"),
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
//   {
//     id: "3",
//     title: "Healthy Eating Habits",
//     thumbnail: require("../../assets/images/workout.jpg"),
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
//   {
//     id: "4",
//     title: "Workout at Home",
//     thumbnail: require("../../assets/images/workout.jpg"),
//     videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
//   },
// ];

// const MasterClass = () => {
//   const [selectedVideo, setSelectedVideo] = useState<VideoSource | undefined>();

//   const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

//   const styles = styling(theme);

//   // ✅ Always call useVideoPlayer (even if `selectedVideo` is undefined)
//   const player = useVideoPlayer(selectedVideo ?? { uri: "" });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Master Classes</Text>

//       <FlatList
//         data={videoData}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.videoList}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.videoCard}
//             onPress={() => setSelectedVideo({ uri: item.videoUrl })}
//           >
//             <Image
//               style={styles.thumbnail}
//               // alt={button.label}
//               // source={require("../../../assets/images/options/drink.png")}
//               source={
//                 item.thumbnail
//                   ? String(item.thumbnail)
//                   : require("../../assets/images/buttonLogo/drink.png")
//               }
//             />
//             {/* <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} /> */}
//             <Text style={styles.videoTitle}>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//       />

//       {/* Fullscreen Video Modal */}
//       <Modal
//         visible={!!selectedVideo}
//         animationType="slide"
//         transparent={false}
//         onRequestClose={() => setSelectedVideo(undefined)}
//       >
//         <View style={styles.modalContainer}>
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => setSelectedVideo(undefined)}
//           >
//             <Text style={styles.closeText}>Close</Text>
//           </TouchableOpacity>

//           <VideoView
//             player={player} // ✅ Always pass a player instance
//             style={styles.video}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styling = (theme: ThemeKey) =>
//   StyleSheet.create({
//     container: {
//       // padding: 16,
//       backgroundColor: themeColors[theme].background,
//       // flex: 1,
//     },
//     heading: {
//       fontSize: 22,
//       fontWeight: "bold",
//       marginBottom: 12,
//     },
//     videoList: {
//       paddingVertical: 10,
//     },
//     videoCard: {
//       width: 200,
//       marginRight: 15,
//       backgroundColor: "#f8f8f8",
//       borderRadius: 10,
//       padding: 5,
//     },
//     thumbnail: {
//       width: "100%",
//       height: 120,
//       borderRadius: 8,
//       backgroundColor: "#ccc",
//     },
//     videoTitle: {
//       marginTop: 5,
//       fontSize: 16,
//       fontWeight: "500",
//       textAlign: "center",
//     },
//     modalContainer: {
//       flex: 1,
//       backgroundColor: "#000",
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     video: {
//       width: width,
//       height: height * 0.5,
//     },
//     closeButton: {
//       position: "absolute",
//       top: 40,
//       right: 20,
//       zIndex: 1,
//       padding: 10,
//       backgroundColor: "rgba(255,255,255,0.7)",
//       borderRadius: 5,
//     },
//     closeText: {
//       fontSize: 16,
//       fontWeight: "bold",
//       color: "#000",
//     },
//   });

// export default MasterClass;
