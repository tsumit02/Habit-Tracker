import type { ReactNode } from "react";
import {
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, spacing } from "../../theme";

type AppCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
};

export default function AppCard({
  children,
  style,
  padding = spacing.cardPadding,
}: AppCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: spacing.radiusXl,
          padding,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.045,
          shadowRadius: 12,
          elevation: 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
