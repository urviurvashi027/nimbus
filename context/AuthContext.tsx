import { ReactNode, createContext, useEffect } from "react";
import { useContext, useState } from "react";
import { router, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { login, signup, logout } from "@/services/loginService";

type User = {
  userId: number | null;
  userName: string | null;
};

// type AuthProvider = {
//   user: User | null;
//   login: (username: string, password: string) => boolean;
//   logout: () => void;
// };

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (
    // test added optional paramter
    email: string,
    password: string,
    username?: string,
    fullname?: string
  ) => Promise<any>;
  onLogin?: (userName: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
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
    // const inAuthGroup = segments[0] === "(auth)";

    const inAuthGroup = segments[0] === "(auth)";

    if (!authState.authenticated && inAuthGroup) {
      router.replace("/landing");
    } else if (authState.authenticated && !inAuthGroup) {
      router.replace("/(auth)/(tabs)");
    } else {
      router.replace("/landing");
    }
  }, [authState.authenticated]);
}

const TOKEN_KEY = "my-jwt";
const USER_KEY = "user";
const REFRESH_TOKEN = "refresh-token";
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{
    userId: number | null;
    userName: string | null;
  }>({ userId: null, userName: null });

  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({ token: null, authenticated: false });

  useEffect(() => {
    const loadToken = async () => {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      // await SecureStore.deleteItemAsync(TOKEN_KEY);
      const token = await SecureStore.getItem(TOKEN_KEY);
      const userInfo = await SecureStore.getItem(USER_KEY);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
        const userData = JSON.parse(JSON.stringify(userInfo));
        setUser(userData);
      }
    };
    loadToken();
  }, []);

  // test added optional paramter
  const _register = async (
    userName: string,
    fullName: string,
    email?: string,
    password?: string
  ) => {
    try {
      const request = {
        username: userName,
        email,
        full_name: fullName,
        password,
      };
      return await signup(request);
      // return await axios.post(`${URL}/register/`, { email, password });
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

      // const result = {
      //   data: {
      //     token: "kjshdkjgfkjdsgfjksgdkjfsgdjg",
      //   },
      // };

      const { success, message, data } = result;

      if (success) {
        const { username, email, id, ...tokens } = data; // Destructuring user details separately
        const userInfo = {
          userId: id,
          userName: username,
        };
        setAuthState({
          token: tokens.access,
          authenticated: true,
        });

        setUser(userInfo);

        // Optionally, save tokens to AsyncStorage

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${tokens.access}`;

        await SecureStore.setItemAsync(TOKEN_KEY, tokens.access);

        await SecureStore.setItemAsync(REFRESH_TOKEN, tokens.refresh);

        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userInfo));
      } else {
        console.error("Login failed:", message);
      }

      return result;
    } catch (e) {
      return { error: true, msg: (e as any).response.data.msg };
    }
  };

  // const login = (username: string, password: string) => {
  //   setUser({
  //     id: "1",
  //     username: username,
  //   });

  //   return true;
  // };

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
        setUser({ userId: null, userName: null });
        setAuthState({
          authenticated: false,
          token: null,
        });
      }
    } catch (e) {}
  };

  const value = {
    onRegister: _register,
    onLogin: _login,
    onLogout: _logout,
    user,
    authState,
  };

  useProtectedRoute(authState);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  // return (
  //   <AuthContext.Provider value={{ user, login, logout }}>
  //     {children}
  //   </AuthContext.Provider>
  // );
}
