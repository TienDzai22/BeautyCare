import { AlertCircle, Eye, EyeOff, Flower2, LockKeyhole, Mail, Moon, Sun } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, radii, shadows } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { firebaseConfigStatus } from "@/services/firebase";
import { useTheme } from "@/contexts/ThemeContext";

function getLoginErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "Email hoặc mật khẩu không đúng.";
  if (code.includes("invalid-email")) return "Email chưa đúng định dạng.";
  if (code.includes("too-many-requests")) return "Có quá nhiều lần thử. Vui lòng thử lại sau.";
  if (code.includes("network-request-failed")) return "Không thể kết nối mạng. Vui lòng thử lại.";
  if (error instanceof Error && error.message === "firebase-not-configured") return "Firebase chưa được cấu hình đầy đủ.";
  return "Không thể đăng nhập. Hãy kiểm tra Firebase Authentication và thử lại.";
}

export default function LoginScreen() {
  const { isLoading, signIn } = useAuth();
  const { colors: themeColors, mode, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || !password) {
      setErrorMessage("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error) {
      setErrorMessage(getLoginErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = !firebaseConfigStatus.configured || isSubmitting || isLoading;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />
      <Pressable accessibilityLabel="Đổi chế độ sáng tối" onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: themeColors.softPink }]}>{mode === "dark" ? <Sun color={themeColors.primary} size={19} /> : <Moon color={themeColors.primaryDark} size={19} />}</Pressable>
      <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
        <View style={styles.logo}><Flower2 color={colors.primary} size={38} strokeWidth={1.8} /></View>
        <Text style={[styles.brand, { color: themeColors.text }]}>BeautyCare</Text>
        <Text style={[styles.tagline, { color: themeColors.muted }]}>Đăng nhập quản trị Spa & Beauty</Text>
        {!firebaseConfigStatus.configured && <View style={styles.notice}><AlertCircle color={colors.primaryDark} size={20} /><Text style={styles.noticeText}>Cần cấu hình Firebase trước khi đăng nhập.</Text></View>}
        <View style={styles.form}>
          <Text style={[styles.label, { color: themeColors.text }]}>Email quản trị</Text>
          <View style={[styles.inputWrap, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
            <Mail color={themeColors.muted} size={19} />
            <TextInput accessibilityLabel="Email quản trị" autoCapitalize="none" autoComplete="email" keyboardType="email-address" onChangeText={setEmail} placeholder="admin@beautycare.vn" placeholderTextColor={themeColors.muted} style={[styles.input, { color: themeColors.text }]} value={email} />
          </View>
          <Text style={[styles.label, { color: themeColors.text }]}>Mật khẩu</Text>
          <View style={[styles.inputWrap, { backgroundColor: themeColors.background, borderColor: themeColors.border }]}>
            <LockKeyhole color={themeColors.muted} size={19} />
            <TextInput accessibilityLabel="Mật khẩu quản trị" autoComplete="current-password" onChangeText={setPassword} placeholder="Nhập mật khẩu" placeholderTextColor={themeColors.muted} secureTextEntry={!isPasswordVisible} style={[styles.input, { color: themeColors.text }]} value={password} />
            <Pressable accessibilityLabel={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"} hitSlop={10} onPress={() => setIsPasswordVisible((value) => !value)}>{isPasswordVisible ? <EyeOff color={themeColors.muted} size={19} /> : <Eye color={themeColors.muted} size={19} />}</Pressable>
          </View>
          {errorMessage && <Text accessibilityRole="alert" style={styles.error}>{errorMessage}</Text>}
          <Pressable accessibilityRole="button" disabled={disabled} onPress={submit} style={({ pressed }) => [styles.button, disabled && styles.buttonDisabled, pressed && !disabled && styles.buttonPressed]}>
            {isSubmitting ? <ActivityIndicator color={themeColors.onAccent} /> : <Text style={[styles.buttonText, { color: themeColors.onAccent }]}>Đăng nhập</Text>}
          </Pressable>
        </View>
        <Text style={[styles.helper, { color: themeColors.muted }]}>Chỉ tài khoản Admin đã được cấp quyền mới có thể đọc hồ sơ khách hàng.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: colors.background, overflow: "hidden" },
  themeButton: { position: "absolute", zIndex: 2, top: 24, right: 24, width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19 },
  orbTop: { position: "absolute", width: 340, height: 340, borderRadius: 170, top: -130, right: -120, backgroundColor: colors.blush, opacity: 0.7 },
  orbBottom: { position: "absolute", width: 280, height: 280, borderRadius: 140, bottom: -120, left: -120, backgroundColor: colors.secondary, opacity: 0.18 },
  card: { width: "100%", maxWidth: 460, padding: 32, backgroundColor: colors.surface, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  logo: { alignSelf: "center", alignItems: "center", justifyContent: "center", width: 72, height: 72, borderRadius: 36, backgroundColor: colors.softPink },
  brand: { marginTop: 16, color: colors.text, fontSize: 30, fontWeight: "700", letterSpacing: -0.5, textAlign: "center" },
  tagline: { marginTop: 6, color: colors.muted, fontSize: 15, textAlign: "center" },
  notice: { flexDirection: "row", gap: 10, marginTop: 24, padding: 13, backgroundColor: colors.softPink, borderRadius: radii.sm },
  noticeText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 19 },
  form: { marginTop: 28, gap: 9 },
  label: { marginTop: 7, color: colors.text, fontSize: 14, fontWeight: "600" },
  inputWrap: { height: 52, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 15, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: "#FFFDFE" },
  input: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 0 },
  error: { marginTop: 4, color: colors.danger, fontSize: 13, lineHeight: 19 },
  button: { height: 52, alignItems: "center", justifyContent: "center", marginTop: 15, borderRadius: radii.sm, backgroundColor: colors.primary },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonDisabled: { opacity: 0.58 },
  buttonText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
  helper: { marginTop: 20, color: colors.muted, fontSize: 12, lineHeight: 18, textAlign: "center" },
});
