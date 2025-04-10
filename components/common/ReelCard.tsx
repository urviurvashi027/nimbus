// ReelCard.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";

interface ReelCardProps {
  thumbnail: any; // require() or { uri: '' }
  badgeText: string;
  title: string;
  views: string;
  onPress: () => void;
}

const { width } = Dimensions.get("window");

const ReelCard: React.FC<ReelCardProps> = ({
  thumbnail,
  badgeText,
  title,
  views,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ImageBackground
        source={thumbnail}
        style={styles.thumbnail}
        imageStyle={{ borderRadius: 20 }}
      >
        <View style={styles.playIcon} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>
          <Text style={styles.views}>{views} views</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.6,
    aspectRatio: 0.65,
    marginRight: 15,
    borderRadius: 20,
    overflow: "hidden",
  },
  thumbnail: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 12,
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#ffffffaa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#000",
  },
  textContainer: {
    marginTop: 4,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  views: {
    color: "#ddd",
    fontSize: 12,
    marginTop: 2,
  },
  playIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffffaa",
  },
});

export default ReelCard;
