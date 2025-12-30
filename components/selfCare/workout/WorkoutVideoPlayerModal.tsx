import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Text,
  Platform,
  Dimensions,
} from "react-native";
import {
  VideoView,
  useVideoPlayer,
  PlayingChangeEventPayload,
} from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ThemeContext from "@/context/ThemeContext";

interface WorkoutVideoPlayerModalProps {
  visible: boolean;
  videoSource: string;
  title: string;
  onClose: () => void;
}

const { width } = Dimensions.get("window");
const VIDEO_SIZE = width * 0.85;

const WorkoutVideoPlayerModal: React.FC<WorkoutVideoPlayerModalProps> = ({
  visible,
  videoSource,
  title,
  onClose,
}) => {
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = useMemo(() => styling(newTheme, spacing, typography), [newTheme, spacing, typography]);

  const player = useVideoPlayer(videoSource, (p) => {
    p.loop = true;
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (visible && videoSource) {
      setIsPlaying(false);
      setIsReady(false);
      player.replace(videoSource);

      const readyTimeout = setTimeout(() => {
        setIsReady(true);
      }, 600);

      return () => clearTimeout(readyTimeout);
    } else {
      player.pause();
      setIsPlaying(false);
      setIsReady(false);
    }
  }, [visible, videoSource, player]);

  useEffect(() => {
    const playingSub = player.addListener(
      "playingChange",
      (event: PlayingChangeEventPayload) => {
        setIsPlaying(event.isPlaying);
      }
    );

    return () => {
      playingSub.remove();
    };
  }, [player]);

  const handleTogglePlay = () => {
    if (!isReady) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleClose = () => {
    player.pause();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
        
        {/* Backdrop Touchable to close */}
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={handleClose} 
        />

        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={newTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Video Container (Squared) */}
          <View style={styles.videoWrapper}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="cover"
              allowsFullscreen={false}
            />
            {!isReady && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={newTheme.accent} />
              </View>
            )}
          </View>

          {/* Player Controls below video */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={() => isReady && player.seekBy(-10)}
              style={styles.seekBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="play-back" size={28} color={newTheme.textPrimary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTogglePlay}
              style={styles.playBtn}
              activeOpacity={0.8}
            >
              <View style={[styles.playBtnInner, { backgroundColor: newTheme.accent }]}>
                <Ionicons
                  name={isPlaying ? "pause" : "play"}
                  size={32}
                  color={newTheme.background}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => isReady && player.seekBy(10)}
              style={styles.seekBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="play-forward" size={28} color={newTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.hintText}>Focus on your form and breathing</Text>
        </View>
      </View>
    </Modal>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    card: {
      width: width * 0.92,
      backgroundColor: theme.surface,
      borderRadius: 32,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.divider,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 12,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.h3,
      color: theme.textPrimary,
      flex: 1,
      marginRight: spacing.md,
    },
    closeBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceMuted,
      justifyContent: "center",
      alignItems: "center",
    },
    videoWrapper: {
      width: "100%",
      aspectRatio: 1,
      borderRadius: 24,
      overflow: "hidden",
      backgroundColor: "#000",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
    },
    video: {
      flex: 1,
    },
    loaderContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.3)",
    },
    controlsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: spacing.xl,
      gap: spacing.xl,
    },
    seekBtn: {
      padding: spacing.sm,
    },
    playBtn: {
      width: 72,
      height: 72,
      justifyContent: "center",
      alignItems: "center",
    },
    playBtnInner: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    hintText: {
      ...typography.caption,
      color: theme.textSecondary,
      textAlign: "center",
      marginTop: spacing.xl,
      fontStyle: "italic",
    },
  });

export default WorkoutVideoPlayerModal;
