
import "../../global.css";
import { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";

import { HabitProvider } from "../context/HabitContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import ConnectionGate from "../components/ConnectionGate";
import { ThemeProvider } from "../theme/ThemeProvider";

function RouteGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const onLoginScreen = pathname === "/login";

    if (!isAuthenticated && !onLoginScreen) {
      router.replace("/login" as never);
    } else if (isAuthenticated && onLoginScreen) {
      router.replace("/(tabs)" as never);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HabitProvider>
          <ConnectionGate>
            <RouteGuard />
          </ConnectionGate>
        </HabitProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
