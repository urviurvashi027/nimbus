import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

// --- TYPES ---
export interface AudiobookData {
  id: string;
  title: string;
  coach_name: string;
  coverImageUrl: string;
  audioUrl: string;
  duration: string;
}

// AudiobookThumbnail Component
interface AudiobookThumbnailProps {
  audiobook: AudiobookData;
  onPress: () => void;
}

const AudiobookThumbnail: React.FC<AudiobookThumbnailProps> = ({
  audiobook,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={thumbnailStyles.container}>
      <ImageBackground
        source={{ uri: audiobook.coverImageUrl }}
        style={thumbnailStyles.imageBackground}
        imageStyle={thumbnailStyles.imageStyle}
      >
        <View style={thumbnailStyles.overlay} />
        <View style={thumbnailStyles.textContainer}>
          <Text style={thumbnailStyles.title}>{audiobook.title}</Text>
          <Text style={thumbnailStyles.author}>{audiobook.coach_name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default AudiobookThumbnail;

const thumbnailStyles = StyleSheet.create({
  container: {
    width: 150,
    height: 225,
    marginRight: 16,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 12,
  },
  imageStyle: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
  },
  author: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
});
