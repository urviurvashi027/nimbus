import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";

import { getAudioBookList } from "@/services/toolService";
import AudiobookThumbnail from "./components/AudiobookThumbnail";
import FullScreenAudioPlayer from "./components/FullScreenAudioPlayer";

// --- TYPES ---
export interface AudiobookData {
  id: string;
  title: string;
  coach_name: string;
  coverImageUrl: string;
  audioUrl: string;
  duration: string;
}

// AudiobookScroller Component
const AudiobookScroller: React.FC = () => {
  const [audiobooks, setAudiobooks] = useState<AudiobookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudiobook, setSelectedAudiobook] =
    useState<AudiobookData | null>(null);
  const [isPlayerVisible, setPlayerVisible] = useState(false);

  useEffect(() => {
    const loadAudiobooks = async () => {
      try {
        const result = await getAudioBookList(); // Assume this fetches the data

        if (result && Array.isArray(result)) {
          // Map the API response to match the AudiobookData interface
          const processedAudiobooks: AudiobookData[] = result.map(
            (item: any) => {
              return {
                id: item.id.toString(), // Convert number to string
                title: item.title,
                coach_name: "Unknown Author", // Add a placeholder since it's missing
                coverImageUrl: item.image, // Map 'image' to 'coverImageUrl'
                audioUrl: item.source, // Map 'source' to 'audioUrl'
                duration: `${item.duration}m`, // Convert number to a string format
              };
            }
          );

          setAudiobooks(processedAudiobooks); // Set state with the corrected data
        }
      } catch (error) {
        console.error("Failed to fetch audiobooks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAudiobooks();
  }, []);

  const handleThumbnailPress = (audiobook: AudiobookData) => {
    setSelectedAudiobook(audiobook);
    setPlayerVisible(true);
  };

  const handleClosePlayer = () => {
    setPlayerVisible(false);
    setSelectedAudiobook(null);
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#8E8E93"
        style={scrollerStyles.loader}
      />
    );
  }

  return (
    <View style={scrollerStyles.container}>
      <Text style={scrollerStyles.header}>Listen Again</Text>
      <FlatList
        data={audiobooks}
        renderItem={({ item }) => (
          <AudiobookThumbnail
            audiobook={item}
            onPress={() => handleThumbnailPress(item)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={scrollerStyles.listContentContainer}
      />
      <FullScreenAudioPlayer
        visible={isPlayerVisible}
        audiobook={selectedAudiobook}
        onClose={handleClosePlayer}
      />
    </View>
  );
};

export default AudiobookScroller;

const scrollerStyles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    fontSize: 24,
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
