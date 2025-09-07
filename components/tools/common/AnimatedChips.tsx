// AnimatedChip.tsx
import ThemeContext from "@/context/ThemeContext";
import React, { useContext } from "react";
import { Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

interface AnimatedChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const AnimatedChip: React.FC<AnimatedChipProps> = ({
  label,
  selected,
  onPress,
}) => {
  const { newTheme } = useContext(ThemeContext);
  const styles = styling(newTheme);

  const scale = React.useRef(new Animated.Value(selected ? 1.1 : 1)).current;

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.1 : 1,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.chip, selected && styles.chipSelected]}
      >
        <Text style={[styles.text, selected && styles.textSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styling = (theme: any) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      backgroundColor: theme.surface,
      borderRadius: 20,
      minHeight: 30,
      marginRight: 10,
    },
    chipSelected: {
      backgroundColor: theme.accentPressed,
      // backgroundColor: "#d7c6f7",
    },
    text: {
      color: theme.accentPressed,
    },
    textSelected: {
      color: theme.background,
      fontWeight: "bold",
    },
  });

export default AnimatedChip;
