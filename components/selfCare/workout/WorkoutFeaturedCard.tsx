import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/theme/Colors";
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
const CARD_WIDTH = width * 0.9;

interface WorkoutFeaturedCardProps {
  item: any;
  onPress: (videoId: string, islocked: boolean, source: string) => void;
}

const WorkoutFeaturedCard: React.FC<WorkoutFeaturedCardProps> = ({
  item,
  onPress,
}) => {
  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  return (
    <>
      <Pressable
        style={styles.card}
        onPress={() => onPress(item.id, item.isLocked, item.source)}
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
            <Text style={styles.duration}> {item.duration || "3"} min</Text>
          </View>
        </ImageBackground>
      </Pressable>
    </>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
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
      // backgroundColor: "rgba(0,0,0,0.5)",
      // width: 100,
      // height: 100,
      borderRadius: 65,
      padding: 5,
    },
    imageBackground: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: newTheme.textSecondary,
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
      backgroundColor: newTheme.textPrimary,
    },
    duration: {
      fontSize: 11,
      backgroundColor: newTheme.textSecondary,
      marginTop: 4,
    },
  });

export default WorkoutFeaturedCard;
