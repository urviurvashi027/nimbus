// src/app/(auth)/Tools/BodyShapeCal/BodyShapeCalculator.tsx

import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Alert, Platform, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";
import { useNavigation } from "expo-router";

import {
  bodyShapeCalculatorRequest,
  bodyShapeCalculatorResponse,
} from "@/types/toolsTypes";
import { getBodyShapeInfo } from "@/services/toolService";

// Nimbus components
import InputField from "@/components/common/themeComponents/StyledInput";
import StyledButton from "@/components/common/themeComponents/StyledButton";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";

type BodyShape =
  | "Hourglass"
  | "Rectangle"
  | "Pear"
  | "InvertedTriangle"
  | "Apple"
  | "Undefined";

const shapeIcons: Record<BodyShape, any> = {
  Hourglass: require("../../../assets/images/bodyShape/5.png"),
  Rectangle: require("../../../assets/images/bodyShape/6.png"),
  Pear: require("../../../assets/images/bodyShape/3.png"),
  InvertedTriangle: require("../../../assets/images/bodyShape/2.png"),
  Apple: require("../../../assets/images/bodyShape/2.png"),
  Undefined: require("../../../assets/images/bodyShape/4.png"),
};

const BodyShapeCalculator = () => {
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [highHip, setHighHip] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<BodyShape | null>(null);
  const [icon, setIcon] = useState<any | null>(null);

  const [response, setResponse] = useState<bodyShapeCalculatorResponse | null>(
    null
  );

  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
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
      Alert.alert("Missing info", "Please enter all measurements correctly.");
      return;
    }

    const bustHipDiff = Math.abs(bustVal - hipVal);
    const waistToBust = (waistVal / bustVal) * 100;
    const waistToHip = (waistVal / hipVal) * 100;

    let shape: BodyShape;

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

    setResult(shape);
    const shapeIcon = shapeIcons[shape];
    setIcon(shapeIcon);

    await AsyncStorage.setItem(
      "bodyShapeResult",
      JSON.stringify({ shape, icon: shapeIcon })
    );

    const request: bodyShapeCalculatorRequest = {
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

  const subtitle =
    "A quick way to understand your natural silhouette using four simple measurements.";

  return (
    <ScreenView
      style={{
        paddingTop:
          Platform.OS === "ios"
            ? spacing["xxl"] + spacing["xxl"] * 0.2
            : spacing.xl,
        paddingHorizontal: spacing.md,
      }}
    >
      <View style={styles.container}>
        {/* Shared Nimbus header */}
        <ToolScreenHeader
          title="Body Shape Calculator"
          subtitle={subtitle}
          onBack={() => navigation.goBack()}
        />

        {/* Form card */}
        <View style={styles.card}>
          <InputField
            label="Bust size (cm)"
            value={bust}
            onChangeText={setBust}
            keyboardType="numeric"
            placeholder="Enter your bust measurement"
            containerStyle={styles.fieldSpacing}
          />

          <InputField
            label="Waist size (cm)"
            value={waist}
            onChangeText={setWaist}
            keyboardType="numeric"
            placeholder="Enter your waist measurement"
            containerStyle={styles.fieldSpacing}
          />

          <InputField
            label="High hip size (cm)"
            value={highHip}
            onChangeText={setHighHip}
            keyboardType="numeric"
            placeholder="Measure the fullest part of the upper hip"
            containerStyle={styles.fieldSpacing}
          />

          <InputField
            label="Low hip size (cm)"
            value={hip}
            onChangeText={setHip}
            keyboardType="numeric"
            placeholder="Measure around the fullest part of your hips"
            containerStyle={styles.fieldSpacing}
          />

          <StyledButton
            label="Calculate"
            variant="primary"
            size="large"
            fullWidth
            onPress={calculateBodyShape}
            style={styles.calculateButton}
          />
        </View>

        {/* Result card */}
        {(result || response) && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeaderRow}>
              <Text style={styles.resultLabel}>Your body shape</Text>
              {icon && <Image source={icon} style={styles.icon} />}
            </View>

            {result && <Text style={styles.resultShape}>{result}</Text>}

            {response?.shape && response.shape !== result && (
              <Text style={styles.resultSecondary}>
                (AI suggestion: {response.shape})
              </Text>
            )}
          </View>
        )}
      </View>
    </ScreenView>
  );
};

const styling = (theme: any, spacing: any, typography: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: spacing.md,
    },

    // FORM CARD
    card: {
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: theme.surfaceMuted ?? "#181C18",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.divider,
      shadowColor: theme.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 5,
    },
    fieldSpacing: {
      marginBottom: spacing.md,
    },
    calculateButton: {
      marginTop: spacing.sm,
    },

    // RESULT
    resultCard: {
      marginTop: spacing.lg,
      borderRadius: 18,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: theme.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.divider,
    },
    resultHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    resultLabel: {
      ...typography.caption,
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    icon: {
      width: 56,
      height: 56,
      resizeMode: "contain",
    },
    resultShape: {
      ...typography.h3,
      color: theme.textPrimary,
      fontWeight: "700",
      marginBottom: spacing.xs,
    },
    resultSecondary: {
      ...typography.caption,
      color: theme.textSecondary,
      marginBottom: spacing.sm,
    },
  });

export default BodyShapeCalculator;
