import React, { useContext, useMemo, useState } from "react";
import { View, Text } from "react-native";
import ThemeContext from "@/context/ThemeContext";
import { NimbusInput } from "@/components/common/themeComponents/NimbusInput";
import { NimbusButton } from "@/components/common/themeComponents/NimbusButton";

export default function NimbusPasswordStep({
  onSubmit,
  loading,
}: {
  onSubmit: (pwd: string) => void;
  loading?: boolean;
}) {
  const { newTheme } = useContext(ThemeContext);

  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    setErr("");

    if (!pwd || !confirm) return setErr("Please fill both fields.");
    if (pwd.length < 8)
      return setErr("Password must be at least 8 characters.");
    if (pwd !== confirm) return setErr("Passwords do not match.");

    onSubmit(pwd);
  };

  return (
    <>
      <Text
        style={{ color: newTheme.textPrimary, fontSize: 26, fontWeight: "800" }}
      >
        Create password 🔐
      </Text>
      <Text
        style={{
          color: newTheme.textSecondary,
          marginTop: 10,
          marginBottom: 24,
          lineHeight: 20,
        }}
      >
        Make it strong and memorable. You can change it later from settings.
      </Text>

      <NimbusInput
        label="Password"
        preset="password"
        enablePasswordToggle
        value={pwd}
        onChangeText={setPwd}
        placeholder="••••••••"
      />

      <View style={{ height: 16 }} />

      <NimbusInput
        label="Confirm Password"
        preset="password"
        enablePasswordToggle
        value={confirm}
        onChangeText={setConfirm}
        placeholder="••••••••"
      />

      {!!err && (
        <Text
          style={{ color: newTheme.error, marginTop: 12, fontWeight: "800" }}
        >
          {err}
        </Text>
      )}

      <View style={{ height: 18 }} />

      <NimbusButton
        label={loading ? "Creating..." : "Create account"}
        onPress={submit}
        disabled={!!loading}
      />
    </>
  );
}
