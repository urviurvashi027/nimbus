import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const JournalItem = ({ item, onPress }: any) => {
  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      disabled={item.locked}
      onPress={() => onPress(item.prompts, item.id)} // Trigger the passed function
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.description}>{item.description}</Text>
          {item.locked && (
            <Ionicons
              name="lock-closed"
              size={13}
              color={themeColors.basic.mediumGrey}
              style={styles.lockIcon}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
      // marginVertical: 6,
      // borderRadius: 12,
    },
    itemDetails: {
      flexDirection: "row",
    },
    lockIcon: {
      marginLeft: 5,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      color: themeColors[theme].text,
      fontWeight: "bold",
      marginBottom: 5,
    },
    description: {
      fontSize: 13,
      color: themeColors[theme].text,
    },
  });

export default JournalItem;
