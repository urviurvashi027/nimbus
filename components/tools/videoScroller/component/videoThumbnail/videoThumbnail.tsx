import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from "react-native";

// --- TYPES ---
export interface VideoData {
  // views: string;
  id: number;
  title: string;
  image: string;
  category?: string;
  source: string;
  views?: string;
}

// VideoThumbnail Component
interface VideoThumbnailProps {
  video: VideoData;
  onPress: () => void;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={thumbnailStyles.container}>
      <ImageBackground
        source={{ uri: video.image }}
        style={thumbnailStyles.imageBackground}
        imageStyle={thumbnailStyles.imageStyle}
      >
        <View style={thumbnailStyles.overlay} />
        <View style={thumbnailStyles.textContainer}>
          <Text style={thumbnailStyles.title}>{video.title}</Text>
          <Text style={thumbnailStyles.views}>{video.views}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default VideoThumbnail;

const thumbnailStyles = StyleSheet.create({
  container: {
    width: 160,
    height: 240,
    marginRight: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
  },
  textContainer: {
    padding: 12,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    // fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  views: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    // fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});
