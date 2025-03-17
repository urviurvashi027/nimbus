import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { MetricFormat } from "./Modal/HabitMetricModal";
import HabitMetricModal from "./Modal/HabitMetricModal";
import styling from "./style/HabitInputStyle";
import { getHabitUnitData } from "@/services/habitService";
import { HabitUnit } from "@/types/habitTypes";
// import styling from "./style/HabitMetricInputStyle";

type EditData = {
  count: string;
  unit: number;
  // unitId: number;
};

interface HabitMetricInputProp {
  isEditMode?: EditData;
  onSelect: (metricValue: any) => void;
}

const HabitMetricInput: React.FC<HabitMetricInputProp> = ({
  onSelect,
  isEditMode,
}) => {
  const { theme } = useContext(ThemeContext);

  const [habitMetric, setHabitMetric] = useState<MetricFormat | null>(null);
  const [tagList, setTaglist] = useState<HabitUnit[]>([]);
  const [showHabitMetricModal, setShowHabitMetricModal] = useState(false);

  // function to handle metric
  const handleHabitMetricSave = (value: MetricFormat) => {
    const res = {
      count: value.count,
      label: value.label,
      unit: value.unit,
    };
    setHabitMetric(value);
    setShowHabitMetricModal(false);

    // TODO need to change this according to the API
    const result = { count: value.count, unit: value.unit };
    onSelect(result);
  };

  const styles = styling(theme);

  const getHabitUniLtist = async () => {
    try {
      const result = await getHabitUnitData();
      if (result?.success) {
        setTaglist(result.data);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
  };

  useEffect(() => {
    getHabitUniLtist();
  }, []);

  useEffect(() => {
    console.log(showHabitMetricModal, "showHabitMetricModal");
  }, [showHabitMetricModal]);

  useEffect(() => {
    if (isEditMode) {
      setHabitMetric(isEditMode);
    } else {
    }
  }, [isEditMode]);

  return (
    <>
      {/* Habit Metric Button */}
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowHabitMetricModal(true)}
      >
        <Ionicons
          style={styles.iconLeft}
          name="calculator-outline"
          size={20}
          color={themeColors[theme].text}
        />
        <View style={styles.inputField}>
          <Text style={styles.label}>Metric</Text>
          <Text
            style={styles.selectorText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {habitMetric
              ? `Metric: ${habitMetric.count}  ${habitMetric.label}`
              : "Select Metric"}
          </Text>
        </View>
        <Ionicons
          style={styles.iconRight}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
      </TouchableOpacity>

      <HabitMetricModal
        visible={showHabitMetricModal}
        onClose={() => setShowHabitMetricModal(false)}
        isEditMode={habitMetric}
        habitUnitList={tagList}
        onSave={handleHabitMetricSave}
      />
    </>
  );
};

export default HabitMetricInput;
