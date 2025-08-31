import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import InputField from "@/components/common/ThemedComponent/StyledInput";
import { StyledButton } from "@/components/common/ThemedComponent/StyledButton"; // reusable button we created earlier
import { useNavigation } from "expo-router";
import ThemeContext from "@/context/ThemeContext";
import { ThemeKey } from "@/components/Themed";
import Toast from "react-native-toast-message";

type SignUpPasswordScreenProps = {
  submitHanlder?: (password: string) => void;
};

const SignUpPasswordScreen: React.FC<SignUpPasswordScreenProps> = ({
  submitHanlder,
}) => {
  const [confimrPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigation = useNavigation();

  const { theme, newTheme } = useContext(ThemeContext);

  const styles = styling(theme, newTheme);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerBackButtonDisplayMode: "minimal",
      headerTintColor: newTheme.textPrimary,
      headerTitle: "",
    });
  }, [navigation]);

  const handleSave = () => {
    if (!confimrPassword || !newPassword) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }
    if (confimrPassword !== newPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setPasswordHandler();
  };

  // parent handler called
  const setPasswordHandler = async () => {
    submitHanlder?.(newPassword);
  };

  const content = (
    <>
      <Text style={styles.title}>Secure Your Account 🔒 </Text>
      <Text style={styles.subtitle}>
        Create a new password for your Habilty account. Make sure it's secure
        and easy to remember.
      </Text>

      <InputField
        label="Password"
        preset="password"
        enablePasswordToggle
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="••••••••"
      />

      <View style={{ height: 20 }} />

      <InputField
        label="Confirm Password"
        preset="password"
        enablePasswordToggle
        value={confimrPassword}
        onChangeText={setConfirmPassword}
        placeholder="••••••••"
      />

      <View style={{ marginTop: 40 }} />

      <StyledButton label="Save New Password" onPress={handleSave} />
    </>
  );

  return <View style={styles.container}>{content}</View>;
};

const styling = (theme: ThemeKey, newTheme: any) =>
  StyleSheet.create({
    mainContainer: {
      paddingTop: 95,
    },
    container: {
      flex: 1,
      backgroundColor: newTheme.background,
    },
    title: {
      color: newTheme.textPrimary,
      fontSize: 22,
      fontWeight: "700",
      marginTop: 10,
      marginBottom: 8,
    },
    subtitle: {
      color: newTheme.textSecondary,
      fontSize: 14,
      marginBottom: 24,
      lineHeight: 20,
    },
  });

export default SignUpPasswordScreen;
