import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  header: {
    marginBottom: spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  screenTitle: {
    ...typography.screenTitle,
    color: colors.text,
  },
  headerIcon: {
    marginLeft: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  card: {
    marginBottom: spacing.lg,
  },
  overviewCard: {
    overflow: "hidden",
  },
  decorationTop: {
    position: "absolute",
    width: 145,
    height: 145,
    borderRadius: 73,
    backgroundColor: colors.primaryLight,
    right: -32,
    top: -40,
    opacity: 0.8,
  },
  decorationBottom: {
    position: "absolute",
    width: 115,
    height: 115,
    borderRadius: 58,
    backgroundColor: colors.pinkLight,
    left: -35,
    bottom: -45,
    opacity: 0.65,
  },

  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  sectionIcon: {
    width: 42,
    height: 42,
    borderRadius: spacing.radiusMd,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionIconPurple: {
    backgroundColor: colors.primaryLight,
  },
  sectionIconGreen: {
    backgroundColor: colors.successLight,
  },
  sectionIconOrange: {
    backgroundColor: colors.orangeLight,
  },
  sectionIconPink: {
    backgroundColor: colors.pinkLight,
  },
  sectionText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  overviewBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
  },
  ringPercentage: {
    fontSize: 27,
    fontWeight: "800",
    color: colors.text,
  },
  ringCaption: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  overviewDetails: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  overviewCount: {
    fontSize: 23,
    fontWeight: "800",
    color: colors.text,
  },
  overviewAccent: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    marginTop: spacing.xs,
  },
  overviewMessage: {
    fontSize: 12,
    lineHeight: 19,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },

  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: spacing.radiusLg,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.radiusMd,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 27,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.md,
  },
  statLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  chartContainer: {
    height: 165,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chartColumn: {
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 3,
  },
  chartCount: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  chartCountActive: {
    color: colors.primary,
  },
  chartCountInactive: {
    color: colors.textMuted,
  },
  chartBar: {
    width: "100%",
    maxWidth: 27,
    borderTopLeftRadius: spacing.sm,
    borderTopRightRadius: spacing.sm,
  },
  chartBarToday: {
    backgroundColor: colors.primary,
  },
  chartBarActive: {
    backgroundColor: colors.lavender,
  },
  chartBarEmpty: {
    backgroundColor: colors.primaryLight,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  chartLabelColumn: {
    flex: 1,
    alignItems: "center",
  },
  chartDay: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  chartDayToday: {
    fontWeight: "800",
    color: colors.primary,
  },
  chartDate: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  chartDateToday: {
    fontWeight: "700",
    color: colors.primary,
  },

  tipBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  tipDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  emptyState: {
    alignItems: "center",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyDescription: {
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceSecondary,
  },
  historyRowLast: {
    borderBottomWidth: 0,
  },
  habitEmoji: {
    width: 49,
    height: 49,
    borderRadius: spacing.radiusMd,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blueLight,
  },
  habitEmojiText: {
    fontSize: 25,
  },
  habitInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  habitTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  habitRecorded: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  streakBadge: {
    alignItems: "center",
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.orangeLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  streakNumber: {
    fontSize: 12,
    fontWeight: "800",
    color: "#C76D20",
    marginLeft: 4,
  },
  streakLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "#C76D20",
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.lg,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: colors.textMuted,
  },
});

export default styles;