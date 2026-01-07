import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  color?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  color = "#888",
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
  },
});

export default EmptyState;
