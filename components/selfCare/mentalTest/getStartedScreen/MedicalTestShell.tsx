// src/components/selfCare/mentalTest/getStartedScreen/MedicalTestShell.tsx
import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import ThemeContext from "@/context/ThemeContext";

type Props = {
  children: React.ReactNode;
};

const MedicalTestShell: React.FC<Props> = ({ children }) => {
  const { newTheme, spacing } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.shell,
        {
          backgroundColor: newTheme.surface,
          paddingHorizontal: spacing.md,
          paddingTop: spacing.lg,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
});

export default MedicalTestShell;
