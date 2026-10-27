import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckCircle2,
  Flame,
  Heart,
  LogOut,
  Repeat2,
  Sparkles,
  Target,
} from "lucide-react-native";

import { AppCard, AppButton } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { colors, spacing } from "../../theme";
import styles from "../../styles/about.styles";

const features = [
  {
    title: "Build consistent habits",
    description:
      "Create daily routines and turn small actions into lasting habits.",
    icon: Target,
    color: colors.primary,
    background: colors.primaryLight,
  },
  {
    title: "Track your progress",
    description:
      "See your completed habits, weekly activity, and consistency over time.",
    icon: CheckCircle2,
    color: colors.success,
    background: colors.successLight,
  },
  {
    title: "Keep your streak alive",
    description:
      "Celebrate your daily wins and stay motivated to keep going.",
    icon: Flame,
    color: colors.orange,
    background: colors.orangeLight,
  },
  {
    title: "Make progress your way",
    description:
      "Choose your habit schedules and build a routine that fits your life.",
    icon: Repeat2,
    color: colors.pink,
    background: colors.pinkLight,
  },
];

export default function AboutScreen() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              await logout();
            } catch (error) {
              console.error("Logout failed:", error);
              Alert.alert("Error", "Unable to log out. Please try again.");
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>About Habit Tracker</Text>
          <Text style={styles.subtitle}>
            A little progress every day adds up to big changes.
          </Text>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Sparkles size={30} color={colors.surface} />
          </View>

          <Text style={styles.heroTitle}>
            Small steps. Big changes.
          </Text>

          <Text style={styles.heroDescription}>
            Your personal space to create better routines, celebrate
            small wins, and become more consistent one day at a time.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>What you can do</Text>

        <AppCard style={styles.featureCard}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLast = index === features.length - 1;

            return (
              <View
                key={feature.title}
                style={[
                  styles.featureRow,
                  isLast && styles.featureRowLast,
                ]}
              >
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: feature.background },
                  ]}
                >
                  <Icon size={23} color={feature.color} />
                </View>

                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </AppCard>

        <View style={styles.motivationCard}>
          <Heart size={25} color={colors.primary} />

          <Text style={styles.motivationTitle}>
            Progress over perfection
          </Text>

          <Text style={styles.motivationText}>
            You don't have to be perfect. Just keep showing up for
            yourself, one small step at a time.
          </Text>
        </View>
        <View style={{ marginTop: spacing.md, marginBottom: spacing.xl }}>
  <AppButton
    title={isLoggingOut ? "Logging out..." : "Log out"}
    onPress={handleLogout}
    disabled={isLoggingOut}
    variant="danger"
    icon={<LogOut size={18} color={colors.danger} />}
  />
</View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made for your everyday growth
          </Text>
          <Text
            style={[
              styles.footerText,
              { marginTop: spacing.xs },
            ]}
          >
            Habit Tracker · Keep growing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}