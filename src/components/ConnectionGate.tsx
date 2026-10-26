
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  AppState,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Network from "expo-network";
import { Server, WifiOff, RefreshCw } from "lucide-react-native";

import { colors, spacing } from "../theme";

type ConnectionProblem = "network" | "server";

type ConnectionGateProps = {
  children: ReactNode;
};

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export default function ConnectionGate({
  children,
}: ConnectionGateProps) {
  const insets = useSafeAreaInsets();
  const [problem, setProblem] = useState<ConnectionProblem | null>(null);
  const [checking, setChecking] = useState(true);

  const checkConnection = useCallback(async () => {
  setChecking(true);
  setProblem(null);

    try {
      const network = await Network.getNetworkStateAsync();

      if (network.isConnected === false) {
        setProblem("network");
        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          setProblem("server");
          return;
        }

        setProblem(null);
      } catch {
        // A connected device with an unreachable API has a server
        // or network-path problem, not necessarily a total outage.
        setProblem("server");
      } finally {
        clearTimeout(timeout);
      }
    } catch {
      setProblem("network");
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
  // Check the connection on initial mount.
  void checkConnection();

  // React immediately when Wi-Fi or mobile connectivity changes.
  const networkSubscription = Network.addNetworkStateListener(
    (state) => {
      if (state.isConnected === false) {
        // Show the error immediately without waiting for a timeout.
        setProblem("network");
        setChecking(false);
      } else {
        // Connectivity returned: verify that the backend is reachable.
        void checkConnection();
      }
    }
  );

  // Recheck when the user returns to the app.
  const appStateSubscription = AppState.addEventListener(
    "change",
    (nextState) => {
      if (nextState === "active") {
        void checkConnection();
      }
    }
  );

  return () => {
    networkSubscription.remove();
    appStateSubscription.remove();
  };
}, [checkConnection]);

  if (checking && problem === null) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking connection...</Text>
      </View>
    );
  }

  if (problem === null) {
    return <>{children}</>;
  }

  const isNetworkError = problem === "network";

  return (
    <View
      style={[
        styles.screen,
        styles.centered,
        {
          paddingTop: Math.max(insets.top, spacing.lg),
          paddingBottom: Math.max(insets.bottom, spacing.lg),
        },
      ]}
    >
      <StatusBar barStyle="dark-content" />

      <View style={styles.iconCircle}>
        {isNetworkError ? (
          <WifiOff size={42} color={colors.danger} />
        ) : (
          <Server size={42} color={colors.danger} />
        )}
      </View>

      <Text style={styles.title}>
        {isNetworkError
          ? "No Network Connection"
          : "Server Unavailable"}
      </Text>

      <Text style={styles.description}>
        {isNetworkError
          ? "Check your Wi-Fi or mobile network, then try again."
          : "We couldn't reach the Habit Tracker server. Please make sure the server is running and try again."}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retry connection"
        disabled={checking}
        onPress={() => void checkConnection()}
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryPressed,
          checking && styles.retryDisabled,
        ]}
      >
        {checking ? (
          <ActivityIndicator color={colors.surface} />
        ) : (
          <RefreshCw size={18} color={colors.surface} />
        )}
        <Text style={styles.retryText}>
          {checking ? "Checking..." : "Try Again"}
        </Text>
      </Pressable>

      <Text style={styles.footer}>
        Your habits haven't been deleted. Please reconnect to continue.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    maxWidth: 340,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xxl,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignSelf: "stretch",
  },
  retryPressed: {
    opacity: 0.8,
  },
  retryDisabled: {
    opacity: 0.7,
  },
  retryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  footer: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: spacing.xl,
  },
});
