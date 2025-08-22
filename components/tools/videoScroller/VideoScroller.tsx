import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import FullScreenVideoPlayer from "./component/fullScreenVideoPlayer/FullScreenVideoPlayer";
import VideoThumbnail from "./component/videoThumbnail/videoThumbnail";
import { getShortVideo } from "@/services/toolService";

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

// --- MOCK API SERVICE ---
const mockVideoData: VideoData[] = [
  {
    id: 1,
    title: "Me+ AI Helps You Generate Cleaning...",
    image: "https://placehold.co/300x450/EAD9D5/333?text=Me%2B+AI",
    source: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    views: "1M+ views",
  },
  {
    id: 2,
    title: "The FlyLady Cleaning Method",
    image: "https://placehold.co/300x450/D5E5EAD/333?text=The+FlyLady",
    source: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    views: "5M+ views",
  },
  {
    id: 3,
    title: "Minimalist Home Tour",
    image: "https://placehold.co/300x450/E5E0D5/333?text=Minimalist",
    source: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    views: "2.3M+ views",
  },
  {
    id: 4,
    title: "Deep Clean Your Kitchen",
    image: "https://placehold.co/300x450/D5D5E5/333?text=Kitchen+Clean",
    source: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    views: "800K+ views",
  },
];
// VideoScroller Component
const VideoScroller: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [isPlayerVisible, setPlayerVisible] = useState(false);

  useEffect(() => {
    const loadVideos = async () => {
      const views = ["800K+ views", "100K+ views", "900K+ views", "1M+ views"];

      try {
        const result = await getShortVideo();
        if (result && Array.isArray(result)) {
          const processedVideo = result.map((item: any) => {
            const randomTag = views[Math.floor(Math.random() * views.length)];
            return {
              ...item, // Spread operator to keep original properties
              views: randomTag,
            };
          });
          setVideos(processedVideo);
        }
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  const handleThumbnailPress = (video: VideoData) => {
    setSelectedVideo(video);
    setPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setPlayerVisible(false);
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#8E8E93"
        style={videoScrollerStyles.loader}
      />
    );
  }

  return (
    <View style={videoScrollerStyles.container}>
      <Text style={videoScrollerStyles.header}>To be Organized</Text>
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoThumbnail
            video={item}
            onPress={() => handleThumbnailPress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={videoScrollerStyles.listContentContainer}
      />
      <FullScreenVideoPlayer
        visible={isPlayerVisible}
        video={selectedVideo}
        onClose={handleClosePlayer}
      />
    </View>
  );
};

export default VideoScroller;

const videoScrollerStyles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1C1C1E",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Avenir-Heavy" : "Roboto-Bold",
  },
  listContentContainer: {},
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
