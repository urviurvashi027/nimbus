import React, { useContext, useEffect, useState } from "react";
import { View, Platform, StyleSheet, ScrollView, Text } from "react-native";
import { useNavigation } from "expo-router";

import { ScreenView } from "@/components/Themed";
import ThemeContext from "@/context/ThemeContext";

import StyledInput from "@/components/common/themeComponents/StyledInput";
import StyledButton from "@/components/common/themeComponents/StyledButton";
import NimbusDropdown from "@/components/common/themeComponents/NimbusDropdown";
import ToolScreenHeader from "@/components/tools/common/ToolScreenHeader";

import { getProteinIntakeInfo } from "@/services/toolService";
import {
  proteinIntakeCalculatorRequest,
  proteinIntakeCalculatorResponse,
} from "@/types/toolsTypes";
import { activityLevelList, genderList } from "@/constant/data/tools";

const ProteinCalculator = () => {
  const navigation = useNavigation();
  const { newTheme, spacing, typography } = useContext(ThemeContext);
  const styles = styling(newTheme, spacing, typography);

  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [openGender, setOpenGender] = useState(false);
  const [genderValue, setGenderValue] = useState<number | null>(null);

  const [openActivity, setOpenActivity] = useState(false);
  const [activityValue, setActivityValue] = useState<number | null>(null);

  const [result, setResult] = useState<proteinIntakeCalculatorResponse | null>(
    null
  );

  const [genderItems, setGenderItems] = useState(
    genderList.map((g) => ({
      label: g.label,
      value: g.id,
    }))
  );

  const [activityItems, setActivityItems] = useState(
    activityLevelList.map((a) => ({
      label: a.label,
      value: a.id,
    }))
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleNumericInput = (text: string, setter: (val: string) => void) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setter(cleaned);
  };

  const subtitle =
    "Dial in how much protein your body needs to recover, repair, and feel strong.";

  const onSubmitClick = async (request: proteinIntakeCalculatorRequest) => {
    try {
      const res = await getProteinIntakeInfo(request);
      if (res) setResult(res);
    } catch (err) {
      console.log(err, "Protein API Error");
    }
  };

  const handleCalculate = () => {
    if (!weight || !genderValue || !activityValue) return;

    const activity = activityLevelList.find((a) => a.id === activityValue);
    const gender = genderList.find((g) => g.id === genderValue);

    const request: proteinIntakeCalculatorRequest = {
      weight,
      // height,
      // age,
      // gender: gender?.value ?? "",
      activityLevel: activity?.keyword ?? "",
    };

    onSubmitClick(request);
  };

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
        <ToolScreenHeader
          title="Protein Intake Calculator"
          subtitle={subtitle}
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: spacing.xl * 2 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <NimbusDropdown<number>
              label="Gender"
              open={openGender}
              setOpen={setOpenGender}
              value={genderValue}
              setValue={setGenderValue}
              items={genderItems}
              setItems={setGenderItems}
              placeholder="Select gender"
              zIndex={3000}
              zIndexInverse={2000}
              containerStyle={{ marginBottom: spacing.md }}
            />

            <StyledInput
              label="Age"
              value={age}
              keyboardType="number-pad"
              onChangeText={(text) => handleNumericInput(text, setAge)}
              placeholder="Enter your age"
              containerStyle={{ marginBottom: spacing.md }}
            />

            <StyledInput
              label="Height (cm)"
              value={height}
              keyboardType="number-pad"
              onChangeText={(text) => handleNumericInput(text, setHeight)}
              placeholder="Enter your height"
              containerStyle={{ marginBottom: spacing.md }}
            />

            <StyledInput
              label="Weight (kg)"
              value={weight}
              keyboardType="number-pad"
              onChangeText={(text) => handleNumericInput(text, setWeight)}
              placeholder="Enter your weight"
              containerStyle={{ marginBottom: spacing.lg }}
            />

            <NimbusDropdown<number>
              label="Activity Level"
              open={openActivity}
              setOpen={setOpenActivity}
              value={activityValue}
              setValue={setActivityValue}
              items={activityItems}
              setItems={setActivityItems}
              placeholder="Select activity level"
              zIndex={2000}
              zIndexInverse={1000}
            />

            <StyledButton
              label="Calculate"
              variant="primary"
              fullWidth
              onPress={handleCalculate}
              style={{ marginTop: spacing.lg }}
            />
          </View>

          {result && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Daily protein guidance</Text>
              <Text style={styles.resultLine}>
                Recommended intake: {result.recommendedIntake.grams} g
              </Text>
              <Text style={styles.resultLine}>
                Range: {result.generalRange.minimumGrams}–
                {result.generalRange.highActivityGrams} g
              </Text>
            </View>
          )}
        </ScrollView>
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
    resultCard: {
      marginTop: spacing.lg,
      borderRadius: 18,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: theme.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.divider,
    },
    resultTitle: {
      ...typography.caption,
      color: theme.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: spacing.xs,
    },
    resultLine: {
      ...typography.bodySmall,
      color: theme.textPrimary,
      marginTop: 4,
    },
  });

export default ProteinCalculator;
