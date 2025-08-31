// ThemeContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme as themeKit } from "@/constant/theme/Colors";
import { useColorScheme } from "react-native";
import { ColorSet, Spacing, Typography } from "@/types/themeTypes";

// export const saveString = async (key: any, value: any) => {
//   try {
//     await AsyncStorage.setItem(key, value);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// export const save = async (key: any, value: any) =>
//   saveString(key, JSON.stringify(value));

// export const get = async (key: any) => {
//   try {
//     const itemString = await AsyncStorage.getItem(key);
//     if (itemString) {
//       return JSON.parse(itemString);
//     } else {
//       return null;
//     }
//   } catch (error) {
//     return null;
//   }
// };

// 1. Define the shape of our context data
interface ThemeContextData {
  theme: "basic" | "light" | "dark";
  toggleTheme: (newTheme: "basic" | "light" | "dark") => void;
  useSystemTheme: () => void;
  newTheme: ColorSet;
  spacing: Spacing;
  typography: Typography;
}

// 2. Create the context with a default value (or undefined)
const ThemeContext = createContext<ThemeContextData>({
  toggleTheme: (newTheme: "basic" | "light" | "dark") => {},
  theme: "light",
  newTheme: themeKit.dark,
  spacing: themeKit.spacing,
  typography: themeKit.typography,
  useSystemTheme: () => {},
});

// 3. Define props for our provider
interface ThemeProviderProps {
  children: ReactNode;
}

// 4. Create the provider component
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  // const [themeValue, setThemeValue] = useState("");
  const [theme, setTheme] = useState<"basic" | "light" | "dark">(
    colorScheme || "light"
  );

  const mainTheme = themeKit.dark;

  // const [initialValue, setInitialValue] = useState(0);

  //   const data = [
  //     {
  //       label: "Light Mode",
  //       value: "light",
  //     },
  //     {
  //       label: "Dark Mode",
  //       value: "dark",
  //     },
  //     {
  //       label: "System Default",
  //       value: "default",
  //     },
  //   ];

  useEffect(() => {
    // set theme to system selected theme
    if (colorScheme) {
      setTheme(colorScheme);
    }
  }, [colorScheme]);

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = (await AsyncStorage.getItem("theme")) as
          | "basic"
          | "light"
          | "dark";
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (error) {}
    };
    getTheme();
  }, []);

  const toggleTheme = (newTheme: "basic" | "light" | "dark") => {
    setTheme(newTheme);
    AsyncStorage.setItem("theme", newTheme).catch((error) =>
      console.log("Error saving theme:", error)
    );
  };

  const useSystemTheme = () => {
    if (colorScheme) setTheme(colorScheme);
    if (colorScheme) AsyncStorage.setItem("theme", colorScheme);
  };

  // const setAppTheme = useCallback(async () => {
  //   const IS_FIRST = await get("IS_FIRST");
  //   if (IS_FIRST === null) {
  //     save("Theme", colorScheme);
  //     save("IsDefault", true);
  //     save("IS_FIRST", true);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  //  useEffect(() => {
  //    setAppTheme();
  //  }, [setAppTheme]);

  //    const setThemeApp = useCallback(async (theme: any, isDefault: any) => {
  //      save("Theme", theme);
  //      save("IsDefault", isDefault);
  //      setThemeValue(theme);
  //    }, []);

  //  const themeOperations = (theme: any) => {
  //    switch (theme) {
  //      case "dark":
  //        setThemeApp(theme, false);
  //        setInitialValue(2);
  //        return;
  //      case "light":
  //        setThemeApp(theme, false);
  //        setInitialValue(1);
  //        return;
  //      case "default":
  //        setThemeApp(theme, true);
  //        setInitialValue(3);
  //        return;
  //    }
  //  };

  //    const getAppTheme = useCallback(async () => {
  //      const theme = await get("Theme");
  //      const isDefault = await get("IsDefault");
  //      isDefault ? themeOperations("default") : themeOperations(theme);
  //      // eslint-disable-next-line react-hooks/exhaustive-deps
  //    }, []);

  //   useEffect(() => {
  //     getAppTheme();
  //   }, [getAppTheme]);

  // 2. Create the full context value that matches the interface
  const contextValue: ThemeContextData = {
    theme,
    toggleTheme,
    useSystemTheme,
    newTheme: mainTheme, // Pass the colors from the current theme
    spacing: themeKit.spacing, // Pass the spacing object
    typography: themeKit.typography, // Pass the typography object
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
