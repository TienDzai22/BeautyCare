export const lightColors = {
  primary: "#D85A83",
  primaryDark: "#B83E66",
  secondary: "#F4A6BD",
  background: "#FFF8FA",
  surface: "#FFFFFF",
  text: "#402D36",
  muted: "#806B75",
  border: "#F1DCE4",
  softPink: "#FFF0F5",
  blush: "#FCE0E9",
  success: "#2F855A",
  danger: "#B4233C",
  textPrimary: "#402D36",
  textSecondary: "#806B75",
  textMuted: "#806B75",
  accentPink: "#D85A83",
  surfaceElevated: "#FFFFFF",
  onAccent: "#FFFFFF",
  onDanger: "#FFFFFF",
} as const;

export const darkColors = {
  primary: "#FF83AD",
  primaryDark: "#FFB2C9",
  secondary: "#A84F70",
  background: "#1D171C",
  surface: "#251C23",
  text: "#F8EDF2",
  muted: "#CBBCC6",
  border: "#493842",
  softPink: "#38212D",
  blush: "#4A2838",
  success: "#6DD89A",
  danger: "#FF8FA8",
  textPrimary: "#F8EDF2",
  textSecondary: "#CBBCC6",
  textMuted: "#BCAEB8",
  accentPink: "#FF83AD",
  surfaceElevated: "#30242D",
  onAccent: "#1D171C",
  onDanger: "#1D171C",
} as const;

/** Backwards-compatible light tokens. New components should use useTheme().colors. */
export const colors = lightColors;
export type AppColors = { [Key in keyof typeof lightColors]: string };

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#8D425B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
} as const;
