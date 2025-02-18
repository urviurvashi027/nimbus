import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { MetricFormat } from "./Modal/HabitMetricModal";
import HabitMetricModal from "./Modal/HabitMetricModal";
import styling from "./style/HabitInputStyle";
// import styling from "./style/HabitMetricInputStyle";

interface HabitMetricInputProp {
  onSelect: (metricValue: any) => void;
}

const HabitMetricInput: React.FC<HabitMetricInputProp> = ({ onSelect }) => {
  const { theme } = useContext(ThemeContext);

  const [habitMetric, setHabitMetric] = useState<MetricFormat | null>(null);

  const [showHabitMetricModal, setShowHabitMetricModal] = useState(false);

  // function to handle metric
  const handleHabitMetricSave = (value: MetricFormat) => {
    // console.log(value, "metric value selected");
    setHabitMetric(value);
    setShowHabitMetricModal(false);

    // TODO need to change this according to the API
    const result = { count: value.count, unit: value.unit };
    onSelect(result);
  };

  const styles = styling(theme);

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
              ? `Metric: ${habitMetric.count}  ${habitMetric.unit}`
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
        onSave={handleHabitMetricSave}
      />
    </>
  );
};

export default HabitMetricInput;
