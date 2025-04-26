import { ScreenView, ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons } from "@expo/vector-icons";

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

const CalorieCalculator = () => {
  const [age, setAge] = useState("");

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [openActivityLevel, setOpenActivityLevel] = useState(false);
  const [activityLevelValue, setActivityLevelValue] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<activityList[]>([]);

  const [openGenderSelect, setOpenGenderSelect] = useState(false);
  const [genderValue, setGenderValue] = useState(0);
  const [selectedGender, setSelectedGender] = useState<activityList[]>([]);
  const [error, setError] = useState("");

  const [calories, setCalories] = useState<number | null>(null);

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const calculateCalories = () => {
    console.log(
      weight,
      height,
      age,
      selectedGender,
      genderValue,
      activityLevelValue
    );

    if (!validateInputs()) return;
    const al = activityLevelList.find(
      (item, index) => item.id === activityLevelValue
    );
    console.log(al, "al");
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const activity = parseFloat(al?.value ?? "0");

    if (!w || !h || !a) {
      alert("Please enter valid numbers for age, weight, and height.");
      return;
    }

    let bmr =
      genderValue === 2
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    const tdee = bmr * activity;
    setCalories(Math.round(tdee));
  };

  const validateInputs = () => {
    if (!age || !height || !weight) {
      setError("Please fill all fields with valid numeric values.");
      setCalories(null);
      return false;
    }
    setError("");
    return true;
  };

  const handleNumericInput = (text: string, setter: (val: string) => void) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setter(cleaned);
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

        <Text style={styles.header}>Calorie Intake Calculator</Text>
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

        <TouchableOpacity style={styles.saveButton} onPress={calculateCalories}>
          <View>
            <Text style={styles.saveButtonText}>Calculate Calories</Text>
          </View>
        </TouchableOpacity>

        {calories && (
          <Text style={styles.result}>
            Your recommended daily calorie intake is: {calories} kcal
          </Text>
        )}
      </View>
    </ScreenView>
  );
};

const styling = (theme: ThemeKey) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
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
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      width: "100%",

      borderBottomColor: themeColors[theme].inpurBorderColor,
      borderBottomWidth: 1,
      borderRadius: 5,
      paddingVertical: 15,
      fontSize: 16,
    },
    label: {
      marginTop: 20,
      fontSize: 16,
      marginBottom: 10,
      color: themeColors.basic.mediumGrey,
    },
    picker: {
      marginVertical: 10,
    },
    result: {
      marginTop: 30,
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      color: "green",
    },
    listContainer: {},
    typeButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: themeColors[theme].divider,
    },
    typeText: {
      fontSize: 16,
      color: themeColors[theme].text,
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

export default CalorieCalculator;
