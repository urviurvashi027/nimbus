import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Toast from "react-native-toast-message";
import { useLocalSearchParams } from "expo-router";

import ThemeContext from "@/context/ThemeContext";
import { NimbusButton } from "@/components/common/themeComponents/NimbusButton";
import { getOtp, verifyOtp } from "@/services/loginService";
import { useNimbusToast } from "@/components/common/toast/useNimbusToast";

type Props = {
  // Pass these from parent when you have them
  email?: string;
  username?: string;

  length?: number;

  // Copy customization (optional)
  title?: string;
  subtitle?: (email: string) => string;

  // When OTP verified successfully
  onVerified: (otp: string) => void;

  // Optional error text handler
  onError?: (msg: string) => void;

  // optional: control if OTP should auto-send on mount
  autoSend?: boolean;
};

export default function NimbusOtpVerifyStep({
  email: emailProp,
  username: usernameProp,
  length = 6,
  title = "Verify OTP 🔒",
  subtitle,
  onVerified,
  onError,
  autoSend = true,
}: Props) {
  const { newTheme } = useContext(ThemeContext);

  // ✅ If parent didn't pass email/username, fallback to route params
  const params = useLocalSearchParams<{ email?: string; username?: string }>();

  const email = useMemo(
    () => (emailProp ?? params.email ?? "").trim(),
    [emailProp, params.email]
  );

  const username = useMemo(
    () => (usernameProp ?? params.username ?? "").trim(),
    [usernameProp, params.username]
  );

  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [active, setActive] = useState(0);
  const inputs = useRef<(TextInput | null)[]>([]);

  const [timer, setTimer] = useState(60);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const code = otp.join("");

  const toast = useNimbusToast();

  // Reset boxes if email changes (important when reused)
  useEffect(() => {
    setOtp(Array(length).fill(""));
    setActive(0);
    setTimer(60);
  }, [email, length]);

  // Auto-send OTP on mount (and when email becomes available)
  useEffect(() => {
    if (!autoSend) return;
    if (!email) return;
    sendOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSend, email]);

  // countdown
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const sendOtp = async () => {
    if (!email) {
      onError?.("Email is missing.");
      return;
    }

    setSending(true);
    onError?.("");

    try {
      const payload: any = { recipient: email };
      if (username) payload.name = username; // ✅ only when available

      const res = await getOtp(payload);

      if (res?.success) {
        toast.show({
          variant: "success",
          title: "OTP sent",
          message: "OTP sent sucessfull",
        });
        setTimer(60);
        return;
      }

      const msg = res?.message ?? "Failed to send OTP.";
      onError?.(String(msg));
    } catch (e: any) {
      onError?.(e?.message ?? "Failed to send OTP.");
    } finally {
      setSending(false);
    }
  };

  const setDigit = (text: string, idx: number) => {
    if (!/^\d?$/.test(text)) return;

    const next = [...otp];
    next[idx] = text;
    setOtp(next);

    if (text && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const verify = async () => {
    onError?.("");

    if (!email) {
      onError?.("Email is missing.");
      return;
    }

    if (code.length !== length || otp.includes("")) {
      onError?.("Please enter the full OTP.");
      return;
    }

    setVerifying(true);
    try {
      const res = await verifyOtp({ recipient: email, otp: code });

      if (res?.success) {
        toast.show({
          variant: "success",
          title: "OTP verified",
          message: "OTP verified sucessfull",
        });
        onVerified(code);
        return;
      }

      const msg = res?.message ?? "OTP verification failed.";
      onError?.(String(msg));
    } catch (e: any) {
      onError?.(e?.message ?? "OTP verification failed.");
    } finally {
      setVerifying(false);
    }
  };

  const subtitleText =
    subtitle?.(email) ??
    `We sent a ${length}-digit code to ${
      email || "your email"
    }. Enter it below to continue.`;

  return (
    <>
      <Text
        style={{ color: newTheme.textPrimary, fontSize: 26, fontWeight: "800" }}
      >
        {title}
      </Text>

      <Text
        style={{
          color: newTheme.textSecondary,
          marginTop: 10,
          marginBottom: 18,
          lineHeight: 20,
        }}
      >
        {subtitleText}
      </Text>

      {/* OTP boxes */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {otp.map((d, i) => {
          const focused = i === active;
          const filled = !!d;

          return (
            <TextInput
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              value={d}
              onFocus={() => setActive(i)}
              onChangeText={(t) => setDigit(t, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              style={{
                flex: 1,
                height: 52,
                borderRadius: 16,
                backgroundColor: newTheme.surface,
                borderWidth: 1,
                borderColor: focused
                  ? newTheme.focus ?? newTheme.accent
                  : filled
                  ? newTheme.accent
                  : newTheme.border,
                color: newTheme.textPrimary,
                fontSize: 18,
                fontWeight: "800",
              }}
            />
          );
        })}
      </View>

      {/* Timer / resend */}
      <View style={{ marginTop: 14, alignItems: "center" }}>
        {timer > 0 ? (
          <Text style={{ color: newTheme.textSecondary }}>
            Resend available in{" "}
            <Text style={{ color: newTheme.accent, fontWeight: "800" }}>
              {timer}s
            </Text>
          </Text>
        ) : (
          <Pressable onPress={sendOtp} disabled={sending}>
            <Text style={{ color: newTheme.accent, fontWeight: "800" }}>
              {sending ? "Sending..." : "Resend OTP"}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={{ height: 18 }} />

      <NimbusButton
        label={verifying ? "Verifying..." : "Verify"}
        onPress={verify}
        disabled={verifying}
      />
    </>
  );
}
