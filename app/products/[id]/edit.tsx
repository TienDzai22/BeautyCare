import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { appRoutes } from "@/constants/routes";
import { useTheme } from "@/contexts/ThemeContext";
import { useProduct } from "@/hooks/useProduct";

export default function EditProductScreen() { const { id: routeId } = useLocalSearchParams<{ id?: string | string[] }>(); const { product, loading, error, notFound } = useProduct(routeId); const { colors } = useTheme(); return <AdminShell active="products" title="Sửa sản phẩm" subtitle="Cập nhật thông tin mỹ phẩm"><Pressable onPress={() => router.replace(product ? appRoutes.product(product.id) : appRoutes.products)} style={styles.back}><ArrowLeft color={colors.primaryDark} size={19} /><Text style={[styles.backText, { color: colors.primaryDark }]}>Quay lại</Text></Pressable>{loading ? <View style={styles.loading}><Skeleton style={{ width: "100%", height: 360 }} /></View> : error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : notFound || !product ? <Text style={[styles.error, { color: colors.danger }]}>Không tìm thấy sản phẩm.</Text> : <ProductForm mode="edit" product={product} onCompleted={() => router.replace(appRoutes.product(product.id))} />}</AdminShell>; }
const styles = StyleSheet.create({ back: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start", paddingVertical: 4 }, backText: { fontSize: 13, fontWeight: "700" }, loading: { minHeight: 360 }, error: { minHeight: 200, textAlign: "center", fontSize: 14 } });
