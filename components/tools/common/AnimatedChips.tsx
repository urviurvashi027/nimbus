// AnimatedChip.tsx
import React from "react";
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

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    minHeight: 30,
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: "#d7c6f7",
  },
  text: {
    color: "#555",
  },
  textSelected: {
    color: "#4b0082",
    fontWeight: "bold",
  },
});

export default AnimatedChip;
