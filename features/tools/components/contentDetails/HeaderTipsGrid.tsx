import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";

interface HeaderTipsGridType {
  tips: any;
}

const HeaderTipsGrid: React.FC<HeaderTipsGridType> = ({ tips }) => {
  console.log(tips.icon, "header article");
  return (
    <View style={styles.grid}>
      {/* {tips.map((tip: any, index: number) => ( */}
      <View style={styles.item}>
        <Image source={tips.image} style={styles.icon} />
        {/* <Text style={styles.label}>{tips.label}</Text> */}
      </View>
      {/* ))} */}
    </View>
  );
};

export default HeaderTipsGrid;

const styles = StyleSheet.create({
  grid: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    backgroundColor: "#FFF4D9",
    // padding: 12,
    borderRadius: 12,
    // justifyContent: "space-between",
    marginBottom: 20,
  },
  item: {
    width: "100%",
    // alignItems: "center",
    marginVertical: 10,
  },
  icon: {
    width: "100%",
    height: 400,
    marginBottom: 6,
  },
  label: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
});
