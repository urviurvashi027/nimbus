import { ScreenView, ThemeKey } from "@/components/Themed";
import { themeColors } from "@/constant/Colors";
import ThemeContext from "@/context/ThemeContext";
import { getProteinIntakeInfo } from "@/services/toolService";
import {
  proteinIntakeCalculatorRequest,
  proteinIntakeCalculatorResponse,
} from "@/types/toolsTypes";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
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

type genderItem = {
  label: string;
  value: string;
  id: number;
};

const activityLevelList = [
  {
    label: "Sedentary (little/no exercise)",
    keyword: "sedentary",
    value: "1.2",
    id: 1,
  },
  {
    label: "Lightly active (1-3 days/week)",
    keyword: "light",
    value: "1.375",
    id: 2,
  },
  {
    label: "Moderately active (3-5 days/week)",
    keyword: "moderate",
    value: "1.55",
    id: 3,
  },
  {
    label: "Very active (6-7 days/week)",
    keyword: "active",
    value: "1.725",
    id: 4,
  },
  {
    label: "Super active (physical job)",
    keyword: "very_active",
    value: "1.9",
    id: 5,
  },
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

  const [protein, setProtein] = useState<string | null>(null);

  const [openActivityLevel, setOpenActivityLevel] = useState(false);
  const [activityLevelValue, setActivityLevelValue] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<activityList[]>([]);

  const [openGenderSelect, setOpenGenderSelect] = useState(false);
  const [genderValue, setGenderValue] = useState(0);
  const [selectedGender, setSelectedGender] = useState<activityList[]>([]);

  const [result, setResult] = useState<proteinIntakeCalculatorResponse | null>(
    null
  );

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

    const gender = genderList.find((item, index) => item.id === genderValue);

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

    const result = (weightNum * multiplier).toFixed(1);
    setProtein(`${result} grams of protein per day`);

    const request = {
      weight: weight,
      height: height,
      age: age,
      gender: gender?.value || "",
      activityLevel: al?.keyword || "",
    };

    onSubmitClick(request);
  };

  const onSubmitClick = async (request: proteinIntakeCalculatorRequest) => {
    try {
      const result = await getProteinIntakeInfo(request);
      if (result) {
        setResult(result);
      }
    } catch (error: any) {
      console.log(error, "API Error Response");
    }
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

        {result && (
          <View>
            <Text style={styles.result}>
              Recommended Protein Intake: {result.recommendedIntake.grams} gms
            </Text>

            <Text style={styles.result}>
              Recommended Protein Intake Range:{" "}
              {result.generalRange.minimumGrams} gms -{" "}
              {result.generalRange.highActivityGrams} gms
            </Text>
          </View>
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
      fontSize: 15,
      marginTop: 20,
      color: themeColors[theme].text,
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
