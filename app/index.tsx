// app/index.tsx
import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StoreKey } from "@/constant/Constant";

const TOKEN_KEY = StoreKey.TOKEN_KEY;
const ONBOARDING_DONE_KEY = StoreKey.ONBOARDING_DONE_KEY;

type Href =
  | "/(public)/landing"
  | "/(auth)/onboarding/QuestionScreen"
  | "/(auth)/(tabs)";

export default function Index() {
  const [href, setHref] = useState<Href | null>(null);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      // ✅ No token => always show Landing first
      if (!token) {
        setHref("/(public)/landing");
        return;
      }

      // ✅ Token exists => decide onboarding vs tabs
      const done =
        (await SecureStore.getItemAsync(ONBOARDING_DONE_KEY)) === "true";

      setHref(done ? "/(auth)/(tabs)" : "/(auth)/onboarding/QuestionScreen");
    })();
  }, []);

  if (!href) return null;
  return <Redirect href={href} />;
}
