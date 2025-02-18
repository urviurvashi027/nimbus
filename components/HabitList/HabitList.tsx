import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
} from "react-native";
import React from "react";
import SwipeableItem from "./SwipeableItem";
import { HabitItem } from "@/types/habitTypes";
import { router } from "expo-router";
// import { ThemeKey } from "../Themed";

interface HabitListProps {
  data: Array<HabitItem>;
  style: any;
}

const Separator = (props: any) => {
  const { style, ...otherProps } = props;
  return <View style={[style]} />;
};

const habitItemClicked = (id: any) => {
  console.log("HabitList:: habitItemClicked", id);
  router.push({ pathname: "/habit/details", params: { id: id } });
};

const HabitList: React.FC<HabitListProps> = (props) => {
  const { style, data, ...otherProps } = props;
  return (
    <>
      {/* <StatusBar /> */}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableItem item={item} habitItemClick={habitItemClicked} />
          )}
          ItemSeparatorComponent={() => <Separator style={style} />}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default HabitList;
