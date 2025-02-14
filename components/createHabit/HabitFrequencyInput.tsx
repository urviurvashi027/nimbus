import { TouchableOpacity, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Text } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import FrequencyModal, {
  FormattedFrequency,
} from "@/components/createHabit/TaskFrequencyModal";
import HabitFrequencyModal from "./Modal/HabitFrequencyModal";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeKey } from "@/components/Themed";

const HabitFrequencyInput: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  const [frequency, setFrequency] = useState<FormattedFrequency | null>(null);

  const [showFrequencyModal, setShowFrequencyModal] = useState(false);

  // function to handle frequency save
  const handleFrequencySave = (selectedFrequency: any) => {
    console.log(selectedFrequency, "selectedFrequency============= ");
    setFrequency(selectedFrequency);
    setShowFrequencyModal(false);
  };

  const styles = styling(theme);

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowFrequencyModal(true)}
      >
        <Text style={styles.label}>Habit Frequency</Text>
        <Text style={styles.selectorText}>
          {frequency
            ? `Frequency: ${JSON.stringify(frequency.userDisplay)}`
            : "Select Frequency"}
        </Text>
      </TouchableOpacity>

      <HabitFrequencyModal
        visible={showFrequencyModal}
        onClose={() => setShowFrequencyModal(false)}
        onSave={handleFrequencySave}
      />
    </>
  );
};

export default HabitFrequencyInput;

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    header: {
      color: themeColors[theme]?.text,
    },
    container: {
      marginTop: 20,
    },
    btn: {
      marginTop: 60,
      backgroundColor: themeColors[theme]?.primaryColor,
      padding: 20,
      alignItems: "center",
      borderRadius: 10,
    },
    btnText: {
      color: themeColors[theme]?.text,
      fontWeight: 800,
      fontSize: 18,
    },
    input: {
      padding: 15,
      borderWidth: 1,
      borderRadius: 15,
      borderColor: themeColors.basic.GRAY,
    },
    inputLabel: {
      marginBottom: 10,
    },
    // container: {
    //   backgroundColor: themeColors.basic.WHITE,
    //   padding: 45,
    //   paddingTop: 105,
    //   height: "100%",
    // },
    label: {
      fontSize: 16,
      // color: "#333",
      marginBottom: 10,
      marginTop: 10,
    },
    selectorButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: themeColors[theme].inpurBorderColor,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    selectorText: {
      fontSize: 16,
      color: themeColors.basic.mediumGrey,
    },
  });
