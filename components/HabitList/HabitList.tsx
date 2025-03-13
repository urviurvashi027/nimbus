import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import SwipeableItem from "./SwipeableItem";
import { HabitItem } from "@/types/habitTypes";
import { router } from "expo-router";
import { deleteHabit } from "@/services/habitService";
import ActivityIndicatorModal from "../common/ActivityIndicatorModal";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import DatePanel from "@/components/homeScreen/DatePanel";
import { themeColors } from "@/constant/Colors";
import { ThemeKey } from "../Themed";
import Toast from "react-native-toast-message";
// import { ThemeKey } from "../Themed";

interface HabitListProps {
  data: Array<HabitItem>;
  style: any;
  refreshData: () => void;
}

const Separator = (props: any) => {
  const { style, ...otherProps } = props;
  return <View style={[style]} />;
};

const HabitList: React.FC<HabitListProps> = (props) => {
  const { style, data, refreshData, ...otherProps } = props;
  // api state
  // const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // const [isVisible, setisVisible] = useState<boolean>(false);

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);

  const styles = styling(theme);

  const habitItemClicked = (id: any) => {
    router.push({ pathname: "/habit/details", params: { id: id } });
  };

  // console.log("is loggong", isLoading);

  const deleteBackendCall = async (id: number) => {
    // console.log(id, typeof "id");
    // const result = await deleteHabit({id });
    // setIsLoading(true);
    try {
      const result = await deleteHabit(id);
      if (result?.success) {
        // setIsLoading(false);
        setShowSuccess(true);
        Toast.show({
          type: "success",
          text1: "Habit Deleted successfuly",
          position: "bottom",
        });
        // router.replace("/(auth)/(tabs)"); // Navigate on success
      }
    } catch (error: any) {
      // setIsLoading(false);
    }
  };

  const habitItemDeleted = (id: number) => {
    console.log(id, "refresh daye habit list");
    deleteBackendCall(id);
    refreshData();
  };

  // test

  // const onModalClick = () => {
  //   console.log("modal clicked");
  //   setisVisible(true);
  // };

  const handleOnSelect = (sm: any) => {
    console.log("sm:amy", sm);
  };

  // useEffect(() => {
  //   console.log(isVisible, "from index");
  // }, [isVisible]);
  return (
    <>
      {/* <StatusBar /> */}
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableItem
              item={item}
              habitItemDeleted={habitItemDeleted}
              habitItemClick={habitItemClicked}
            />
          )}
          ItemSeparatorComponent={() => <Separator style={style} />}
        />
      </SafeAreaView>
      {/* <TouchableOpacity style={styles.floatingButtonTow} onPress={onModalClick}>
        <Ionicons name="add" size={20} color={styles.iconColor.color} />
      </TouchableOpacity> */}
      {/* <HabitTypeModal
        habitTypeList={[]}
        visible={isVisible}
        onClose={() => setisVisible(false)}
        onSelect={handleOnSelect}
      /> */}
      {/* {isLoading && <ActivityIndicatorModal visible={isLoading} />} */}
    </>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    iconColor: {
      color: themeColors[theme].text,
    },
    floatingButtonTow: {
      position: "absolute",
      right: 100,
      bottom: 20,
      width: 40,
      height: 40,
      borderRadius: 30,
      backgroundColor: themeColors[theme].background,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: themeColors[theme].shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5,
    },
  });
export default HabitList;
