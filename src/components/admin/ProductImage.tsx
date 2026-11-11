import { ImageIcon } from "lucide-react-native";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "@/constants/theme";

type Props = { name: string; image?: string; size?: number };

export function ProductImage({ name, image, size = 52 }: Props) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const style = { width: size, height: size, borderRadius: Math.min(12, size / 5) };
  if (image && failedImage !== image) return <Image accessibilityLabel={`Ảnh sản phẩm ${name}`} onError={() => setFailedImage(image)} source={{ uri: image }} style={[styles.image, style]} />;
  return <View accessibilityLabel={`Ảnh mặc định ${name}`} style={[styles.placeholder, style]}><ImageIcon color={colors.primaryDark} size={size * 0.42} /><Text numberOfLines={1} style={styles.label}>BC</Text></View>;
}

const styles = StyleSheet.create({ image: { backgroundColor: colors.blush }, placeholder: { alignItems: "center", justifyContent: "center", gap: 1, backgroundColor: colors.softPink }, label: { color: colors.primaryDark, fontSize: 9, fontWeight: "800" } });
