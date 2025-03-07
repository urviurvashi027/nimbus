import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const categories = ["All", "Stress & Anxiety", "Self-Care", "Beginner"];

type Meditations = {
  id: string;
  title: string;
  duration: string;
  description?: string;
  image: any; // Replace with actual image
  source: any; // Replace with actual audio
  category: string;
};

const meditations = [
  {
    id: "1",
    title: "Accept Yourself",
    duration: "10 min",
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../../../assets/images/soundscape/lightRain.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    category: "All",
  },
  {
    id: "2",
    title: "Anxiety release",
    duration: "10 min",
    image: require("../../../../assets/images/soundscape/lightRain.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    category: "Stress & Anxiety",
  },
  {
    id: "3",
    title: "🧘 Find Inner Strength in 5 minutes.",
    duration: "5 min",
    image: require("../../../../assets/images/soundscape/lightRain.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    category: "Self-Care",
  },
  {
    id: "4",
    title: "Deal with work stress",
    duration: "10 min",
    // image: require("./assets/work_stress.jpg"),
    description:
      "Feeling unconditional love and acceptance towards yourself and the world",
    image: require("../../../../assets/images/soundscape/lightRain.png"), // Replace with actual image
    source: require("../../../../assets/audio/soundscape/lightRain.mp3"),
    category: "All",
  },
];

const Meditation = () => {
  const [currentCategory, setCurrentCategory] = useState("All");
  const [currentTrack, setCurrentTrack] = useState<Meditations | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const handlePlayPause = async (track: Meditations) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        await sound?.pauseAsync();
      } else {
        await sound?.playAsync();
      }
      setIsPlaying(!isPlaying);
      return;
    }

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(track.source);
    setSound(newSound);
    setCurrentTrack(track);
    setIsPlaying(true);
    await newSound.playAsync();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Meditate</Text>
      <Text style={styles.subHeader}>Find peace through meditation.</Text>

      {/* Featured Section */}
      <View style={styles.featuredCard}>
        <Image
          source={require("../../../../assets/images/reflection.png")}
          style={styles.featuredImage}
        />
        <View style={styles.featuredTextContainer}>
          <Text style={styles.featuredTitle}>Accept Yourself</Text>
          <Text style={styles.featuredDuration}>10 min</Text>
          <Text style={styles.featuredDescription}>
            Feeling unconditional love and acceptance towards yourself and the
            world
          </Text>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setCurrentCategory(category)}
            style={[
              styles.tab,
              currentCategory === category && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                currentCategory === category && styles.activeTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Meditation List */}
      <FlatList
        data={meditations.filter(
          (item) =>
            item.category === currentCategory || currentCategory === "All"
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => handlePlayPause(item)}
          >
            <Image source={item.image} style={styles.listImage} />
            <View style={styles.listText}>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listDuration}>{item.duration}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Bottom Audio Player */}
      {currentTrack && (
        <View style={styles.bottomPlayer}>
          <Image source={currentTrack.image} style={styles.playerImage} />
          <View style={styles.playerText}>
            <Text style={styles.playerTitle}>{currentTrack.title}</Text>
            <Text style={styles.playerDuration}>
              {currentTrack.duration} · Meditation
            </Text>
          </View>
          <TouchableOpacity onPress={() => handlePlayPause(currentTrack)}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentTrack(null)}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 26, fontWeight: "bold" },
  subHeader: { fontSize: 16, color: "#777", marginBottom: 20 },
  featuredCard: { backgroundColor: "#EEE", borderRadius: 10, padding: 12 },
  featuredImage: { width: "100%", height: 120, borderRadius: 10 },
  featuredTextContainer: { padding: 10 },
  featuredTitle: { fontSize: 18, fontWeight: "bold" },
  featuredDuration: { fontSize: 14, color: "#555" },
  featuredDescription: { fontSize: 14, color: "#666" },
  tabsContainer: { flexDirection: "row", marginVertical: 15 },
  tab: {
    marginRight: 15,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#6C5CE7" },
  tabText: { fontSize: 16, color: "#777" },
  activeTabText: { color: "#6C5CE7" },
  listItem: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  listImage: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  listText: { flex: 1 },
  listTitle: { fontSize: 16, fontWeight: "bold" },
  listDuration: { fontSize: 14, color: "#777" },
  bottomPlayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#333",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  playerImage: { width: 50, height: 50, borderRadius: 10 },
  playerText: { flex: 1, marginLeft: 10 },
  playerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  playerDuration: { color: "#ccc", fontSize: 14 },
});

export default Meditation;
