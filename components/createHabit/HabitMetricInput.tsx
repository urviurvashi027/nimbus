import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "@/components/Themed";
import { themeColors } from "@/constant/theme/Colors";
import ThemeContext from "@/context/ThemeContext";
import { MetricFormat } from "@/types/habitTypes";
// import HabitMetricModal from "./Modal/HabitMetricModal";
import styling from "./style/HabitInputStyle";
import { getHabitUnitData } from "@/services/habitService";
import { HabitUnit } from "@/types/habitTypes";
import MetricModal from "./Modal/MetricModal";
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
  const { theme, newTheme } = useContext(ThemeContext);

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
    console.log(result, res, "result");
    onSelect(result);
  };

  const styles = styling(theme, newTheme);

  const getHabitUniLtist = async () => {
    try {
      const result = await getHabitUnitData();
      // console.log(tagList, "tagList");
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

  // useEffect(() => {
  //   console.log(showHabitMetricModal, "showHabitMetricModal");
  // }, [showHabitMetricModal]);

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
        style={styles.rowItem}
        // style={styles.selectorButton}
        onPress={() => setShowHabitMetricModal(true)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            style={styles.iconLeft}
            name="ticket-outline"
            size={20}
            color={newTheme.textSecondary}
          />
          <Text style={styles.rowLabel}>Metric</Text>
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
        // visible={metricModalVisible}
        habitUnitList={tagList}
        // onClose={() => setMetricModalVisible(false)}
        onSave={handleHabitMetricSave}
        // onSave={(val) => {
        //   setHabitMetric(val);
        //   setMetric(val); // if you already have metric state
        // }}
        isEditMode={habitMetric}
      />

      {/* <HabitMetricModal
        visible={showHabitMetricModal}
        onClose={() => setShowHabitMetricModal(false)}
        isEditMode={habitMetric}
        habitUnitList={tagList}
        onSave={handleHabitMetricSave}
      /> */}
    </>
  );
};

export default HabitMetricInput;
