import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Animated,
} from "react-native";

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: any; // right-side image (character or illustration)
  backgroundColor?: string;
}

interface HorizontalBannerProps {
  data: BannerItem[];
  onPress: (id: string) => void;
}

const { width } = Dimensions.get("window");

const HorizontalBanner: React.FC<HorizontalBannerProps> = ({
  data,
  onPress,
}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
    setCurrentIndex(index);
  };

  return (
    <>
      <FlatList
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false, listener: handleScroll }
        )}
        renderItem={({ item }) => (
          <View
            style={[
              styles.banner,
              { backgroundColor: item.backgroundColor || "#fce4ec" },
            ]}
          >
            <View style={styles.leftContent}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onPress(item.id)}
              >
                <Text style={styles.buttonText}>{item.buttonText}</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={item.image}
              style={styles.rightImage}
              resizeMode="contain"
            />
          </View>
        )}
      />
      {/* Pagination dots */}
      <View style={styles.pagination}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: width - 50,
    height: 150,
    marginHorizontal: 5,
    borderRadius: 20,
    marginVertical: 20,
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
    padding: 15,
  },
  leftContent: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 13,
    color: "#000",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  rightImage: {
    width: 100,
    height: 160,
    marginLeft: 10,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "blue",
    width: 10,
    height: 10,
  },
});

export default HorizontalBanner;
