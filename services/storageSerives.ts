// services/UserStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const USER_KEY = "@nimbus_user";
const TOKEN_KEY = "auth_token"; // if you need one

export type User = {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar?: string | null; // "svg:3" or "uri:https://..."
  profile?: {
    phone_number?: string | null;
    height?: string | number | null;
    weight?: string | number | null;
    age?: number | null;
    gender?: string | null;
  };
  settings?: {
    weight_unit?: "kg" | "lbs";
    height_unit?: "cm" | "in";
    liquid_unit?: "ml" | "oz";
    weather_unit?: "celsius" | "fahrenheit";
    start_of_day?: string | null; // "06:00"
    start_of_week?: "monday" | "sunday";
    sleep_time?: string | null;
    location?: string | null;
  };
  notifications?: any;
};

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function setStoredUser(user: User | null): Promise<void> {
  if (!user) {
    await AsyncStorage.removeItem(USER_KEY);
    return;
  }
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}
export async function setToken(token: string | null) {
  if (!token) return SecureStore.deleteItemAsync(TOKEN_KEY);
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}
