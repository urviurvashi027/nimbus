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
  const { newTheme } = useContext(ThemeContext);

  const styles = styling(newTheme);

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

const styling = (theme: any) =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
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
      color: theme.textPrimary,
      fontWeight: "bold",
      marginBottom: 5,
    },
    description: {
      fontSize: 13,
      color: theme.textSecondary,
    },
  });

export default JournalItem;
