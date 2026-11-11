import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

export function Skeleton({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme(); const opacity = useRef(new Animated.Value(0.45)).current;
  useEffect(() => { const animation = Animated.loop(Animated.sequence([Animated.timing(opacity, { toValue: 0.9, duration: 700, useNativeDriver: true }), Animated.timing(opacity, { toValue: 0.45, duration: 700, useNativeDriver: true })])); animation.start(); return () => animation.stop(); }, [opacity]);
  return <Animated.View style={[styles.base, { backgroundColor: colors.blush, opacity }, style]} />;
}
const styles = StyleSheet.create({ base: { borderRadius: 10 } });
