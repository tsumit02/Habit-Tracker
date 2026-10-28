import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CheckCircle2,
  Heart,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react-native";

import { useAuth } from "../../context/AuthContext";
import { colors, spacing } from "../../theme";
import styles from "../../styles/about.styles";

export default function AboutScreen() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "";

  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
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
    ]);
  };

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>YOUR PERSONAL SPACE</Text>
          <Text style={styles.title}>Profile & About</Text>
          <Text style={styles.subtitle}>
            Your habit journey, all in one place.
          </Text>
        </View>

        {/* Profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            {initials ? (
              <Text style={styles.avatarText}>{initials}</Text>
            ) : (
              <UserRound size={32} color={colors.primary} />
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={2}>
              {user?.name?.trim() || "Your profile"}
            </Text>
            <Text style={styles.profileEmail} numberOfLines={2}>
              {user?.email || "Account information unavailable"}
            </Text>

            <View style={styles.memberBadge}>
              <Sparkles size={14} color={colors.primary} />
              <Text style={styles.memberBadgeText}>Habit Builder</Text>
            </View>
          </View>
        </View>

        {/* Your journey */}
        <Text style={styles.sectionTitle}>Your journey</Text>

        <View style={styles.sectionCard}>
          <View style={styles.menuRow}>
            <View style={styles.iconPurple}>
              <UserRound size={21} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>
                Personal information
              </Text>
              <Text style={styles.menuDescription}>
                {user?.name?.trim()
                  ? `Growing every day, ${user.name.trim().split(/\s+/)[0]}.`
                  : "Your account details will appear here."}
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.menuRow}>
            <View style={styles.iconGreen}>
              <CheckCircle2 size={21} color={colors.success} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>
                Consistency matters
              </Text>
              <Text style={styles.menuDescription}>
                Build small routines and celebrate your daily progress.
              </Text>
            </View>
          </View>
        </View>

        {/* About the app */}
        <Text style={styles.sectionTitle}>About the app</Text>

        <View style={styles.sectionCard}>
          <View style={styles.menuRow}>
            <View style={styles.iconPink}>
              <Heart size={21} color={colors.pink} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Habit Tracker</Text>
              <Text style={styles.menuDescription}>
                Build consistency, one day at a time.
              </Text>
            </View>
            <View style={styles.versionBadge}>
              <Text style={styles.versionText}>v1.0.0</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.menuRow}>
            <View style={styles.iconBlue}>
              <ShieldCheck size={21} color={colors.blue} />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>
                Progress over perfection
              </Text>
              <Text style={styles.menuDescription}>
                Small actions today create better habits tomorrow.
              </Text>
            </View>
          </View>
        </View>

        {/* Motivation */}
        <View style={styles.motivationCard}>
          <View style={styles.motivationIcon}>
            <Sparkles size={24} color={colors.primary} />
          </View>
          <Text style={styles.motivationTitle}>
            Every little win counts.
          </Text>
          <Text style={styles.motivationText}>
            You don't have to be perfect. Just keep showing up for
            yourself, one small step at a time.
          </Text>
        </View>

        {/* Logout */}
        <View style={styles.logoutCard}>
          <View style={styles.logoutIcon}>
            <LogOut size={20} color={colors.danger} />
          </View>

          <View style={styles.logoutText}>
            <Text style={styles.menuTitle}>Your account</Text>
            <Text style={styles.menuDescription}>
              Sign out of Habit Tracker.
            </Text>
          </View>

          <Text
            accessibilityRole="button"
            onPress={isLoggingOut ? undefined : handleLogout}
            style={[
              styles.logoutButtonText,
              isLoggingOut && styles.disabledLogout,
            ]}
          >
            {isLoggingOut ? "Please wait..." : "Log out"}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made for your everyday growth
          </Text>
          <Text style={styles.footerText}>
            Habit Tracker · Keep growing
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
