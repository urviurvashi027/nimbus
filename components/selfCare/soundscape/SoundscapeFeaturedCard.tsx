import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";

import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { SoundscapeListItem } from "@/types/toolsTypes";

const { width } = Dimensions.get("window"); // get screen width
const CARD_WIDTH = width * 0.8; // 80% of screen width

// TODO: need to replace it with actual types
interface itemDetails {
  id: string;
  title: string;
  duration: string;
  description: string;
  image: any; // Image source (can be refined later)
  source: any; // Audio source (can be refined later)
  category: string;
  isLocked: boolean;
  // color: any;
}

interface SoundscapeFeauturedCardProps {
  data: itemDetails;
  onPress: (data: itemDetails) => void;
  cardColor: {
    bgColor: string;
    color: string;
  };
}

const SoundscapeFeaturedCard: React.FC<SoundscapeFeauturedCardProps> = ({
  data,
  onPress,
  cardColor,
}) => {
  const { image, title, duration, description } = data;
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme, cardColor);
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
            <Text style={styles.duration}> {duration || "3"} min</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.description}>
            {description} - Need to add description testing data
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styling = (
  theme: ThemeKey,
  cardColor: { bgColor: string; color: string }
) =>
  StyleSheet.create({
    card: {
      marginVertical: 20,
      backgroundColor: cardColor.bgColor,
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
      color: themeColors[theme].text,
      marginTop: 2,
    },
    footer: {
      backgroundColor: cardColor.color,
      padding: 15,
      borderRadius: 10,
      marginTop: 12,
    },
    description: {
      color: themeColors[theme].text,
      // color: "white",
      fontSize: 13,
    },
  });

export default SoundscapeFeaturedCard;
