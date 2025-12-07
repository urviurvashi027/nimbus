// src/components/selfCare/workout/WorkoutPrimaryButton.tsx

import React from "react";
import { ViewStyle } from "react-native";
import StyledButton from "@/components/common/themeComponents/StyledButton";

type Props = {
  label: string;
  onPress: () => void;
  isDanger?: boolean;
  style?: ViewStyle;
};

const WorkoutPrimaryButton: React.FC<Props> = ({
  label,
  onPress,
  isDanger = false,
  style,
}) => {
  const lower = label.toLowerCase();
  const isPause = lower.includes("pause");
  const isResumeLike =
    lower.includes("resume") ||
    lower.includes("start") ||
    lower.includes("restart");

  let icon = "";
  if (isPause) icon = " ⏸";
  else if (isResumeLike) icon = " ▶";

  const displayLabel = `${label}`;

  return (
    <StyledButton
      label={displayLabel}
      onPress={onPress}
      variant={isDanger ? "destructive" : "primary"}
      size="large"
      fullWidth
      style={style}
    />
  );
};

export default WorkoutPrimaryButton;
