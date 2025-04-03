import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;

interface ForYouCardProps {
  item: any;
  onPress: (videoId: string, islocked: boolean, videoUrl: string) => void;
}

const ForYouCard: React.FC<ForYouCardProps> = ({ item, onPress }) => {
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);
  return (
    <>
      <Pressable
        style={styles.card}
        onPress={() => onPress(item.id, item.isLocked, item.videoUrl)}
      >
        <ImageBackground
          source={item.image}
          style={styles.imageBackground}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.playButton}>
            <Ionicons
              name="play-circle"
              size={50}
              color={themeColors.basic.commonWhite}
            />
          </View>
          <View style={styles.overlayContent}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.duration}>{item.duration}</Text>
          </View>
        </ImageBackground>
      </Pressable>
    </>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    card: {
      width: CARD_WIDTH,
      height: 150,
      borderRadius: 12,
      overflow: "hidden",
      marginVertical: 10,
      marginRight: 10,
      alignSelf: "center",
    },
    playButton: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      borderRadius: 25,
      padding: 5,
    },
    imageBackground: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "#ccc",
    },
    overlayContent: {
      backgroundColor: "rgba(255,255,255,0.6)",
      padding: 12,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: "700",
      color: "#000",
    },
    duration: {
      fontSize: 11,
      color: "#555",
      marginTop: 4,
    },
  });

export default ForYouCard;
