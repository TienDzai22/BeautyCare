import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { darkColors, lightColors, type AppColors } from "@/constants/theme";

const THEME_STORAGE_KEY = "beautycare.theme";
type ThemeMode = "light" | "dark";
type ThemeValue = { mode: ThemeMode; colors: AppColors; toggleTheme: () => void; isReady: boolean };
const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    void AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === "dark" || saved === "light") setMode(saved);
    }).finally(() => setIsReady(true));
  }, []);
  const value = useMemo<ThemeValue>(() => ({
    mode,
    colors: mode === "dark" ? darkColors : lightColors,
    isReady,
    toggleTheme: () => setMode((current) => {
      const next = current === "light" ? "dark" : "light";
      void AsyncStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    }),
  }), [isReady, mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
