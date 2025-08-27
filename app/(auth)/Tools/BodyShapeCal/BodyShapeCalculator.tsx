import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenView, ThemeKey } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/context/ThemeContext";
import { useNavigation } from "expo-router";
import { themeColors } from "@/constant/theme/Colors";
import {
  bodyShapeCalculatorRequest,
  bodyShapeCalculatorResponse,
} from "@/types/toolsTypes";
import { getBodyShapeInfo } from "@/services/toolService";

type BodyShape =
  | "Hourglass"
  | "Rectangle"
  | "Pear"
  | "InvertedTriangle"
  | "Apple"
  | "Undefined";

const shapeIcons: Record<BodyShape, any> = {
  Hourglass: require("../../../../assets/images/bodyShape/5.png"),
  Rectangle: require("../../../../assets/images/bodyShape/6.png"),
  Pear: require("../../../../assets/images/bodyShape/3.png"),
  InvertedTriangle: require("../../../../assets/images/bodyShape/2.png"),
  Apple: require("../../../../assets/images/bodyShape/2.png"),
  Undefined: require("../../../../assets/images/bodyShape/4.png"),
};

const BodyShapeCalculator = () => {
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [highHip, setHighHip] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState("");
  const [icon, setIcon] = useState(null);

  const [response, setResponse] = useState<bodyShapeCalculatorResponse | null>(
    null
  );

  const { theme } = useContext(ThemeContext);
  const styles = styling(theme);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const calculateBodyShape = async () => {
    const bustVal = parseFloat(bust);
    const waistVal = parseFloat(waist);
    const highHipVal = parseFloat(highHip);
    const hipVal = parseFloat(hip);

    if (
      isNaN(bustVal) ||
      isNaN(waistVal) ||
      isNaN(highHipVal) ||
      isNaN(hipVal)
    ) {
      Alert.alert("Please enter all values correctly");
      return;
    }

    let shape = "";

    console.log(bustVal, waistVal, highHipVal, hipVal, "body shape");

    const bustHipDiff = Math.abs(bustVal - hipVal);
    const waistToBust = (waistVal / bustVal) * 100;
    const waistToHip = (waistVal / hipVal) * 100;

    if (bustHipDiff <= bustVal * 0.05 && waistToBust < 75 && waistToHip < 75) {
      shape = "Hourglass";
    } else if (
      Math.abs(bustVal - waistVal) <= bustVal * 0.08 &&
      Math.abs(hipVal - waistVal) <= hipVal * 0.08
    ) {
      shape = "Rectangle";
    } else if (hipVal > bustVal * 1.05) {
      shape = "Pear";
    } else if (bustVal > hipVal * 1.05) {
      shape = "InvertedTriangle";
    } else if (waistVal > bustVal && waistVal > hipVal) {
      shape = "Apple";
    } else {
      shape = "Undefined";
    }

    const newResult = `Your body shape is: ${shape}`;
    const shapeIcon: any = shapeIcons[shape as BodyShape];

    setResult(newResult);
    setIcon(shapeIcon);

    await AsyncStorage.setItem(
      "bodyShapeResult",
      JSON.stringify({ result: newResult, icon: shapeIcon })
    );

    const request = {
      bust: bustVal.toString(),
      waist: waistVal.toString(),
      highHip: highHipVal.toString(),
      lowHip: hipVal.toString(),
    };

    onSubmitClick(request);
  };

  const onSubmitClick = async (request: bodyShapeCalculatorRequest) => {
    try {
      const result = await getBodyShapeInfo(request);
      if (result) {
        setResponse(result);
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
        <Text style={styles.heading}>Body Shape Calculator</Text>

        <TextInput
          style={styles.input}
          placeholder="Bust size (cm)"
          keyboardType="numeric"
          value={bust}
          placeholderTextColor={themeColors.basic.mediumGrey}
          onChangeText={setBust}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={themeColors.basic.mediumGrey}
          placeholder="Waist size (cm)"
          keyboardType="numeric"
          value={waist}
          onChangeText={setWaist}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={themeColors.basic.mediumGrey}
          placeholder="High Hip size (cm)"
          keyboardType="numeric"
          value={highHip}
          onChangeText={setHighHip}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={themeColors.basic.mediumGrey}
          placeholder="Low Hip size (cm)"
          keyboardType="numeric"
          value={hip}
          onChangeText={setHip}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={calculateBodyShape}
        >
          <View>
            <Text style={styles.saveButtonText}>Calculate</Text>
          </View>
        </TouchableOpacity>

        {response && (
          <View style={styles.resultBox}>
            <Text style={styles.result}>
              Your Body Shape is: {response.shape}
            </Text>
            {/* {icon && <Image source={icon} style={styles.icon} />} */}
          </View>
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
    heading: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
    },
    input: {
      width: "100%",
      borderBottomColor: themeColors[theme].inpurBorderColor,
      borderBottomWidth: 1,
      borderRadius: 5,
      paddingVertical: 15,
      fontSize: 16,
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
    resultBox: {
      marginTop: 20,
      alignItems: "center",
    },
    result: {
      fontSize: 18,
      color: "#4caf50",
      fontWeight: "bold",
      marginBottom: 10,
    },
    icon: {
      width: 100,
      height: 100,
      resizeMode: "contain",
    },
  });

export default BodyShapeCalculator;
