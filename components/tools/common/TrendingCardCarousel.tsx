// TrendingCardCarousel.tsx
import React from "react";
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
  data: CardData[];
  onPress: (id: string) => void;
}

const { width } = Dimensions.get("window");

const TrendingCardCarousel: React.FC<TrendingCardCarouselProps> = ({
  title,
  data,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>All ➤</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPress(item.id)}
            style={styles.cardWrapper}
          >
            <ImageBackground
              source={item.image}
              style={styles.card}
              imageStyle={styles.cardImage}
            >
              {item.title && <Text style={styles.cardTitle}>{item.title}</Text>}
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    color: "#666",
  },
  cardWrapper: {
    marginRight: 20,
  },
  card: {
    width: width * 0.55,
    height: width * 0.75,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: 10,
  },
  cardImage: {
    borderRadius: 20,
    resizeMode: "cover",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
});

export default TrendingCardCarousel;
