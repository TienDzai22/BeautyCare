import { router, Stack, usePathname, useRootNavigationState, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

/** Guards both normal navigation and direct deep links on web/Android. */
function AuthRouteGate() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !navigationState?.key) return;

    const isLoginRoute = segments[0] === "login";
    const isIndexRoute = pathname === "/";
    if (!user && !isLoginRoute) {
      router.replace("/login");
    } else if (user && (isLoginRoute || isIndexRoute)) {
      router.replace("/dashboard");
    }
  }, [isLoading, navigationState?.key, pathname, segments, user]);

  return null;
}

function ThemedStack() {
  const { colors, mode } = useTheme();
  const { isLoading } = useAuth();
  return <><StatusBar style={mode === "dark" ? "light" : "dark"} /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} /><AuthRouteGate />{isLoading && <View pointerEvents="auto" style={[styles.authLoading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} size="large" /></View>}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <ThemedStack />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ authLoading: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" } });
