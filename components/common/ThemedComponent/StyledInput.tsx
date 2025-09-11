import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  Pressable,
  TextInputProps,
  LayoutChangeEvent,
  Platform,
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
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
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

  /* multiline support */
  multiline?: boolean;
  numberOfLines?: number;

  /* autoExpand options */
  autoGrow?: boolean; // if true, grows with content (default true for multiline)
  maxHeight?: number; // optional cap for growth
  minHeight?: number; // optional min height override
};

const colors = {
  bg: "#2A2D24",
  fieldBg: "#2A2D24",
  fieldBgDisabled: "#151821",
  border: "#1B1F26",
  borderFocus: "#7B6BFC",
  borderError: "#FF6B6B",
  text: "#ECEFF4",
  textDisabled: "#9AA4B2",
  placeholder: "#9AA4B2",
  helper: "#A3ADBD",
  error: "#FF7A7A",
  icon: "#C5CBD5",
  primary: "#6EA8FE",
  accent: "#A3BE8C",
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

// ---------- Icons ----------
const MailIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm16 2-8 5-8-5"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const LockIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M7 10V8a5 5 0 0 1 10 0v2m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EyeIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EyeOffIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M3 3l18 18M6.7 6.7C3.5 8.7 1 12 1 12s4 7 11 7c2 0 3.8-.4 5.3-1.1M10.6 10.6A4 4 0 0 0 12 16a3.9 3.9 0 0 0 3.1-1.6"
      fill="none"
      stroke={colors.icon}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------- Component ----------
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
  multiline = false,
  numberOfLines = 1,
  autoGrow = true,
  maxHeight,
  minHeight,
}) => {
  const [focused, setFocused] = useState(false);
  const [isHidden, setHidden] = useState(
    !!(secureTextEntry || preset === "password")
  );
  const [internalHeight, setInternalHeight] = useState<number | undefined>(
    undefined
  );

  const heights = { sm: 44, md: 52, lg: 60 } as const;
  const paddings = { sm: 10, md: 14, lg: 16 } as const;

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

  const radius = 14;
  const padX = paddings[size];
  const baseHeight = heights[size];

  const stateColors = getStateColors({ focused, error: !!error, disabled });

  // Compute dynamic heights for multiline auto-grow
  const computedMinHeight =
    minHeight ??
    (multiline ? Math.max(baseHeight, numberOfLines * 20) : baseHeight);
  const computedMaxHeight = maxHeight ?? (multiline ? 320 : baseHeight);

  const effectiveContainerHeight = multiline
    ? internalHeight ?? computedMinHeight
    : baseHeight;

  const onContentSizeChange = useCallback(
    (e: { nativeEvent: { contentSize: { height: number } } }) => {
      if (!multiline || !autoGrow) return;
      const h =
        Math.ceil(e.nativeEvent.contentSize.height) +
        (Platform.OS === "android" ? 8 : 0);
      const clamped = Math.max(
        computedMinHeight,
        Math.min(h, computedMaxHeight)
      );
      setInternalHeight(clamped);
    },
    [multiline, autoGrow, computedMinHeight, computedMaxHeight]
  );

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          {
            minHeight: computedMinHeight,
            height: effectiveContainerHeight,
            borderRadius: radius,
            paddingHorizontal: padX,
            borderColor: stateColors.border,
            backgroundColor: stateColors.bg,
          },
          multiline && styles.fieldMultiline,
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
            multiline ? styles.inputMultiline : undefined,
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
          multiline={multiline}
          numberOfLines={numberOfLines}
          onContentSizeChange={onContentSizeChange}
          // allowFontScaling left as default
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
    alignItems: "center", // single-line default
    borderWidth: 1,
    backgroundColor: colors.fieldBg,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 2,
  },
  fieldMultiline: {
    alignItems: "flex-start", // multiline: grow from top
    paddingTop: 10,
    paddingBottom: 10,
  },
  fieldDisabled: {
    opacity: 0.7,
  },
  left: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  right: {
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    includeFontPadding: false,
    paddingVertical: 6,
  },
  inputMultiline: {
    // top aligning on Android is important
    textAlignVertical: "top",
    paddingVertical: 4,
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
