// src/components/common/cards/ContentPosterCard.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";

export interface ContentPosterCardProps {
  title?: string;
  subtitle?: string;
  /** Can be { uri: string } or a local require(...) */
  image: ImageSourcePropType;
  tag?: string;
  /** Optional explicit height for staggered grids; otherwise uses aspectRatio */
  height?: number;
  onPress: () => void;
}

const ContentPosterCard: React.FC<ContentPosterCardProps> = ({
  title,
  subtitle,
  image,
  tag,
  height,
  onPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
  }, [imageLoaded, fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        height ? { height } : undefined,
        { opacity: fadeAnim },
      ]}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={0.9}
        onPress={onPress}
      >
        <ImageBackground
          source={image}
          style={styles.image}
          imageStyle={styles.imageRadius}
          onLoadEnd={() => setImageLoaded(true)}
        >
          {/* Soft overlay so text is legible on busy images */}
          <View style={styles.overlay} />

          {/* Optional tag chip */}
          {tag && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}

          {/* Title + subtitle at bottom */}
          {(title || subtitle) && (
            <View style={styles.content}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {subtitle ? (
                <Text style={styles.subtitle} numberOfLines={2}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
          )}

          {/* Image placeholder while loading */}
          {!imageLoaded && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#E5F5D8" />
            </View>
          )}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 8,
    borderRadius: 18,
    overflow: "hidden",
    // subtle Nimbus-style shadow
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    backgroundColor: "#101310", // fallback while image loads
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageRadius: {
    borderRadius: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  title: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(249,250,251,0.82)",
    fontSize: 12,
    marginTop: 2,
  },
  tag: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 15, 0.85)",
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#E5F5D8",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(6,10,6,0.45)",
  },
});

export default ContentPosterCard;
