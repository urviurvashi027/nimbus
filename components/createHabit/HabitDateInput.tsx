import {
  StyleProp,
  Text,
  ViewStyle,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";

import ThemeContext from "@/context/ThemeContext";
import { HabitDateType } from "@/types/habitTypes";
import styling from "./style/HabitInputStyle";
import StartDateModal from "./Modal/StartDateModal";

interface HabitDateInputProps {
  onSelect: (value: any) => void;
  isEditMode?: HabitDateType;
  style?: StyleProp<ViewStyle>;
}

const HabitDateInput: React.FC<HabitDateInputProps> = ({
  onSelect,
  style,
  isEditMode,
}) => {
  const { spacing, newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing);

  const [habitDate, setHabitDate] = useState<HabitDateType>({
    start_date: new Date(),
  });

  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  // ✅ keep local state in sync when parent sends edit data
  useEffect(() => {
    if (isEditMode) {
      setHabitDate({
        ...isEditMode,
        start_date: isEditMode.start_date
          ? new Date(isEditMode.start_date)
          : new Date(),
        end_date: isEditMode.end_date
          ? new Date(isEditMode.end_date)
          : undefined,
      });
    }
  }, [isEditMode]);

  const userDisplay = useMemo(() => {
    const start = habitDate.start_date
      ? new Date(habitDate.start_date)
      : new Date();
    const end = habitDate.end_date ? new Date(habitDate.end_date) : undefined;

    return end
      ? `${format(start, "dd-MM-yyyy")} - ${format(end, "dd-MM-yyyy")}`
      : `${format(start, "dd-MM-yyyy")}`;
  }, [habitDate]);

  const pushToParent = (hd: HabitDateType) => {
    const { start_date, end_date, ...rest } = hd;

    let result: any = end_date
      ? {
          start_date: format(new Date(start_date), "yyyy-MM-dd"),
          end_date: format(new Date(end_date), "yyyy-MM-dd"),
        }
      : {
          start_date: format(new Date(start_date), "yyyy-MM-dd"),
        };

    if (rest.frequency_type) {
      result = { ...result, ...rest };
    }

    onSelect(result);
  };

  const handleStartSave = (next: HabitDateType) => {
    setHabitDate(next);
    setShowStartTaskModal(false);
    pushToParent(next);
  };

  // ✅ initial push once (optional)
  useEffect(() => {
    pushToParent(habitDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TouchableOpacity
        style={[styles.rowItem, style]}
        onPress={() => setShowStartTaskModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="calendar-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>Start your journey</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue}>{userDisplay}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textSecondary}
          />
        </View>
      </TouchableOpacity>

      <StartDateModal
        visible={showStartTaskModal}
        onClose={() => setShowStartTaskModal(false)}
        isEditMode={habitDate} // ✅ always pass latest selection
        onSave={handleStartSave}
      />
    </>
  );
};

export default HabitDateInput;
