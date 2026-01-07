// RoutineCard.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";

interface RoutineCardProps {
  title?: string;
  subtitle?: string;
  image: any;
  tag?: string;
  height: number; // custom height for staggered effect
  onPress: () => void;
}

const ArticleCard: React.FC<RoutineCardProps> = ({
  title,
  subtitle,
  image,
  tag,
  height,
  onPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { height, opacity: fadeAnim }]}>
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <ImageBackground
          source={image}
          style={styles.image}
          imageStyle={{ borderRadius: 15 }}
        >
          {tag && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          )}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    margin: 8,
  },
  image: {
    flex: 1,
    justifyContent: "space-between",
    padding: 10,
  },
  content: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#fff",
    fontSize: 12,
    marginTop: 2,
  },
  tag: {
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  tagText: {
    fontSize: 10,
    color: "#333",
    fontWeight: "bold",
  },
});

export default ArticleCard;
