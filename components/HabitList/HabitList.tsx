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

export interface HabitItemProps {
  id: string;
  emoji: string;
  name: string;
  time: string;
  // isDone: boolean;
  //   onToggle: (isDone: boolean) => void;
}

interface HabitListProps {
  data: Array<HabitItemProps>;
}

const Separator = () => <View style={styles.itemSeparator} />;

const HabitList: React.FC<HabitListProps> = ({ data }) => {
  return (
    <>
      {/* <StatusBar /> */}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SwipeableItem {...item} />}
          ItemSeparatorComponent={() => <Separator />}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemSeparator: {
    flex: 1,
    height: 1,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
});
export default HabitList;
