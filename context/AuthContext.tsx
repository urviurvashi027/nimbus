import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useContext, useState } from "react";
import { router, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import {
  login,
  signup,
  logout,
  getUserDetails,
  saveUpdateUser,
} from "@/services/loginService";
import { setStoredUser, User, getStoredUser } from "@/services/storageSerives";

// type UserL = {
//   userId: number | null;
//   username: string | null;
//   email?: string | null;
//   full_name?: string;
//   phone_number?: string;
// };

type UserProfile = {
  full_name?: string | null;
  phone_number?: string | null;
  id: number;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  profile: any;
  settings: any;
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
  updateProfile?: (val: any) => Promise<any>;
  loadUserFromStorage?: () => Promise<any>;
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
  const [user, setUser] = useState<User>();
  const [loggedInUser, setLoggedInUser] = useState<{
    email: string | null;
    username: string | null;
  } | null>();

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

  const loadUserFromStorage = useCallback(async (): Promise<User | null> => {
    const cached = await getStoredUser();
    // console.log(cached, "cached");
    if (cached) {
      // setUser(cached);
      // setUserProfile(cached as any);
    }
    return cached;
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);

      // check is token exist or not
      const token = await SecureStore.getItem(TOKEN_KEY);
      const userInfo = await SecureStore.getItem(USER_KEY);
      const profileInfo = await SecureStore.getItem(USER_PROFILE_KEY);

      // console.log("I am auth context");

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
        const { username, email, ...tokens } = data; // Destructuring user details separately
        const userInfo = {
          email: email,
          username: username,
        };
        setAuthState({
          token: tokens.access,
          authenticated: true,
        });
        setLoggedInUser(userInfo);

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
        setLoggedInUser({ username: null, email: null });
        setAuthState({
          authenticated: false,
          token: null,
        });
      }
    } catch (e) {}
  };

  // single place to update state + storage from server
  const applyServerUser = useCallback(async (serverUser: User) => {
    setUser(serverUser);
    await setStoredUser(serverUser);
  }, []);

  // public helpers
  // const setLocalUser = useCallback(async (u: User | null) => {
  //   setUser(u);
  //   await setStoredUser(u);
  // }, []);

  const _fetchUserProfile = async () => {
    try {
      const response = await getUserDetails(); // 👈 your backend endpoint
      const { success, message, data } = response;
      // console.log(response, "response auth context");
      const { username, email, id, ...tokens } = data;
      if (success && "email" in data) {
        // console.log(response, "conimg response auth context 2222");

        const {
          username,
          email,
          first_name,
          id,
          last_name,
          profile,
          settings,
          notifications,
          ...tokens
        } = data;
        const usr = {
          id: id,
          username: username,
          email: email,
          first_name: first_name,
          last_name: last_name,
          profile: profile,
          settings: settings,
          notifications: notifications,
        };
        await applyServerUser(usr);
        // const profileInfo = await SecureStore.getItem(USER_PROFILE_KEY);
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

  const updateProfile = useCallback(
    async (payload: any): Promise<any> => {
      try {
        const res = await saveUpdateUser(payload); // your API
        // if your API shape is { success, data: { user }, message }
        if (res?.success && res?.data) {
          const { success, message, data } = res;
          const {
            id,
            username,
            email,
            first_name,
            last_name,
            profile,
            settings,
            address,
            notifications,
            notification_preferences,
          } = data;
          const usr = {
            id: id,
            username: username,
            email: email,
            first_name: first_name,
            last_name: last_name,
            profile: profile,
            settings: settings,
            notifications: notifications,
          };
          await applyServerUser(usr); // keep app + storage in sync
        }
        return res; // caller decides what to do
      } catch (err: any) {
        // keep errors visible to caller
        return {
          success: false,
          message: err?.response?.data?.message ?? "Update failed",
        };
      }
    },
    [applyServerUser]
  );

  const value = {
    onRegister: _register,
    onLogin: _login,
    onLogout: _logout,
    userProfile,
    authState,
    getUserDetails: _fetchUserProfile,
    updateProfile: updateProfile,
    loadUserFromStorage: loadUserFromStorage,
  };

  useProtectedRoute(authState);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
