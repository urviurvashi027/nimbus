import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { de } from "rn-emoji-keyboard";

interface CatalogListType {
  catalog: any;
  onPress: any;
}

const CatalogList: React.FC<CatalogListType> = ({ catalog, onPress }) => {
  console.log("from catalog List", catalog);
  return (
    <View>
      <Text style={styles.heading}>Catalog</Text>
      {catalog?.map((item: any, index: number) => (
        <TouchableOpacity key={index} onPress={() => onPress(item.id)}>
          <Text style={styles.link}>
            {index + 1}: {item.title} →
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CatalogList;

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#000",
  },
  link: {
    fontSize: 15,
    color: "#000",
    textDecorationLine: "underline",
    marginVertical: 6,
  },
});
