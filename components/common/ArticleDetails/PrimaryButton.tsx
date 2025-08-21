import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

interface PrimaryButtonType {
  title: string;
  onPress: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonType> = ({ title, onPress }) => {
  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: "center",
    flex: 1,
  },
  button: {
    width: "70%",
    paddingHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "blue",
  },
  buttonText: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: "center",
    alignContent: "center",
    textAlign: "center",
    color: "#fff",
  },
});
