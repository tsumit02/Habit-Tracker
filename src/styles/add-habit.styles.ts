import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboard: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  screenTitle: {
    ...typography.screenTitle,
    color: colors.text,
  },
  screenSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sectionIcon: {
    width: 38,
    height: 38,
    borderRadius: spacing.radiusMd,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
    marginRight: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  sectionDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  emojiOption: {
    width: 52,
    height: 52,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 25,
  },
  selectedCheck: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  fieldLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  fieldGroup: {
    marginTop: spacing.lg,
  },

  frequencyList: {
    gap: spacing.sm,
  },
  frequencyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: spacing.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  frequencyOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  frequencyRadio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  frequencyRadioSelected: {
    borderColor: colors.primary,
  },
  frequencyRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  frequencyText: {
    flex: 1,
  },
  frequencyLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  frequencyDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  dayList: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  dayOption: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  dayOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },
  dayLabelSelected: {
    color: colors.surface,
  },
  helperText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md,
  },

  previewCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
    marginBottom: spacing.lg,
  },
  previewLabel: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  previewEmoji: {
    width: 48,
    height: 48,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  previewEmojiText: {
    fontSize: 25,
  },
  previewTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  previewSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: spacing.xs,
  },

  saveButton: {
    marginTop: spacing.xs,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    marginTop: spacing.xs,
  },
  deleteText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  customDaysLabel: {
  marginTop: spacing.xl,
  },
});

export default styles;