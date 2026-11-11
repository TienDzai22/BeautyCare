import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text } from "react-native";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { appRoutes } from "@/constants/routes";
import { useTheme } from "@/contexts/ThemeContext";

export default function NewProductScreen() { const { colors } = useTheme(); return <AdminShell active="products" title="Thêm sản phẩm" subtitle="Tạo hồ sơ mỹ phẩm mới"><Pressable onPress={() => router.replace(appRoutes.products)} style={styles.back}><ArrowLeft color={colors.primaryDark} size={19} /><Text style={[styles.backText, { color: colors.primaryDark }]}>Quay lại danh sách</Text></Pressable><ProductForm mode="add" onCompleted={() => router.replace(appRoutes.products)} /></AdminShell>; }
const styles = StyleSheet.create({ back: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", paddingVertical: 4 }, backText: { fontSize: 13, fontWeight: "700" } });
