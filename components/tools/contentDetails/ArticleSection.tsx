import {
  View,
  Text,
  StyleSheet,
  View as RNView,
  ViewStyle,
} from "react-native";
import React, { forwardRef, useContext } from "react";
import ThemeContext from "@/context/ThemeContext";

interface ArticleSectionType {
  title: any;
  content: any;
  ref: any;
  style?: ViewStyle;
}

const ArticleSection = forwardRef<RNView, ArticleSectionType>(
  ({ title, content, style }, ref) => {
    const { newTheme } = useContext(ThemeContext);

    const styles = styling(newTheme);
    return (
      <View ref={ref} style={[{ marginBottom: 20 }, style]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionContent}>{content}</Text>
      </View>
    );
  }
);

export default ArticleSection;

const styling = (newTheme: any) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginVertical: 8,
      color: newTheme.textPrimary,
    },
    sectionContent: {
      fontSize: 15,
      lineHeight: 30,
      color: newTheme.textSecondary,
    },
  });
