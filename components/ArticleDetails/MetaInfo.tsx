// components/MetaInfo.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface MetaInfoType {
  points: any;
  time: any;
}

const MetaInfo: React.FC<MetaInfoType> = ({ points, time }) => (
  <View style={styles.container}>
    <View style={styles.item}>
      <FontAwesome name="star" size={14} color="#888" />
      <Text style={styles.text}>{points} Points</Text>
    </View>
    <View style={styles.item}>
      <FontAwesome name="clock-o" size={14} color="#888" />
      <Text style={styles.text}>{time}</Text>
    </View>
  </View>
);

export default MetaInfo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 6,
    justifyContent: "center",
    gap: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
});
