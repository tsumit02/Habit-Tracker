
import type { ReactNode } from "react";
import {
  Pressable,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, spacing } from "../../theme";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  icon,
  variant = "primary",
  disabled = false,
  style,
}: AppButtonProps) {
  const backgroundColor =
    variant === "primary"
      ? colors.primary
      : variant === "danger"
        ? colors.dangerLight
        : colors.primaryLight;

  const textColor =
    variant === "primary"
      ? colors.surface
      : variant === "danger"
        ? colors.danger
        : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        {
          minHeight: 54,
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.md,
          borderRadius: spacing.radiusLg,
          backgroundColor,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {icon}
      <Text
        style={{
          color: textColor,
          fontSize: 15,
          fontWeight: "700",
          marginLeft: icon ? spacing.sm : 0,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
