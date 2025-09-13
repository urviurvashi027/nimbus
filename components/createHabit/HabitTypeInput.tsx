import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";
import { themeColors } from "@/constant/theme/Colors";
import { getHabitType } from "@/services/habitService";
import { HabitType } from "@/types/habitTypes";
import { ThemeKey } from "../Themed";
// import HabitTypeModal from "./Modal/HabitTypeModal";
import styling from "./style/HabitInputStyle";
import TypeModal from "./Modal/TypeModal";
// import styling from "./style/HabitTypeInputStyle";

interface HabitTypeModalProps {
  onSelect: (id: number) => void;
}

const HabitTypeInput: React.FC<HabitTypeModalProps> = ({ onSelect }) => {
  const [habitTypeList, setHabitTypeList] = useState<HabitType[]>([]);
  const [showHabitTypeModal, setShowHabitTypeModal] = useState(false);
  const [selectedHabitType, setSelectedHabitType] = useState<HabitType>();

  const { theme, newTheme } = useContext(ThemeContext);
  const styles = styling(theme, newTheme);

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
    console.log(selectedHabitType, "selectedHabitType");
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
        style={styles.rowItem}
        onPress={() => setShowHabitTypeModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="ticket-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>Types</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue}>{selectedHabitType?.name}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textSecondary}
          />
        </View>
      </TouchableOpacity>

      <TypeModal
        visible={showHabitTypeModal}
        onClose={() => setShowHabitTypeModal(false)}
        options={habitTypeList}
        selectedId={selectedHabitType?.id ?? null}
        // selectedId={taskType?.id ?? null}
        onSelect={handleOnSelect}
      />

      {/* <HabitTypeModal
        habitTypeList={habitTypeList}
        visible={showHabitTypeModal}
        onClose={() => setShowHabitTypeModal(false)}
        onSelect={handleOnSelect}
      /> */}
    </>
  );
};

export default HabitTypeInput;
