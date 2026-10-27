
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
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
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../services/api";
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
  const { validateSession } = useAuth();
  const [problem, setProblem] = useState<ConnectionProblem | null>(null);
  const [checking, setChecking] = useState(true);
  const checkInProgress = useRef(false);
  const lastSessionValidationAt = useRef(0);
  const wasConnected = useRef<boolean | null>(null);
  const lastAppStateCheck = useRef(0);

  const checkConnection = useCallback(async () => {

    if (checkInProgress.current) return;
    checkInProgress.current = true;

    setChecking(true);

    try {
      const network = await Network.getNetworkStateAsync();

     wasConnected.current = network.isConnected ?? null;

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
      } catch {
        setProblem("server");
        return;
      } finally {
        clearTimeout(timeout);
      }

      // Validate the saved JWT only after the server is reachable.
    const now = Date.now();

    if (now - lastSessionValidationAt.current >= 5000) {
      const sessionValid = await validateSession();

      if (!sessionValid) {
        setProblem("server");
        return;
      }

      lastSessionValidationAt.current = Date.now();
    }

      setProblem(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // The unauthorized handler has logged the user out.
        setProblem(null);
      } else {
        setProblem("server");
      }
    } finally {
      setChecking(false);
      checkInProgress.current = false;
    }
  }, [validateSession]);

  useEffect(() => {
  // Check the connection on initial mount.
  void checkConnection();

  // React immediately when Wi-Fi or mobile connectivity changes.
  const networkSubscription = Network.addNetworkStateListener(
    (state) => {
  const connected = state.isConnected === true;
  const previouslyConnected = wasConnected.current;

  wasConnected.current = state.isConnected ?? null;

  if (!connected) {
    setProblem("network");
    setChecking(false);
    return;
  }

  // Check only when connectivity transitions from offline to online.
  if (previouslyConnected === false) {
    void checkConnection();
  }
}
  );

  // Recheck when the user returns to the app.
  const appStateSubscription = AppState.addEventListener(
    "change",
    (nextState) => {
  if (nextState !== "active") return;

  const now = Date.now();

  if (now - lastAppStateCheck.current < 2000) return;

  lastAppStateCheck.current = now;
  void checkConnection();
}
  );

  return () => {
    networkSubscription.remove();
    appStateSubscription.remove();
  };
}, [checkConnection]);


  const isNetworkError = problem === "network";

  return (
    <View style={{ flex: 1 }}>
      {/* Keep navigation mounted so the current screen is preserved. */}
      {children}

      {checking && problem === null ? (
        <View style={[styles.screen, styles.centered, styles.overlay]}>
          <StatusBar barStyle="dark-content" />
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Checking connection...</Text>
        </View>
      ) : problem !== null ? (
        <View
          style={[
            styles.screen,
            styles.centered,
            styles.overlay,
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
      ) : null}
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
  overlay: {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 10,
  elevation: 10,
},
});
