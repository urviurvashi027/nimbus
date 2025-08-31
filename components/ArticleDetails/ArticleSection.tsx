import { View, Text, StyleSheet, View as RNView } from "react-native";
import React, { forwardRef } from "react";

interface ArticleSectionType {
  title: any;
  content: any;
  ref: any;
}

const ArticleSection = forwardRef<RNView, ArticleSectionType>(
  ({ title, content }, ref) => (
    <View ref={ref} style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  )
);

export default ArticleSection;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#000",
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#444",
  },
});
