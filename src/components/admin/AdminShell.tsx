import { router } from "expo-router";
import { House, LogOut, Moon, Package, Sparkles, Sun } from "lucide-react-native";
import { type PropsWithChildren } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radii, shadows } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { appRoutes } from "@/constants/routes";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/contexts/ToastContext";

type Props = PropsWithChildren<{ active: "dashboard" | "products"; title: string; subtitle: string }>;

export function AdminShell({ active, title, subtitle, children }: Props) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const { user, isSigningOut, signOutAdmin: firebaseSignOut } = useAuth();
  const { colors: themeColors, mode, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = (to: typeof appRoutes.dashboard | typeof appRoutes.products) => router.replace(to);
  const signOutAdmin = async () => {
    if (isSigningOut) return;
    try {
      await firebaseSignOut();
      // Reset history only after Firebase has confirmed sign-out.
      router.dismissAll();
      router.replace("/login");
    } catch {
      showToast("error", "Không thể đăng xuất. Vui lòng thử lại.");
    }
  };

  const navigation = (
    <View pointerEvents={isSigningOut ? "none" : "auto"} style={[styles.navigation, compact && styles.navigationCompact, compact && { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
      {isSigningOut && <Text accessibilityLiveRegion="polite" style={[styles.signOutProgress, { color: themeColors.muted }]}>Đang đăng xuất...</Text>}
      {!compact && <><View style={styles.brandMark}><Sparkles color={themeColors.accentPink} size={26} /><View><Text style={[styles.brand, { color: themeColors.textPrimary }]}>BeautyCare</Text><Text style={[styles.brandSub, { color: themeColors.accentPink }]}>SPA & BEAUTY</Text></View></View><View style={[styles.divider, { backgroundColor: themeColors.border }]} /></>}
      <Pressable onPress={() => navigate(appRoutes.dashboard)} style={[styles.navItem, active === "dashboard" && { backgroundColor: themeColors.accentPink }]}><House color={active === "dashboard" ? "#fff" : themeColors.primaryDark} size={20} /><Text style={[styles.navText, { color: themeColors.textPrimary }, active === "dashboard" && styles.navTextActive]}>Tổng quan</Text></Pressable>
      <Pressable onPress={() => navigate(appRoutes.products)} style={[styles.navItem, active === "products" && { backgroundColor: themeColors.accentPink }]}><Package color={active === "products" ? "#fff" : themeColors.primaryDark} size={20} /><Text style={[styles.navText, { color: themeColors.textPrimary }, active === "products" && styles.navTextActive]}>Sản phẩm</Text></Pressable>
      <Pressable onPress={() => void signOutAdmin()} style={[styles.navItem, styles.signOut]}><LogOut color={themeColors.danger} size={20} /><Text style={[styles.signOutText, { color: themeColors.danger }]}>Đăng xuất</Text></Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.frame, compact && styles.frameCompact]}>
        {compact && <View style={[styles.mobileTop, { backgroundColor: themeColors.softPink }]}><View><Text style={[styles.mobileBrand, { color: themeColors.textPrimary }]}>BeautyCare</Text><Text style={[styles.mobileSub, { color: themeColors.accentPink }]}>Admin Spa & Beauty</Text></View></View>}
        {!compact && <View style={[styles.sidebar, { backgroundColor: themeColors.softPink }]}>{navigation}</View>}
        <View style={[styles.main, { backgroundColor: themeColors.surface }]}>
          {compact && navigation}
          <View style={[styles.header, { borderColor: themeColors.border }]}><View><Text style={[styles.title, { color: themeColors.text }]}>{title}</Text><Text style={[styles.subtitle, { color: themeColors.muted }]}>{subtitle}</Text></View><View style={styles.adminChip}><Pressable accessibilityLabel="Đổi chế độ sáng tối" onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: themeColors.softPink }]}>{mode === "dark" ? <Sun color={themeColors.primary} size={18} /> : <Moon color={themeColors.primaryDark} size={18} />}</Pressable><View style={[styles.adminAvatar, { backgroundColor: themeColors.secondary }]}><Text style={styles.adminInitial}>{(user?.email?.[0] ?? "A").toUpperCase()}</Text></View>{!compact && <View><Text style={[styles.adminName, { color: themeColors.text }]}>Admin</Text><Text numberOfLines={1} style={[styles.adminEmail, { color: themeColors.muted }]}>{user?.email}</Text></View>}</View></View>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  frame: { flex: 1, flexDirection: "row", padding: 18, gap: 18 },
  frameCompact: { flexDirection: "column", padding: 0, gap: 0 },
  sidebar: { width: 232, borderRadius: radii.lg, backgroundColor: "#FFF1F6", overflow: "hidden", ...shadows.card },
  navigation: { gap: 8, padding: 16 },
  navigationCompact: { flexDirection: "row", gap: 7, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  brandMark: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10 },
  brand: { color: colors.text, fontSize: 18, fontWeight: "800" },
  brandSub: { marginTop: 1, color: colors.primaryDark, fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  divider: { height: 1, marginVertical: 14, backgroundColor: colors.border },
  navItem: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 46, paddingHorizontal: 13, borderRadius: radii.sm },
  navActive: { backgroundColor: colors.primary },
  navText: { color: colors.text, fontSize: 14, fontWeight: "600" },
  navTextActive: { color: colors.surface },
  signOut: { marginTop: "auto" },
  signOutProgress: { paddingHorizontal: 13, fontSize: 12, fontWeight: "600" },
  signOutText: { color: colors.danger, fontSize: 14, fontWeight: "600" },
  main: { flex: 1, minWidth: 0, borderRadius: radii.lg, backgroundColor: colors.surface, overflow: "hidden", ...shadows.card },
  mobileTop: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: "#FFF1F6" },
  mobileBrand: { color: colors.text, fontSize: 20, fontWeight: "800" },
  mobileSub: { marginTop: 2, color: colors.primaryDark, fontSize: 11, fontWeight: "600" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 28, paddingVertical: 22, borderBottomWidth: 1, borderColor: "#FAEDF1" },
  title: { color: colors.text, fontSize: 25, fontWeight: "800", letterSpacing: -0.4 },
  subtitle: { marginTop: 4, color: colors.muted, fontSize: 14 },
  adminChip: { flexDirection: "row", alignItems: "center", gap: 9, maxWidth: 210 },
  adminAvatar: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: colors.secondary },
  themeButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17 },
  adminInitial: { color: colors.surface, fontSize: 14, fontWeight: "800" },
  adminName: { color: colors.text, fontSize: 13, fontWeight: "700" },
  adminEmail: { maxWidth: 150, marginTop: 1, color: colors.muted, fontSize: 11 },
  content: { flexGrow: 1, padding: 28, gap: 20 },
});
