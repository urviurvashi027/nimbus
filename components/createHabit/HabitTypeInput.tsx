import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/theme/Colors";
import { getHabitType } from "@/services/habitService";
import { HabitType } from "@/types/habitTypes";
import { ThemeKey } from "../Themed";
import HabitTypeModal from "./Modal/HabitTypeModal";
import styling from "./style/HabitInputStyle";
// import styling from "./style/HabitTypeInputStyle";

interface HabitTypeModalProps {
  onSelect: (id: number) => void;
}

const HabitTypeInput: React.FC<HabitTypeModalProps> = ({ onSelect }) => {
  const [habitTypeList, setHabitTypeList] = useState<HabitType[]>([]);
  const [showHabitTypeModal, setShowHabitTypeModal] = useState(false);
  const [selectedHabitType, setSelectedHabitType] = useState<HabitType>();

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  const getHabitTypeList = async () => {
    const result = await getHabitType();
    if (result && result.success) {
      setHabitTypeList(result.data);
      setSelectedHabitType(result.data[0]);
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
  };

  useEffect(() => {
    if (selectedHabitType) {
      const { id, name, ...rest } = selectedHabitType;
      onSelect(id);
    }
  }, [selectedHabitType]);

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowHabitTypeModal(true)}
      >
        <Ionicons
          style={styles.iconLeft}
          name="ticket-outline"
          size={20}
          color={themeColors[theme].text}
        />
        <View style={styles.inputField}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.selectorText}>{selectedHabitType?.name}</Text>
        </View>
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

export default HabitTypeInput;
