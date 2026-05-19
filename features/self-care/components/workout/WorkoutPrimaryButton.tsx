import React from "react";
import { ViewStyle } from "react-native";

import StyledButton from "@/components/ui/theme-components/StyledButton";

type WorkoutPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isDanger?: boolean;
  style?: ViewStyle;
};

const WorkoutPrimaryButton: React.FC<WorkoutPrimaryButtonProps> = ({
  label,
  onPress,
  isDanger = false,
  style,
}) => {
  return (
    <StyledButton
      label={label}
      onPress={onPress}
      variant={isDanger ? "destructive" : "primary"}
      size="large"
      fullWidth
      style={style}
    />
  );
};

export default WorkoutPrimaryButton;
