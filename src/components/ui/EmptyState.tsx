import type { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { radii } from "@/constants/theme";
import { useTheme } from "@/contexts/ThemeContext";

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: { icon: LucideIcon; title: string; description: string; actionLabel?: string; onAction?: () => void }) {
  const { colors } = useTheme();
  return <View style={styles.wrap}><View style={[styles.icon, { backgroundColor: colors.softPink }]}><Icon color={colors.primary} size={32} /></View><Text style={[styles.title, { color: colors.text }]}>{title}</Text><Text style={[styles.description, { color: colors.muted }]}>{description}</Text>{actionLabel && onAction && <Pressable onPress={onAction} style={[styles.button, { backgroundColor: colors.primary }]}><Text style={styles.buttonText}>{actionLabel}</Text></Pressable>}</View>;
}
const styles = StyleSheet.create({ wrap: { minHeight: 220, alignItems: "center", justifyContent: "center", padding: 28 }, icon: { width: 64, height: 64, alignItems: "center", justifyContent: "center", borderRadius: 32 }, title: { marginTop: 14, fontSize: 17, fontWeight: "800" }, description: { maxWidth: 320, marginTop: 6, fontSize: 13, lineHeight: 19, textAlign: "center" }, button: { marginTop: 18, paddingHorizontal: 15, paddingVertical: 11, borderRadius: radii.sm }, buttonText: { color: "#fff", fontSize: 13, fontWeight: "700" } });
