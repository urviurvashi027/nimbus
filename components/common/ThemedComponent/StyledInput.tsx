import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  Pressable,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export type InputFieldProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactElement | null;
  rightIcon?: React.ReactElement | null;
  onRightPress?: (e: GestureResponderEvent) => void;
  keyboardType?: React.ComponentProps<typeof TextInput>["keyboardType"];
  autoCapitalize?: React.ComponentProps<typeof TextInput>["autoCapitalize"];
  secureTextEntry?: boolean;
  enablePasswordToggle?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  preset?: "default" | "email" | "password";
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  onRightPress,
  keyboardType,
  autoCapitalize = "none",
  secureTextEntry,
  enablePasswordToggle,
  error,
  helperText,
  disabled,
  size = "md",
  preset = "default",
  containerStyle,
  inputStyle,
  testID,
}) => {
  const [focused, setFocused] = useState(false);
  const [isHidden, setHidden] = useState(
    secureTextEntry || preset === "password"
  );

  const heights = { sm: 48, md: 56, lg: 64 } as const;
  const paddings = { sm: 12, md: 16, lg: 18 } as const;

  const showPasswordToggle = enablePasswordToggle || preset === "password";

  const effectiveLeftIcon = useMemo(() => {
    if (leftIcon) return leftIcon;
    if (preset === "email") return <MailIcon />;
    if (preset === "password") return <LockIcon />;
    return null;
  }, [leftIcon, preset]);

  const effectiveKeyboard = useMemo(() => {
    if (keyboardType) return keyboardType;
    if (preset === "email") return "email-address";
    return "default";
  }, [keyboardType, preset]);

  const effectiveSecure = showPasswordToggle ? isHidden : !!secureTextEntry;

  const RightAccessory = useMemo(() => {
    if (rightIcon)
      return (
        <Pressable
          onPress={onRightPress}
          hitSlop={8}
          accessibilityRole="button"
        >
          {rightIcon}
        </Pressable>
      );
    if (showPasswordToggle)
      return (
        <Pressable
          onPress={() => setHidden((s) => !s)}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={isHidden ? "Show password" : "Hide password"}
        >
          {isHidden ? <EyeOffIcon /> : <EyeIcon />}
        </Pressable>
      );
    return null;
  }, [rightIcon, onRightPress, showPasswordToggle, isHidden]);

  const radius = 16;
  const inputHeight = heights[size];
  const padX = paddings[size];

  const stateColors = getStateColors({ focused, error: !!error, disabled });

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text
          style={[styles.label, disabled && styles.labelDisabled]}
          accessibilityRole="text"
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            height: inputHeight,
            borderRadius: radius,
            paddingHorizontal: padX,
          },
          { borderColor: stateColors.border, backgroundColor: stateColors.bg },
          disabled && styles.fieldDisabled,
        ]}
        accessibilityLabel={label}
        accessibilityState={{ disabled, expanded: focused }}
        testID={testID}
      >
        {effectiveLeftIcon ? (
          <View style={styles.left}>{effectiveLeftIcon}</View>
        ) : null}

        <TextInput
          style={[
            styles.input,
            { color: stateColors.text },
            effectiveLeftIcon ? { marginLeft: 8 } : undefined,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={stateColors.placeholder}
          keyboardType={effectiveKeyboard}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={!disabled}
          secureTextEntry={effectiveSecure}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.primary}
          cursorColor={colors.primary}
        />

        {RightAccessory ? (
          <View style={styles.right}>{RightAccessory}</View>
        ) : null}
      </View>

      {!!error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : !!helperText ? (
        <Text style={styles.helper}>{helperText}</Text>
      ) : null}
    </View>
  );
};

// ------ Default Icons (SVG) ------ //
const MailIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm16 2-8 5-8-5"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EyeIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M3 3l18 18M6.7 6.7C3.5 8.7 1 12 1 12s4 7 11 7c2 0 3.8-.4 5.3-1.1M10.6 10.6A4 4 0 0 0 12 16a3.9 3.9 0 0 0 3.1-1.6"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ------ Theming & styles ------ //
const colors = {
  bg: "#2A2D24",
  fieldBg: "#2A2D24",
  fieldBgDisabled: "#151821",
  border: "#1B1F26",
  //   border: "#2A2F3A",
  borderFocus: "#5B8CFF",
  borderError: "#FF6B6B",
  text: "#E6EAF2",
  textDisabled: "#9AA4B2",
  placeholder: "#9AA4B2",
  helper: "#A3ADBD",
  error: "#FF7A7A",
  icon: "#C5CBD5",
  primary: "#6EA8FE",
};

function getStateColors({
  focused,
  error,
  disabled,
}: {
  focused: boolean;
  error: boolean;
  disabled?: boolean;
}) {
  const border = error
    ? colors.borderError
    : focused
    ? colors.borderFocus
    : colors.border;

  return {
    bg: disabled ? colors.fieldBgDisabled : colors.fieldBg,
    border,
    text: disabled ? colors.textDisabled : colors.text,
    placeholder: colors.placeholder,
  };
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  labelDisabled: {
    color: colors.textDisabled,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: colors.fieldBg,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },
  fieldDisabled: {
    opacity: 0.7,
  },
  left: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  right: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    includeFontPadding: false,
    paddingVertical: 0,
  },
  helper: {
    marginTop: 8,
    color: colors.helper,
    fontSize: 13,
  },
  error: {
    marginTop: 8,
    color: colors.error,
    fontSize: 13,
  },
});

export default InputField;

/* -------------------------
USAGE EXAMPLES
--------------------------

// 1) Email field that matches the screenshot
<InputField
  label="Email"
  preset="email"
  value={email}
  onChangeText={setEmail}
  placeholder="andrew.ainsley@yourdomain.com"
/>

// 2) Password field with built‑in visibility toggle
<InputField
  label="Password"
  preset="password"
  enablePasswordToggle
  value={password}
  onChangeText={setPassword}
  placeholder="••••••••"
/>

// 3) Custom right action (e.g., clear)
<InputField
  label="Username"
  value={username}
  onChangeText={setUsername}
  rightIcon={<Text style={{color: '#C5CBD5'}}>Clear</Text>}
  onRightPress={() => setUsername('')}
/>

*/
