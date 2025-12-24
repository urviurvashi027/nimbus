import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";

import { getHabitType } from "@/services/habitService";

import { HabitType } from "@/types/habitTypes";

import styling from "./style/HabitInputStyle";
import SelectableListModal, {
  SelectableItem,
} from "../common/modal/SelectableListModal";

interface HabitTypeModalProps {
  onSelect: (id: number) => void;
  style?: StyleProp<ViewStyle>;
}

const HabitTypeInput: React.FC<HabitTypeModalProps> = ({ onSelect, style }) => {
  const [habitTypeList, setHabitTypeList] = useState<HabitType[]>([]);
  const [showHabitTypeModal, setShowHabitTypeModal] = useState(false);
  const [selectedHabitType, setSelectedHabitType] = useState<HabitType>();

  const { newTheme, spacing } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing);

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

  const typeOptions: SelectableItem[] = habitTypeList.map((t) => ({
    id: t.id,
    title: t.name,
    subtitle: t.description, // optional
  }));

  return (
    <>
      <TouchableOpacity
        style={[styles.rowItem, style]}
        onPress={() => setShowHabitTypeModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="sparkles-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>Habit intention</Text>
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

      <SelectableListModal
        visible={showHabitTypeModal}
        onClose={() => setShowHabitTypeModal(false)}
        title="Select habit intention"
        options={typeOptions}
        selectedId={selectedHabitType?.id ?? null}
        onSelect={(item) => {
          const picked = habitTypeList.find((x) => x.id === item.id);
          if (picked) setSelectedHabitType(picked);
          setShowHabitTypeModal(false);
        }}
      />

      {/* <TypeModal
        visible={showHabitTypeModal}
        onClose={() => setShowHabitTypeModal(false)}
        options={habitTypeList}
        selectedId={selectedHabitType?.id ?? null}
        onSelect={handleOnSelect}
      /> */}
    </>
  );
};

export default HabitTypeInput;
