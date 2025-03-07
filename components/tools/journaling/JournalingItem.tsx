import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const JournalItem = ({ item, onPress }: any) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      disabled={item.locked}
      onPress={() => onPress(item.questions)} // Trigger the passed function
    >
      <Image source={item.icon} style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {item.locked ? "🔒 " : ""} {item.title}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  banner: {
    backgroundColor: "#2D3142",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    position: "relative",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bannerText: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  bannerImage: {
    width: 80,
    height: 80,
    position: "absolute",
    right: 15,
    bottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default JournalItem;
