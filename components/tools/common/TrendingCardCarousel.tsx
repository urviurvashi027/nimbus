import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

interface CardData {
  id: string;
  title?: string;
  image: any; // require() or { uri: '' }
}

interface TrendingCardCarouselProps {
  title: string;
  type: string;
  data: CardData[];
  onPress: (id: string, type: string) => void;
  onClickOfAll?: () => void;
}

const { width } = Dimensions.get("window");

const TrendingCardCarousel: React.FC<TrendingCardCarouselProps> = ({
  title,
  data,
  type,
  onPress,
  onClickOfAll,
}) => {
  const { theme, newTheme, toggleTheme, useSystemTheme } =
    useContext(ThemeContext);

  const styles = styling(theme, newTheme);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity onPress={onClickOfAll}>
          <Text style={styles.seeAll}>All ➤</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 0 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPress(item.id, type)}
            style={styles.cardWrapper}
          >
            <ImageBackground
              source={item.image}
              style={styles.card}
              imageStyle={styles.cardImage}
            >
              {item.title && type === "test" && (
                <Text style={styles.cardTitle}>{item.title}</Text>
              )}
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    container: {
      marginVertical: 30,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      color: newTheme.textPrimary,
      fontWeight: "bold",
    },
    seeAll: {
      fontSize: 14,
      color: newTheme.textSecondary,
    },
    cardWrapper: {
      marginRight: 20,
      // backgroundColor: "red",
      borderRadius: 20,
      width: width * 0.55,
      height: width * 0.75,
    },
    card: {
      width: width * 0.55,
      height: width * 0.75,
      borderRadius: 20,
      overflow: "hidden",
      justifyContent: "flex-end",
      // padding: 10,
    },
    cardImage: {
      borderRadius: 20,
      resizeMode: "cover",
    },
    cardTitle: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
      backgroundColor: "rgba(0,0,0,0.3)",
      padding: 5,
      borderRadius: 5,
      alignSelf: "flex-start",
    },
  });

export default TrendingCardCarousel;
