// components/AuthorCard.js
import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface AuthorCardType {
  author: any;
}

const AuthorCard: React.FC<AuthorCardType> = ({ author }) => {
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);
  return (
    <View style={styles.card}>
      {/* <Image source={{ uri: author.avatar }} style={styles.avatar} /> */}
      <View style={styles.info}>
        <Text style={styles.name}>{author.name ?? "Test Name"}</Text>
        <Text style={styles.role}>{author.role ?? "Test Role"}</Text>
      </View>
    </View>
  );
};

export default AuthorCard;

const styling = (newTheme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: newTheme.accent,
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
      color: newTheme.background,
    },
    role: {
      fontSize: 13,
      color: newTheme.background,
    },
  });
