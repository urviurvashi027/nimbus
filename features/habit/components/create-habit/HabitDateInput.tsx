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

import ThemeContext from "@/contexts/ThemeContext";
import { HabitDateType } from "@/features/habit/types/habitTypes";
import { formatProtocolFrequencySummary } from "@/features/habit/utils/protocolDisplay";
import { fromApiDate, toApiDate } from "@/utils/date-time";
import styling from "./style/HabitInputStyle";
import StartDateModal from "./Modal/StartDateModal";

interface HabitDateInputProps {
  onSelect: (value: any) => void;
  isEditMode?: HabitDateType;
  style?: StyleProp<ViewStyle>;
  label?: string;
}

const HabitDateInput: React.FC<HabitDateInputProps> = ({
  onSelect,
  style,
  isEditMode,
  label = "Start your journey",
}) => {
  const { spacing, newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing);

  const [habitDate, setHabitDate] = useState<HabitDateType>({
    start_date: new Date(),
  });

  const [showStartTaskModal, setShowStartTaskModal] = useState(false);

  const asDate = (value?: Date | string | null) => {
    if (!value) return undefined;
    return value instanceof Date ? value : fromApiDate(value);
  };

  // ✅ keep local state in sync when parent sends edit data
  useEffect(() => {
    if (isEditMode) {
      setHabitDate({
        ...isEditMode,
        start_date: asDate(isEditMode.start_date) ?? new Date(),
        end_date: asDate(isEditMode.end_date),
      });
    }
  }, [isEditMode]);

  const userDisplay = useMemo(() => {
    const start = asDate(habitDate.start_date) ?? new Date();
    const end = asDate(habitDate.end_date);

    return end
      ? `${format(start, "dd-MM-yyyy")} - ${format(end, "dd-MM-yyyy")}`
      : `${format(start, "dd-MM-yyyy")}`;
  }, [habitDate]);

  const recurrenceDisplay = useMemo(
    () => formatProtocolFrequencySummary(habitDate),
    [habitDate]
  );

  const pushToParent = (hd: HabitDateType) => {
    const { start_date, end_date, ...rest } = hd;

    let result: any = end_date
      ? {
          start_date: toApiDate(asDate(start_date) ?? new Date()),
          end_date: toApiDate(asDate(end_date) ?? new Date()),
        }
      : {
          start_date: toApiDate(asDate(start_date) ?? new Date()),
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
          <Text style={styles.rowLabel}>{label}</Text>
        </View>

        <View style={styles.rowRight}>
          <View style={styles.rowValueStack}>
            <Text
              style={styles.rowValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {userDisplay}
            </Text>
            {!!recurrenceDisplay && (
              <Text
                style={styles.rowValueSecondary}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {recurrenceDisplay}
              </Text>
            )}
          </View>
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
