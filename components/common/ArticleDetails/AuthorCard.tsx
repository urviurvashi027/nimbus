// components/AuthorCard.js
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface AuthorCardType {
  author: any;
}

const AuthorCard: React.FC<AuthorCardType> = ({ author }) => {
  return (
    <View style={styles.card}>
      {/* <Image source={{ uri: author.avatar }} style={styles.avatar} /> */}
      <View style={styles.info}>
        <Text style={styles.name}>{author.name}</Text>
        <Text style={styles.role}>{author.role}</Text>
      </View>
    </View>
  );
};

export default AuthorCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F0FF",
    padding: 12,
    borderRadius: 10,
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  info: {
    marginLeft: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  role: {
    fontSize: 13,
    color: "#666",
  },
});
