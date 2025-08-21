import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

export interface AudiobookData {
  id: string;
  title: string;
  coach_name: string;
  coverImageUrl: string;
  audioUrl: string;
  duration: string;
}

// --- HELPER FUNCTION ---
const formatTime = (millis: number | undefined) => {
  if (millis === undefined) return "00:00";
  const totalSeconds = Math.floor(millis / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

// FullScreenAudioPlayer Component
interface FullScreenAudioPlayerProps {
  visible: boolean;
  audiobook: AudiobookData | null;
  onClose: () => void;
}

const FullScreenAudioPlayer: React.FC<FullScreenAudioPlayerProps> = ({
  visible,
  audiobook,
  onClose,
}) => {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<AVPlaybackStatus | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const isPlaying = playbackStatus?.isLoaded && playbackStatus.isPlaying;
  const positionMillis = playbackStatus?.isLoaded
    ? playbackStatus.positionMillis
    : 0;
  // FIXED: Ensure durationMillis has a safe fallback value to prevent errors.
  const durationMillis =
    playbackStatus?.isLoaded && playbackStatus.durationMillis
      ? playbackStatus.durationMillis
      : 1;

  useEffect(() => {
    const loadSound = async () => {
      if (visible && audiobook) {
        setIsLoading(true);
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: audiobook.audioUrl },
            { shouldPlay: true },
            (status) => setPlaybackStatus(status)
          );
          soundRef.current = sound;
        } catch (error) {
          console.error("Error loading audio:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSound();

    return () => {
      // Unload sound when the component unmounts or modal closes
      soundRef.current?.unloadAsync();
    };
  }, [visible, audiobook]);

  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
  };

  const handleSeek = async (forward: boolean) => {
    if (!soundRef.current || !playbackStatus?.isLoaded) return;
    const newPosition = positionMillis + (forward ? 15000 : -15000);
    await soundRef.current.setPositionAsync(newPosition);
  };

  const onSliderValueChange = async (value: number) => {
    if (!soundRef.current || !playbackStatus?.isLoaded) return;
    const newPosition = value * durationMillis;
    if (Math.abs(newPosition - positionMillis) > 1000) {
      // To avoid seeking on every tiny move
      await soundRef.current.setPositionAsync(newPosition);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <ImageBackground
        source={{ uri: audiobook?.coverImageUrl }}
        style={playerStyles.container}
        blurRadius={20}
      >
        <View style={playerStyles.overlay} />
        <TouchableOpacity style={playerStyles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>

        <View style={playerStyles.contentContainer}>
          <ImageBackground
            source={{ uri: audiobook?.coverImageUrl }}
            style={playerStyles.coverArt}
            imageStyle={playerStyles.coverArtImage}
          />
          <Text style={playerStyles.title}>{audiobook?.title}</Text>
          <Text style={playerStyles.author}>{audiobook?.coach_name}</Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#FFFFFF"
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              <Slider
                style={playerStyles.slider}
                minimumValue={0}
                maximumValue={1}
                value={positionMillis / durationMillis}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
                thumbTintColor="#FFFFFF"
                onSlidingComplete={onSliderValueChange}
              />
              <View style={playerStyles.timeContainer}>
                <Text style={playerStyles.timeText}>
                  {formatTime(positionMillis)}
                </Text>
                <Text style={playerStyles.timeText}>
                  {formatTime(durationMillis)}
                </Text>
              </View>

              <View style={playerStyles.controlsContainer}>
                <TouchableOpacity
                  onPress={() => handleSeek(false)}
                  style={playerStyles.controlButton}
                >
                  <Ionicons name="play-back" size={32} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={playerStyles.controlButton}
                >
                  <Ionicons
                    name={isPlaying ? "pause-circle" : "play-circle"}
                    size={72}
                    color="white"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSeek(true)}
                  style={playerStyles.controlButton}
                >
                  <Ionicons name="play-forward" size={32} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ImageBackground>
    </Modal>
  );
};

export default FullScreenAudioPlayer;

const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  coverArt: {
    width: 280,
    height: 280,
    marginBottom: 30,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  coverArtImage: {
    borderRadius: 16,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
  },
  author: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    marginTop: 8,
    fontFamily: Platform.OS === "ios" ? "Avenir" : "Roboto",
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 30,
  },
  timeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  timeText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 30,
  },
  controlButton: {
    marginHorizontal: 20,
  },
});
