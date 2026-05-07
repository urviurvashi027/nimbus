import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeContext from "@/contexts/ThemeContext";
import { tokens } from "@/theme/tokens";

type Preset = "default" | "email" | "phone" | "password";

type NimbusInputProps = TextInputProps & {
  label?: string;
  preset?: Preset;
  enablePasswordToggle?: boolean;

  /** Styles */
  containerStyle?: StyleProp<ViewStyle>; // applies to outer View
  inputStyle?: StyleProp<TextStyle>; // applies to TextInput
  labelStyle?: StyleProp<TextStyle>; // applies to Label
};

export function NimbusInput({
  label,
  preset = "default",
  enablePasswordToggle,
  containerStyle,
  inputStyle,
  labelStyle,
  ...props
}: NimbusInputProps) {
  const { newTheme, nimbusColors } = useContext(ThemeContext);
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const keyboardType =
    props.keyboardType ??
    (preset === "email"
      ? "email-address"
      : preset === "phone"
      ? "phone-pad"
      : "default");

  const autoCapitalize =
    props.autoCapitalize ??
    (preset === "email" || preset === "password" ? "none" : "words");

  const secureTextEntry =
    props.secureTextEntry ?? (preset === "password" ? !showPwd : undefined);

  const leftIcon =
    preset === "email"
      ? "mail-outline"
      : preset === "password"
      ? "lock-closed-outline"
      : undefined;

  const borderColor = focused
    ? nimbusColors.focus.color || newTheme.focus || nimbusColors.brand.primary || newTheme.accent
    : nimbusColors.border.default || newTheme.border;

  return (
    <View style={containerStyle}>
      {!!label && (
        <Text style={[s.label, { color: nimbusColors.text.secondary || newTheme.textSecondary }, labelStyle]}>
          {label}
        </Text>
      )}

      <View
        style={[
          s.wrap,
          {
            backgroundColor: nimbusColors.surface.base || newTheme.surface,
            borderColor,
          },
        ]}
        pointerEvents="auto"
      >
        {!!leftIcon && (
          <View style={s.iconLeft}>
            <Ionicons
              name={leftIcon as any}
              size={18}
              color={nimbusColors.text.secondary || newTheme.textSecondary}
            />
          </View>
        )}

        <TextInput
          {...props}
          style={[s.input, { color: nimbusColors.text.primary || newTheme.textPrimary }, inputStyle]}
          placeholderTextColor={nimbusColors.text.disabled || newTheme.textSecondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          editable={props.editable ?? true}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
        />

        {enablePasswordToggle && preset === "password" && (
          <Pressable
            onPress={() => setShowPwd((v) => !v)}
            hitSlop={10}
            style={s.iconRight}
          >
            <Ionicons
              name={showPwd ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={nimbusColors.text.secondary || newTheme.textSecondary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "700",
  },
  wrap: {
    height: tokens.size.inputHeight,
    borderRadius: tokens.radius.input,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  iconLeft: { marginRight: 10 },
  iconRight: { marginLeft: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
});
