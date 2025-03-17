import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { categories } from "@/constant/data/categoriesData";

const CategoryCard = ({ category }: any) => {
  return (
    <View style={[styles.card, { backgroundColor: category.backgroundColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>{category.title}</Text>
        <TouchableOpacity>
          <Text style={styles.allButton}>All {">"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDescription}>{category.description}</Text>
      <FlatList
        data={category.data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image source={item.image} style={styles.itemImage} />
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDuration}>{item.duration}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const SoundscapeCard = ({ category }: any) => {
  // Split data into rows of 3 items each
  const chunkedData = [];
  for (let i = 0; i < category.data.length; i += 3) {
    chunkedData.push(category.data.slice(i, i + 3));
  }

  return (
    <View style={[styles.card, { backgroundColor: category.backgroundColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>{category.title}</Text>
        <TouchableOpacity>
          <Text style={styles.allButton}>All {">"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDescription}>{category.description}</Text>
      <FlatList
        data={chunkedData}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.rowContainer}>
            {item.map((entry: any) => (
              <View key={entry.id} style={styles.itemRow}>
                <Image source={entry.image} style={styles.itemImage} />
                <View>
                  <Text style={styles.itemTitle}>{entry.title}</Text>
                  <Text style={styles.itemDuration}>{entry.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

const SleepModal = ({ visible, onClose }: any) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.screenTitle}>Better Sleep</Text>
          {categories.map((category) =>
            category.title === "Soundscape" ? (
              <SoundscapeCard key={category.title} category={category} />
            ) : (
              <CategoryCard key={category.title} category={category} />
            )
          )}
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Closee</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 20,
  },
  scrollView: {
    paddingHorizontal: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  card: {
    margin: 10,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  allButton: {
    fontSize: 14,
    color: "#007AFF",
  },
  rowContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginRight: 15,
  },
  itemRow: {
    // paddingRight: 90,
    // marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemTitle: {
    fontSize: 16,
  },
  itemDuration: {
    fontSize: 12,
    color: "#666",
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    margin: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default SleepModal;
