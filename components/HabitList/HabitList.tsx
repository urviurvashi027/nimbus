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
// import { ThemeKey } from "../Themed";

interface HabitListProps {
  data: Array<HabitItem>;
  style: any;
}

const Separator = (props: any) => {
  const { style, ...otherProps } = props;
  return <View style={[style]} />;
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
          renderItem={({ item }) => <SwipeableItem {...item} />}
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
