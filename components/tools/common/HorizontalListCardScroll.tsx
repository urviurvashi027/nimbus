import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import { TrackType } from "@/constant/data/soundtrack";

interface PropType {
  backgroundColor: string;
  title: string;
  description: string;
  itemList: Array<TrackType | any>;
  onClickOfAll: () => void;
}

const HorizontalListCardScroll: React.FC<PropType> = (props) => {
  const { backgroundColor, title, description, onClickOfAll, itemList } = props;
  // console.log(itemList, "itemList");

  // Split data into rows of 3 items each
  const chunkedData = [];
  for (let i = 0; i < itemList.length; i += 3) {
    chunkedData.push(itemList.slice(i, i + 3));
  }

  console.log(chunkedData, backgroundColor, "chunkedData");

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme, backgroundColor);

  return (
    <View style={[styles.card, { backgroundColor: backgroundColor }]}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>{title}</Text>
        <TouchableOpacity onPress={onClickOfAll}>
          <Text style={styles.allButton}>All {">"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <FlatList
        data={chunkedData}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.rowContainer}>
            {item.map((entry: any) => (
              <View key={entry.id} style={styles.itemRow}>
                <Image source={entry.image} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{entry.title}</Text>
                  <Text style={styles.itemDuration}>{entry.duration}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default HorizontalListCardScroll;

const styling = (theme: ThemeKey, color: string) =>
  StyleSheet.create({
    card: {
      margin: 10,
      borderRadius: 15,
      padding: 15,
      borderWidth: 1,
      // backgroundColor: color,
      borderColor: color,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 5,
      color: themeColors.basic.mediumGrey,
    },
    cardDescription: {
      fontSize: 14,
      color: themeColors.basic.commonBlack,
      marginBottom: 10,
    },
    allButton: {
      fontSize: 14,
      color: themeColors.basic.commonBlack,
    },
    rowContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      // paddingVertical: 8,
      // paddingHorizontal: 10,
      backgroundColor: color,
      borderRadius: 10,
      marginRight: 15,
    },
    itemRow: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      // paddingVertical: 10,
      minWidth: 250,
      // paddingHorizontal: 10,
      // borderBottomWidth: 1,
      // borderBottomColor: "#ddd",
    },
    itemInfo: {
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      marginRight: 5,
    },
    startButton: {
      alignSelf: "center",
      marginVertical: 30,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: "#7A4DF3",
      justifyContent: "center",
      alignItems: "center",
      elevation: 5,
    },
    startButtonText: {
      color: "white",
      fontSize: 24,
      fontWeight: "bold",
    },
    startButtonSubText: {
      color: "white",
      fontSize: 14,
      marginTop: 5,
    },
    itemImage: {
      width: 80,
      height: 80,
      // borderRadius: 25,
      marginRight: 5,
    },
    itemTitle: {
      fontSize: 16,
    },
    itemDuration: {
      fontSize: 12,
      color: "#666",
    },
  });
