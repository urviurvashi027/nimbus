import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

type VideoClassCardType = {
  title: string;
  // source: any;
  coachName: string;
  thumbnail: any;
  onPress: () => void;
};

const MasterclassCard: React.FC<VideoClassCardType> = ({
  title,
  coachName,
  thumbnail,
  onPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={thumbnail} style={styles.image} />
        <Text style={styles.courses}>9 courses</Text>
        <Text style={styles.adhdText}>ADHD</Text>
      </View>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.coach}>
            Coach: <Text style={styles.coachName}>{coachName}</Text>
          </Text>
        </View>
        <View>
          <TouchableOpacity style={styles.playButton} onPress={onPress}>
            <Text style={styles.playText}>Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MasterclassCard;

const styles = StyleSheet.create({
  card: {
    padding: 0,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E8F2FF",
    marginRight: 16,
    width: 250,
  },
  imageWrapper: {
    position: "relative",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  courses: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "#fff",
    fontSize: 14,
  },
  adhdText: {
    position: "absolute",
    fontSize: 48,
    fontWeight: "bold",
    color: "rgba(186, 154, 255, 0.8)",
    textAlign: "center",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  coach: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  coachName: {
    fontWeight: "600",
  },
  playButton: {
    // marginTop: 10,
    // position: "absolute",
    marginLeft: 10,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    // alignSelf: "flex-start",
  },
  playText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
});
