import { StyleSheet } from "react-native";
import { colors, spacing, typography } from "../theme";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.screenTop,
    paddingBottom: spacing.screenBottom,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.screenTitle,
    color: colors.text,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: spacing.radiusXl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    overflow: "hidden",
  },
  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: spacing.radiusLg,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  heroDescription: {
    color: "#EEECFF",
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  featureCard: {
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  featureRowLast: {
    marginBottom: 0,
  },
  featureIcon: {
    width: 46,
    height: 46,
    borderRadius: spacing.radiusMd,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  featureDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  motivationCard: {
    backgroundColor: colors.lavenderLight,
    borderRadius: spacing.radiusXl,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  motivationTitle: {
    color: colors.primaryDark,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  motivationText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.sm,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
});

export default styles;