// services/settingsStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PreferenceKey = "liquid" | "weight" | "weather" | "gender";

export type PreferenceValue = string;

const PREFIX = "@nimbus_pref_";

const defaults: Record<PreferenceKey, PreferenceValue> = {
  liquid: "ml",
  weight: "kg",
  weather: "°C",
  gender: "Not set",
};

export const getPreference = async (
  key: PreferenceKey
): Promise<PreferenceValue> => {
  const raw = await AsyncStorage.getItem(PREFIX + key);
  return raw ?? defaults[key];
};

export const setPreference = async (
  key: PreferenceKey,
  value: PreferenceValue
) => {
  await AsyncStorage.setItem(PREFIX + key, value);
};

export const getAllPreferences = async (): Promise<
  Record<PreferenceKey, PreferenceValue>
> => {
  const out: Record<PreferenceKey, PreferenceValue> = { ...defaults };
  for (const k of Object.keys(defaults) as PreferenceKey[]) {
    out[k] = (await getPreference(k)) ?? defaults[k];
  }
  return out;
};
