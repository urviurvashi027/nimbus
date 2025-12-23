import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import ThemeContext from "@/context/ThemeContext";

import { MetricFormat } from "@/types/habitTypes";
import { HabitUnit } from "@/types/habitTypes";

import { getHabitUnitData } from "@/services/habitService";

import styling from "./style/HabitInputStyle";
import MetricModal from "./Modal/MetricModal";

type EditData = {
  count: string;
  unit: number;
};

interface HabitMetricInputProp {
  isEditMode?: EditData;
  style?: StyleProp<ViewStyle>;
  onSelect: (metricValue: { count: string; unit: number }) => void;
}

const HabitMetricInput: React.FC<HabitMetricInputProp> = ({
  onSelect,
  style,
  isEditMode,
}) => {
  const { newTheme, spacing } = useContext(ThemeContext);

  const [habitMetric, setHabitMetric] = useState<MetricFormat | null>(null);
  const [tagList, setTaglist] = useState<HabitUnit[]>([]);
  const [showHabitMetricModal, setShowHabitMetricModal] = useState(false);

  // function to handle metric
  const handleHabitMetricSave = (value: MetricFormat) => {
    setHabitMetric(value);
    setShowHabitMetricModal(false);

    const result = { count: value.count, unit: value.unit };
    onSelect(result);
  };

  const styles = styling(newTheme, spacing);

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
    if (isEditMode) {
      setHabitMetric(isEditMode);
    } else {
    }
  }, [isEditMode]);

  return (
    <>
      <TouchableOpacity
        style={[styles.rowItem, style]}
        onPress={() => setShowHabitMetricModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="speedometer-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>How you’ll track it</Text>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.rowValue}>
            {habitMetric
              ? `${habitMetric.count} ${habitMetric.label}`
              : "Select Metric"}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={newTheme.textSecondary}
          />
        </View>
      </TouchableOpacity>

      <MetricModal
        visible={showHabitMetricModal}
        onClose={() => setShowHabitMetricModal(false)}
        habitUnitList={tagList}
        onSave={handleHabitMetricSave}
        isEditMode={habitMetric}
      />
    </>
  );
};

export default HabitMetricInput;
