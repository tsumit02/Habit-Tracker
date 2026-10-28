import { Text, TextInput, View, type TextInputProps } from "react-native";
import { spacing, useAppTheme } from "../../theme";

type AppInputProps = TextInputProps & {
  label: string;
};

export default function AppInput({
  label,
  style,
  ...inputProps
}: AppInputProps) {
  const { colors } = useAppTheme();

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text
        style={{
          color: colors.text,
          fontSize: 14,
          fontWeight: "700",
          marginBottom: spacing.sm,
        }}
      >
        {label}
      </Text>

      <TextInput
        {...inputProps}
        placeholderTextColor={colors.textMuted}
        style={[
          {
            minHeight: 52,
            backgroundColor: colors.surfaceSecondary,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: spacing.radiusMd,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            color: colors.text,
            fontSize: 15,
          },
          style,
        ]}
      />
    </View>
  );
}
