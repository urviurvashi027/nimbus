import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video"; // ✅ Import correct expo-video hooks

import { router, useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { ScreenView, ThemeKey } from "@/components/Themed";

const fitnessVideos = {
  forYou: [
    {
      id: "1",
      title: "Quick Chest Workout",
      duration: "10 min",
      image: "https://your-image-url.com/chest.jpg",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    },
  ],
  all: [
    {
      id: "2",
      title: "Easy Abs Workout for Beginners",
      duration: "10 min",
      image: "https://your-image-url.com/abs.jpg",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      id: "3",
      title: "Quick Back Workout",
      duration: "13 min",
      image: "https://your-image-url.com/back.jpg",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    },
  ],
};

const FitnessVideoList = () => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(
    fitnessVideos.forYou[0].videoUrl
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // ✅ Initialize Video Player with first video
  const player = useVideoPlayer(currentVideoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  const handlePlayVideo = (videoId: string, videoUrl: string) => {
    setPlayingVideoId(videoId);
    setCurrentVideoUrl(videoUrl);
    setIsPlaying(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    player.currentTime += 10;
  };

  const skipBackward = () => {
    player.currentTime -= 10;
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const renderVideoItem = ({ item }: any) => {
    const isPlayingThis = playingVideoId === item.id;

    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={() => handlePlayVideo(item.id, item.videoUrl)}
      >
        {isPlayingThis ? (
          <TouchableOpacity
            onPress={openFullscreen}
            style={styles.videoContainer}
          >
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
              </View>
            )}
            <VideoView
              style={styles.videoPlayer}
              player={player}
              allowsFullscreen
              allowsPictureInPicture
            />
          </TouchableOpacity>
        ) : (
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.videoThumbnail}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.playButton}>
              <Ionicons
                name="play-circle"
                size={30}
                color={themeColors[theme].text}
              />
            </View>
          </ImageBackground>
        )}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDuration}>{item.duration}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={themeColors[theme].text}
          />
        </TouchableOpacity>
        <ScrollView>
          <Text style={styles.header}>Workout</Text>
          <Text style={styles.subHeader}>
            Make workouts part of your daily life.
          </Text>

          <Text style={styles.sectionTitle}>For you</Text>
          <FlatList
            data={fitnessVideos.forYou}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Text style={styles.sectionTitle}>All</Text>
          <FlatList
            data={fitnessVideos.all}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />

          {/* Fullscreen Modal */}
          <Modal
            visible={isFullscreen}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeFullscreen}
              >
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>

              <VideoView
                style={styles.fullscreenVideo}
                player={player}
                allowsFullscreen
                allowsPictureInPicture
              />

              <View style={styles.fullscreenControls}>
                <TouchableOpacity onPress={skipBackward}>
                  <Ionicons name="play-back" size={40} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={togglePlayPause}>
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={50}
                    color="#fff"
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={skipForward}>
                  <Ionicons name="play-forward" size={40} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 20 },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    header: {
      fontSize: 26,
      fontWeight: "bold",
      marginTop: 20,
      color: themeColors[theme].text,
    },
    subHeader: {
      fontSize: 14,
      color: themeColors[theme].text,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      color: themeColors[theme].text,
    },
    videoItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      width: "100%",
      // borderBottomWidth: 1,
      // paddingBottom: 5,
      // borderBottomColor: themeColors[theme].divider,
    },
    videoThumbnail: {
      width: 120,
      height: 70,
      justifyContent: "center",
      alignItems: "center",
      // borderBottomWidth: 4,
      // borderBottomColor: themeColors[theme].divider,
    },
    playButton: {
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 25,
      padding: 5,
    },
    videoInfo: {
      marginLeft: 10,
      flex: 1,
      padding: 20,
      paddingBottom: 10,
      borderBottomWidth: 1,

      // paddingBottom: 5,
      borderBottomColor: themeColors[theme].divider,
    },
    videoTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    videoDuration: { fontSize: 14, color: "#777" },
    videoContainer: {
      width: 120,
      height: 70,
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
    },
    videoPlayer: { width: "100%", height: "100%" },
    loadingOverlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 10,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "#000",
      justifyContent: "center",
      alignItems: "center",
    },
    closeButton: { position: "absolute", top: 30, right: 20 },
    fullscreenVideo: { width: "100%", height: 300 },
    fullscreenControls: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      width: "80%",
      marginTop: 20,
    },
  });

export default FitnessVideoList;
