import React from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";

// This type defines the structure of the nutrition data object
interface NutritionData {
  [key: string]: string; // Allows any string key with a string value
}

// This defines the props for our reusable component
interface NutritionInfoProps {
  title: string;
  data: NutritionData | null | undefined;
}

const NutritionInfo: React.FC<NutritionInfoProps> = ({ title, data }) => {
  // If no data is provided, the component will render nothing
  if (!data) {
    return null;
  }

  // Helper function to capitalize the first letter of a string
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* Object.entries() turns the object into an array of [key, value] pairs,
        which we can then map over to create our list.
      */}
      {Object.entries(data).map(([key, value]) => (
        <View style={styles.row} key={key}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.keyText}>{capitalize(key)}:</Text>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      ))}
    </View>
  );
};

export default NutritionInfo;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#555",
    marginRight: 10,
    lineHeight: 24, // Align bullet with text
  },
  keyText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginRight: 5,
    lineHeight: 24,
  },
  valueText: {
    fontSize: 16,
    color: "#555",
    flex: 1, // Allow text to wrap
    lineHeight: 24,
  },
});
