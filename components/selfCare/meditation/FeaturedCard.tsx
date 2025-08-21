import { ThemeKey } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window"); // get screen width
const CARD_WIDTH = width * 0.8; // 80% of screen width

interface itemDetails {
  id: string;
  title: string;
  duration: string;
  description?: string;
  image: any; // Replace with actual image
  source: any; // Replace with actual audio
  category: string;
  isLocked: boolean;
  // color?: any;
}

interface MeditationFeauturedCardProps {
  data: itemDetails;
  onPress: (data: itemDetails) => void;
}

const GuidedMeditationCard: React.FC<MeditationFeauturedCardProps> = ({
  data,
  onPress,
}) => {
  const { image, title, duration, description } = data;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);
  return (
    <Pressable onPress={() => onPress(data)} style={styles.card}>
      <View>
        <View style={styles.content}>
          <Image
            source={image} // Replace with your image URL
            style={styles.avatar}
          />
          <View style={styles.textContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    card: {
      marginVertical: 20,
      backgroundColor: "#000",
      borderRadius: 15,
      marginRight: 16,
      width: CARD_WIDTH, // controlled card width
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 80,
      height: 80,
      marginTop: 10,
      marginLeft: 10,
      borderRadius: 30,
      marginRight: 12,
    },
    textContent: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
    },
    duration: {
      fontSize: 13,
      color: "#888",
      marginTop: 2,
    },
    footer: {
      backgroundColor: "red",
      padding: 15,
      borderRadius: 10,
      marginTop: 12,
    },
    description: {
      color: "white",
      fontSize: 13,
    },
  });

export default GuidedMeditationCard;
