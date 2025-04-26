import { ScreenView, ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Platform,
  View,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type activityList = {
  label: string;
  value: string;
  id: number;
};
const activityLevelList = [
  { label: "Sedentary (little/no exercise)", value: "1.2", id: 1 },
  { label: "Lightly active (1-3 days/week)", value: "1.375", id: 2 },
  { label: "Moderately active (3-5 days/week)", value: "1.55", id: 3 },
  { label: "Very active (6-7 days/week)", value: "1.725", id: 4 },
  { label: "Super active (physical job)", value: "1.9", id: 5 },
];

const genderList = [
  { name: "Female", value: "female", id: 1 },
  { name: "Male", value: "male", id: 2 },
];

export default function ProteinCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  //   const [activity, setActivity] = useState("sedentary");
  const [protein, setProtein] = useState<string | null>(null);

  const [openActivityLevel, setOpenActivityLevel] = useState(false);
  const [activityLevelValue, setActivityLevelValue] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<activityList[]>([]);

  const [openGenderSelect, setOpenGenderSelect] = useState(false);
  const [genderValue, setGenderValue] = useState(0);
  const [selectedGender, setSelectedGender] = useState<activityList[]>([]);
  const [error, setError] = useState("");

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleNumericInput = (text: string, setter: (val: string) => void) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setter(cleaned);
  };

  const calculateProtein = () => {
    const weightNum = parseFloat(weight);

    if (isNaN(weightNum)) {
      setProtein("Please enter a valid weight");
      return;
    }

    let multiplier;

    const al = activityLevelList.find(
      (item, index) => item.id === activityLevelValue
    );

    switch (al?.label) {
      case "Sedentary (little/no exercise)":
        multiplier = 0.8;
        break;
      case "Lightly active (1-3 days/week)":
        multiplier = 1.0;
        break;
      case "Moderately active (3-5 days/week)":
        multiplier = 1.3;
        break;
      case "Very active (6-7 days/week)":
        multiplier = 1.6;
        break;
      case "Super active (physical job)":
        multiplier = 2.0;
        break;
      default:
        multiplier = 1.0;
    }

    console.log(weightNum, multiplier, "kjkjkjkjkjkjkj");
    const result = (weightNum * multiplier).toFixed(1);
    setProtein(`${result} grams of protein per day`);
  };

  return (
    <ScreenView
      style={{
        paddingTop: Platform.OS === "ios" ? 40 : 20,
      }}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={themeColors[theme].text}
          />
        </TouchableOpacity>

        <Text style={styles.header}>Protein Intake Calculator</Text>
        <Text style={styles.subHeader}>Find peace through meditation.</Text>

        <Text style={styles.label}>Gender</Text>

        <DropDownPicker
          open={openGenderSelect}
          multiple={false}
          value={genderValue}
          items={genderList.map((unit) => ({
            label: unit.name,
            value: unit.id,
          }))}
          style={styles.dropDown}
          setOpen={setOpenGenderSelect}
          setValue={setGenderValue}
          setItems={setSelectedGender}
          textStyle={styles.item}
          dropDownContainerStyle={{
            backgroundColor: themeColors[theme].background,
            borderColor: themeColors[theme].inpurBorderColor,
          }}
        />

        <TextInput
          style={styles.input}
          placeholderTextColor={themeColors.basic.mediumGrey}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={(text) => handleNumericInput(text, setAge)}
        />

        <TextInput
          style={styles.input}
          placeholderTextColor={themeColors.basic.mediumGrey}
          placeholder="Height (cm)"
          keyboardType="numeric"
          value={height}
          onChangeText={(text) => handleNumericInput(text, setHeight)}
        />

        <TextInput
          style={styles.input}
          placeholderTextColor={themeColors.basic.mediumGrey}
          placeholder="Weight (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={(text) => handleNumericInput(text, setWeight)}
        />

        <Text style={styles.label}>Activity Level</Text>
        <DropDownPicker
          open={openActivityLevel}
          multiple={false}
          value={activityLevelValue}
          items={activityLevelList.map((unit) => ({
            label: unit.label,
            value: unit.id,
          }))}
          style={styles.dropDown}
          setOpen={setOpenActivityLevel}
          setValue={setActivityLevelValue}
          setItems={setSelectedUnit}
          textStyle={styles.item}
          dropDownContainerStyle={{
            backgroundColor: themeColors[theme].background,
            borderColor: themeColors[theme].inpurBorderColor,
          }}
        />

        <TouchableOpacity style={styles.saveButton} onPress={calculateProtein}>
          <View>
            <Text style={styles.saveButtonText}>Calculate</Text>
          </View>
        </TouchableOpacity>

        {protein && (
          <Text style={styles.result}>
            Recommended Protein Intake: {protein}
          </Text>
        )}
      </View>
    </ScreenView>
  );
}

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
    },
    dropDown: {
      backgroundColor: themeColors[theme].background,
      borderColor: themeColors[theme].inpurBorderColor,
      color: themeColors[theme].text,
    },
    item: {
      color: themeColors.basic.mediumGrey,
      borderColor: themeColors[theme].inpurBorderColor,
    },
    backButton: {
      marginTop: 50,
      marginBottom: 10,
    },
    header: {
      fontSize: 26,
      fontWeight: "bold",
      color: themeColors[theme].text,
    },
    subHeader: {
      fontSize: 14,
      color: themeColors.basic.subheader,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: "center",
      fontWeight: "bold",
    },
    input: {
      width: "100%",

      borderBottomColor: themeColors[theme].inpurBorderColor,
      borderBottomWidth: 1,
      borderRadius: 5,
      paddingVertical: 15,
      fontSize: 16,
    },
    picker: {
      height: 50,
      marginBottom: 15,
    },
    label: {
      marginTop: 20,
      fontSize: 16,
      marginBottom: 10,
      color: themeColors.basic.mediumGrey,
    },
    result: {
      fontSize: 18,
      color: "#333",
      marginTop: 20,
      textAlign: "center",
    },
    saveButton: {
      marginVertical: 15,
      backgroundColor: themeColors.basic.secondaryColor,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    saveButtonText: {
      color: themeColors[theme].text,
      fontSize: 16,
      fontWeight: "bold",
    },
  });
