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

type ThemeKey = "basic" | "light" | "dark";

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
