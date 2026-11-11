import { CheckCircle2, CircleAlert, Info, TriangleAlert, X } from "lucide-react-native";
import { createContext, useCallback, useContext, useMemo, useRef, useState, type PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { radii } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export type ToastType = "success" | "error" | "warning" | "info";
type Toast = { id: number; type: ToastType; message: string };
type ToastContextValue = { showToast: (type: ToastType, message: string) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const dismiss = useCallback((id: number) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const showToast = useCallback((type: ToastType, message: string) => {
    const id = ++nextId.current;
    setToasts((current) => [...current.slice(-2), { id, type, message }]);
    setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);
  const value = useMemo(() => ({ showToast }), [showToast]);
  const config = { success: [CheckCircle2, colors.success], error: [CircleAlert, colors.danger], warning: [TriangleAlert, colors.primary], info: [Info, colors.primaryDark] } as const;
  return <ToastContext.Provider value={value}>{children}<View accessibilityLiveRegion="polite" pointerEvents="box-none" style={styles.region}>{toasts.map((toast) => { const [Icon, tint] = config[toast.type]; return <View key={toast.id} accessibilityRole="alert" style={[styles.toast, { backgroundColor: colors.surface, borderColor: colors.border }]}><Icon color={tint} size={20} /><Text style={[styles.message, { color: colors.text }]}>{toast.message}</Text><Pressable accessibilityLabel="Đóng thông báo" hitSlop={10} onPress={() => dismiss(toast.id)}><X color={colors.muted} size={18} /></Pressable></View>; })}</View></ToastContext.Provider>;
}

export function useToast() { const value = useContext(ToastContext); if (!value) throw new Error("useToast must be used inside ToastProvider"); return value; }
const styles = StyleSheet.create({ region: { position: "absolute", zIndex: 100, top: 20, right: 16, left: 16, alignItems: "center", gap: 8 }, toast: { width: "100%", maxWidth: 460, flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderWidth: 1, borderRadius: radii.md, shadowColor: "#000", shadowOpacity: 0.16, shadowRadius: 16, elevation: 8 }, message: { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: "600" } });
