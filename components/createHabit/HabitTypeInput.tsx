import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/Colors";
import { getHabitType } from "@/services/habitService";
import { HabitType } from "@/types/habitTypes";
import { ThemeKey } from "../Themed";
import HabitTypeModal from "./Modal/HabitTypeModal";

interface HabitTypeModalProps {
  onSelect: (id: number) => void;
}

const HabitTypeInput: React.FC<HabitTypeModalProps> = ({ onSelect }) => {
  const [habitTypeList, setHabitTypeList] = useState<HabitType[]>([]);
  const [showHabitTypeModal, setShowHabitTypeModal] = useState(false);
  const [selectedHabitType, setSelectedHabitType] = useState<HabitType>();

  const { theme, toggleTheme, useSystemTheme } = useContext(ThemeContext);
  const styles = styling(theme);

  const getHabitTypeList = async () => {
    const result = await getHabitType();
    if (result && result.success) {
      setHabitTypeList(result.data);
    }
    if (result && result.error) {
      alert(result.error);
    }
  };

  useEffect(() => {
    getHabitTypeList();
  }, []);

  useEffect(() => {
    if (habitTypeList.length) {
      setSelectedHabitType(habitTypeList[0]);
    }
  }, [habitTypeList]);

  const handleOnSelect = (selectedHabitType: HabitType) => {
    const { id, name, ...rest } = selectedHabitType;
    setSelectedHabitType(selectedHabitType);
    onSelect(id);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowHabitTypeModal(true)}
      >
        <Ionicons
          style={styles.iconLeft}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
        <Text style={styles.label}>Type</Text>
        <Text style={styles.selectorText}>{selectedHabitType?.name}</Text>
        <Ionicons
          style={styles.iconRight}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
      </TouchableOpacity>

      <HabitTypeModal
        habitTypeList={habitTypeList}
        visible={showHabitTypeModal}
        onClose={() => setShowHabitTypeModal(false)}
        onSelect={handleOnSelect}
      />
    </>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    label: {
      fontSize: 16,
      marginBottom: 5,
      marginTop: 5,
      marginRight: 5,
      color: themeColors.basic.mediumGrey,
      width: "50%",
    },
    selectorButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 5,
      // marginBottom: 10,
      width: "100%",
    },
    selectorText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
      paddingLeft: 30,
      margin: "auto",
    },
    iconLeft: {
      padding: 0,
      marginRight: 5,
    },
    iconRight: {
      // marginLeft: 9,
      // width: "5%",
    },
  });

export default HabitTypeInput;
