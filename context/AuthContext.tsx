import { ReactNode, createContext, useEffect, useRef } from "react";
import { useContext, useState } from "react";
import { router, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { login, signup, logout, getUserDetails } from "@/services/loginService";

type User = {
  userId: number | null;
  username: string | null;
  email?: string | null;
  full_name?: string;
  phone_number?: string;
};

type UserProfile = {
  full_name?: string | null;
  phone_number?: string | null;
  id: number | null;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  userprofile: null;
  usersettings: null;
  // add whatever fields your API returns
};

// Cache Token Key
const TOKEN_KEY = "my-jwt";
const USER_KEY = "user";
const REFRESH_TOKEN = "refresh-token";
const USER_PROFILE_KEY = "user-profile";
const LAST_ACTIVE_KEY = "last-active-ts";

// Refresh intervals & expiry
const REFRESH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes
const AUTO_LOGOUT_DAYS = 15;
const AUTO_LOGOUT_MS = AUTO_LOGOUT_DAYS * 24 * 60 * 60 * 1000;

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (
    // test added optional paramter
    email: string,
    password: string,
    mobile: string,
    username?: string,
    fullname?: string
  ) => Promise<any>;
  onLogin?: (userName: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  userProfile?: UserProfile | null;
  getUserDetails?: () => Promise<any>;
  user?: User;
}

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  if (!useContext(AuthContext)) {
    throw new Error("useAuth must be used within a <AuthProvider />");
  }

  return useContext(AuthContext);
};

function useProtectedRoute(authState: {
  token: string | null;
  authenticated: boolean | null;
}) {
  const segments = useSegments();
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!authState.authenticated && inAuthGroup) {
      router.replace("/landingScreen");
    } else if (authState.authenticated && !inAuthGroup) {
      router.replace("/(auth)/(tabs)");
    } else {
      router.replace("/landingScreen");
    }
  }, [authState.authenticated]);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{
    userId: number | null;
    username: string | null;
  }>({ userId: null, username: null });

  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: false });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // refs for refresh flow
  const isRefreshingRef = useRef(false);
  const refreshPromiseRef = useRef<Promise<string | null> | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: set axios auth header + save token to secure store
  const applyAccessToken = async (accessToken: string | null) => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      setAuthState({ token: accessToken, authenticated: true });
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
      // update last active timestamp on token set
      await SecureStore.setItemAsync(LAST_ACTIVE_KEY, String(Date.now()));
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setAuthState({ token: null, authenticated: false });
    }
  };

  // Helper: get refresh token from store
  const getStoredRefreshToken = async () => {
    return await SecureStore.getItemAsync(REFRESH_TOKEN);
  };

  useEffect(() => {
    const loadToken = async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      // check is token exist or not
      const token = await SecureStore.getItem(TOKEN_KEY);
      const userInfo = await SecureStore.getItem(USER_KEY);
      const profileInfo = await SecureStore.getItem(USER_PROFILE_KEY);

      console.log("I am auth context");

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
        const userData = JSON.parse(JSON.stringify(userInfo));
        setUser(userData);
        const profileInfo = await SecureStore.getItem(USER_PROFILE_KEY);
        if (profileInfo) {
          setUserProfile(JSON.parse(profileInfo));
        }
      }
    };
    loadToken();
  }, []);

  // test added optional paramter
  const _register = async (
    username: string,
    fullName: string,
    mobile: string,
    email?: string,
    password?: string
  ) => {
    try {
      const request = {
        username: username,
        email,
        phone_number: `+91${mobile}`,
        full_name: fullName,
        password,
      };
      return await signup(request);
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const _login = async (userName: string, password: string) => {
    try {
      const request = {
        username: userName,
        password: password,
      };

      const result = await login(request);
      const { success, message, data } = result;

      if (success && "email" in data) {
        const { username, email, id, ...tokens } = data; // Destructuring user details separately
        const userInfo = {
          userId: id,
          username: username,
        };
        setAuthState({
          token: tokens.access,
          authenticated: true,
        });
        setUser(userInfo);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokens.access}`;

        await SecureStore.setItemAsync(TOKEN_KEY, tokens.access);

        await SecureStore.setItemAsync(REFRESH_TOKEN, tokens.refresh);

        await _fetchUserProfile();

        // await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userInfo));
      } else {
        console.error("Login failed:", message);
      }

      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  const _logout = async () => {
    const ref = await SecureStore.getItem(REFRESH_TOKEN);
    try {
      const request = {
        refresh: ref ?? "",
      };

      const result = await logout(request);

      if (result.success && result.message) {
        await SecureStore.setItemAsync(TOKEN_KEY, "");
        axios.defaults.headers.common["Authorization"] = "";
        await SecureStore.setItemAsync(USER_KEY, "");
        await SecureStore.setItemAsync(REFRESH_TOKEN, "");
        setUser({ userId: null, username: null });
        setAuthState({
          authenticated: false,
          token: null,
        });
      }
    } catch (e) {}
  };

  const _fetchUserProfile = async () => {
    try {
      const response = await getUserDetails(); // 👈 your backend endpoint
      if (response && response.length) {
        const usr = {
          id: response[0].id,
          username: response[0].username,
          email: response[0].email,
          first_name: response[0].first_name,
          last_name: response[0].last_name,
          userprofile: response[0].userprofile,
          usersettings: response[0].usersettings,
        };

        const profileInfo = await SecureStore.getItem(USER_PROFILE_KEY);
        await SecureStore.setItemAsync(USER_PROFILE_KEY, JSON.stringify(usr));
        setUserProfile(usr);
        return usr;
      }
      // return response;
    } catch (e) {
      console.error("Failed to fetch user profile", e);
      return null;
    }
  };

  const value = {
    onRegister: _register,
    onLogin: _login,
    onLogout: _logout,
    userProfile,
    authState,
    getUserDetails: _fetchUserProfile,
  };

  useProtectedRoute(authState);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
