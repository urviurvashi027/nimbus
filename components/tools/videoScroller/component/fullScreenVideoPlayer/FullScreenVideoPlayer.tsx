import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import {
  VideoView,
  useVideoPlayer,
  PlayingChangeEventPayload,
} from "expo-video";
import { Ionicons } from "@expo/vector-icons";

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

// FullScreenVideoPlayer Component
interface FullScreenVideoPlayerProps {
  visible: boolean;
  video: VideoData | null;
  onClose: () => void;
}

const FullScreenVideoPlayer: React.FC<FullScreenVideoPlayerProps> = ({
  visible,
  video,
  onClose,
}) => {
  // UPDATED: Use the new useVideoPlayer hook
  const player = useVideoPlayer(video ? video.source : "", (player) => {
    player.play();
  });

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // This effect handles loading the video when the modal opens
    // and cleaning up when it closes.
    if (visible && video) {
      player.replace(video.source);
    } else {
      player.replace(null); // Unload the video source
    }

    // Listener for play/pause state changes
    const subscription = player.addListener(
      "playingChange",
      (event: PlayingChangeEventPayload) => {
        // FIXED: Access the isPlaying property from the event payload
        setIsPlaying(event.isPlaying);
      }
    );

    return () => {
      subscription.remove();
    };
  }, [visible, video, player]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      supportedOrientations={["portrait", "landscape"]}
      onRequestClose={onClose}
    >
      <View style={playerStyles.container}>
        {/* UPDATED: Use the new VideoView component */}
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          allowsFullscreen
        />

        <TouchableOpacity style={playerStyles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>

        <View style={playerStyles.controlsContainer}>
          <TouchableOpacity
            onPress={() => player.seekBy(-10)}
            style={playerStyles.controlButton}
          >
            <Ionicons name="play-back" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (isPlaying ? player.pause() : player.play())}
            style={playerStyles.controlButton}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={48}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => player.seekBy(10)}
            style={playerStyles.controlButton}
          >
            <Ionicons name="play-forward" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FullScreenVideoPlayer;

const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingIndicator: {
    position: "absolute",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
  },
  controlsContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingVertical: 10,
  },
  controlButton: {
    marginHorizontal: 20,
  },
});
