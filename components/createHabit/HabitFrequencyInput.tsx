import { TouchableOpacity, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { FrequencyObj } from "./Modal/HabitFrequencyModal";
import HabitFrequencyModal from "./Modal/HabitFrequencyModal";
import { ThemeKey } from "@/components/Themed";
import styling from "./style/HabitInputStyle";
// import styling from "./style/HabitFrequencyInputStyle";

interface HabitFrequencyInputProp {
  onSelect: (value: any) => void;
}

const HabitFrequencyInput: React.FC<HabitFrequencyInputProp> = ({
  onSelect,
}) => {
  const { theme } = useContext(ThemeContext);

  const [frequency, setFrequency] = useState<FrequencyObj | null>(null);
  const [userDisplay, setUserDisplay] = useState<string>("");

  const [showFrequencyModal, setShowFrequencyModal] = useState(false);

  const styles = styling(theme);

  // const daysOfWeek = ["su", "mo", "tu", "we", "th", "fr", "sa"];

  function formatUserDisplay(reminder: any) {
    let { frequency_type, interval, ...rest } = reminder;
    let displayString = "";

    switch (frequency_type) {
      case "daily":
        if (interval === 1) {
          displayString = "Daily";
        } else {
          displayString = `Every ${interval} days`;
        }
        break;

      case "weekly":
        if (interval === 1) {
          displayString = "Weekly";
        } else {
          displayString = `Every ${interval} weeks`;
        }
        if (rest.days_of_week && rest.days_of_week.length > 0) {
          displayString += ` on ${rest.days_of_week.join(" and ")}`;
        }
        break;

      case "monthly":
        if (interval === 1) {
          displayString = "Monthly";
        } else {
          displayString = `Every ${interval} months`;
        }
        if (rest?.days_of_month) {
          displayString += ` on the ${rest?.days_of_month}th`;
        }
        // if (rest?.monthsOfYear && rest?.monthsOfYear.length > 0) {
        //   const monthNames = [
        //     "January",
        //     "February",
        //     "March",
        //     "April",
        //     "May",
        //     "June",
        //     "July",
        //     "August",
        //     "September",
        //     "October",
        //     "November",
        //     "December",
        //   ];
        //   const selectedMonths = rest?.monthsOfYear.map(
        //     (monthIndex: number) => monthNames[monthIndex - 1]
        //   );
        //   displayString += ` in ${selectedMonths.join(", ")}`;
        // }
        break;

      default:
        displayString = "Unknown frequency";
    }

    return displayString;
  }

  // function to handle frequency save
  const handleFrequencySave = (selectedFrequency: any) => {
    let userDisplayFreq = formatUserDisplay(selectedFrequency);
    setUserDisplay(userDisplayFreq);
    setFrequency(selectedFrequency);
    setShowFrequencyModal(false);

    // onSelect call from parent
    onSelect(selectedFrequency);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setShowFrequencyModal(true)}
      >
        {/* <View> */}
        <Ionicons
          style={styles.iconLeft}
          name="sync"
          size={20}
          color={themeColors[theme].text}
        />
        <View style={styles.inputField}>
          <Text style={styles.label}>Repeat</Text>
          <Text
            style={styles.selectorText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {frequency ? `${JSON.stringify(userDisplay)}` : "No Repeat"}
          </Text>
        </View>
        <Ionicons
          style={styles.iconRight}
          name="chevron-forward"
          size={20}
          color={themeColors[theme].text}
        />
        {/* </View> */}
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
